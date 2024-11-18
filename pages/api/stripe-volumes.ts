import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';

interface ChartData {
  date: string;
  gross: number;
  net: number;
  newCustomers: number;
  mrr: number;
  churnRate: number;
  avgRevenuePerCustomer: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
}

interface ResponseData {
  dailyData: ChartData[];
  totals: {
    gross: number;
    net: number;
    newCustomers: number;
    currentMRR: number;
    avgChurnRate: number;
    customerLifetimeValue: number;
    activeSubscriptions: number;
  }
}

interface ErrorResponse {
  message: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ResponseData | ErrorResponse>
): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2024-10-28.acacia',
    });

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const [
      balanceTransactions,
      customers,
      subscriptions,
      canceledSubscriptions
    ] = await Promise.all([
      // Get balance transactions for revenue data
      stripe.balanceTransactions.list({
        created: {
          gte: parseInt((startDate.getTime() / 1000).toString()),
          lte: parseInt((endDate.getTime() / 1000).toString())
        },
        type: 'charge',
        limit: 100,
      }),
      // Get customers created in the period
      stripe.customers.list({
        created: {
          gte: parseInt((startDate.getTime() / 1000).toString()),
          lte: parseInt((endDate.getTime() / 1000).toString())
        },
        limit: 100,
      }),
      // Get active subscriptions
      stripe.subscriptions.list({
        status: 'active',
        limit: 100,
      }),
      // Get canceled subscriptions in the period
      stripe.subscriptions.list({
        status: 'canceled',
        created: {
          gte: parseInt((startDate.getTime() / 1000).toString()),
          lte: parseInt((endDate.getTime() / 1000).toString())
        },
        limit: 100,
      })
    ]);

    const dailyTotals: Record<string, {
      gross: number;
      net: number;
      newCustomers: number;
      mrr: number;
      activeSubscriptions: number;
      canceledSubscriptions: number;
      churnRate: number;
      avgRevenuePerCustomer: number;
    }> = {};

    const totals = {
      gross: 0,
      net: 0,
      newCustomers: 0,
      currentMRR: 0,
      avgChurnRate: 0,
      customerLifetimeValue: 0,
      activeSubscriptions: subscriptions.data.length
    };

    // Initialize all days in the range with 0
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toLocaleDateString('en-CA');
      dailyTotals[dateStr] = {
        gross: 0,
        net: 0,
        newCustomers: 0,
        mrr: 0,
        activeSubscriptions: 0,
        canceledSubscriptions: 0,
        churnRate: 0,
        avgRevenuePerCustomer: 0
      };
    }

    // Calculate daily totals from balance transactions
    balanceTransactions.data.forEach((transaction) => {
      const date = new Date(transaction.created * 1000);
      const dateStr = date.toLocaleDateString('en-CA');
      
      if (dateStr in dailyTotals) {
        dailyTotals[dateStr].gross += transaction.amount;
        dailyTotals[dateStr].net += transaction.net;
        
        totals.gross += transaction.amount/100;
        totals.net += transaction.net/100;
      }
    });

    // Calculate MRR from active subscriptions
    let totalMRR = 0;
    subscriptions.data.forEach((subscription) => {
      if (subscription.status === 'active') {
        const mrr = subscription.items.data.reduce((acc, item) => {
          return acc + (item.price?.unit_amount ?? 0) * (item.quantity ?? 1);
        }, 0);
        totalMRR += mrr;
      }
    });
    totals.currentMRR = totalMRR / 100; // Convert to dollars

    // Add new customers and calculate customer lifetime value
    customers.data.forEach((customer) => {
      const date = new Date(customer.created * 1000);
      const dateStr = date.toLocaleDateString('en-CA');
      
      if (dateStr in dailyTotals) {
        dailyTotals[dateStr].newCustomers += 1;
        totals.newCustomers += 1;
      }
    });

    // Calculate churn rate and update daily totals
    canceledSubscriptions.data.forEach((subscription) => {
      const date = new Date(subscription.canceled_at ? subscription.canceled_at * 1000 : 0);
      const dateStr = date.toLocaleDateString('en-CA');
      
      if (dateStr in dailyTotals) {
        dailyTotals[dateStr].canceledSubscriptions += 1;
      }
    });

    // Calculate daily MRR, churn rate, and average revenue per customer
    Object.entries(dailyTotals).forEach(([date, data]) => {
      const totalActiveSubscriptions = subscriptions.data.filter(sub => 
        new Date(sub.created * 1000).toLocaleDateString('en-CA') <= date && 
        (!sub.canceled_at || new Date(sub.canceled_at * 1000).toLocaleDateString('en-CA') > date)
      ).length;

      const dailyChurnRate = totalActiveSubscriptions > 0 
        ? (data.canceledSubscriptions / totalActiveSubscriptions) * 100 
        : 0;

      dailyTotals[date].activeSubscriptions = totalActiveSubscriptions;
      dailyTotals[date].churnRate = dailyChurnRate;
      dailyTotals[date].mrr = totalMRR / 100; // Convert to dollars
      dailyTotals[date].avgRevenuePerCustomer = totalActiveSubscriptions > 0 
        ? (data.gross / totalActiveSubscriptions) / 100 
        : 0;
    });

    // Calculate average churn rate
    const totalDays = Object.keys(dailyTotals).length;
    totals.avgChurnRate = Object.values(dailyTotals).reduce(
      (acc, data) => acc + data.churnRate, 0
    ) / totalDays;

    // Calculate customer lifetime value (CLV = Average Revenue per Customer / Churn Rate)
    totals.customerLifetimeValue = totals.avgChurnRate > 0 
      ? (totals.gross / totals.newCustomers) / (totals.avgChurnRate / 100)
      : 0;

    const chartData: ChartData[] = Object.entries(dailyTotals).map(([date, data]) => ({
      date,
      gross: data.gross / 100,
      net: data.net / 100,
      newCustomers: data.newCustomers,
      mrr: data.mrr,
      churnRate: data.churnRate,
      avgRevenuePerCustomer: data.avgRevenuePerCustomer,
      activeSubscriptions: data.activeSubscriptions,
      canceledSubscriptions: data.canceledSubscriptions
    }));

    // Sort by date
    chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.status(200).json({
      dailyData: chartData,
      totals
    });
  } catch (error) {
    console.error('Error fetching Stripe data:', error);
    res.status(500).json({ 
      message: 'Error fetching revenue data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}