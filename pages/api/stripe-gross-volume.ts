import type { NextApiRequest, NextApiResponse } from "next";
import stripe from "../../lib/stripe";
import { Stripe } from "stripe";

// Helper function to get the date string for a given timestamp
const getDateString = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString(); // Convert timestamp to readable date
};

// Helper function to get start of a specific day (midnight)
const getStartOfDay = (date: Date) => {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  return Math.floor(startOfDay.getTime() / 1000); // Convert to UNIX timestamp
};

// Helper function to get the past 28 days
const getPastDays = (days: number) => {
  const pastDays: number[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - i);
    pastDays.push(getStartOfDay(pastDate));
  }

  return pastDays.reverse(); // Return days from earliest to latest
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pastDays = getPastDays(28); // Get the past 28 days
    const payments: Stripe.PaymentIntent[] = []; // Type the array of payments
    const refunds: Stripe.Refund[] = []; // Type the array of refunds
    let hasMore = true;
    let startingAfter: string | undefined = undefined;

    // Fetch payments and refunds from the past 4 weeks
    while (hasMore) {
      const paymentResponse: Stripe.ApiList<Stripe.PaymentIntent> = await stripe.paymentIntents.list({
        created: {
          gte: pastDays[0], // Start date (first day in the range)
          lte: pastDays[pastDays.length - 1], // End date (latest day in the range)
        },
        limit: 100,
        starting_after: startingAfter,
      });

      const refundResponse: Stripe.ApiList<Stripe.Refund> = await stripe.refunds.list({
        created: {
          gte: pastDays[0], // Start date (first day in the range)
          lte: pastDays[pastDays.length - 1], // End date (latest day in the range)
        },
        limit: 100,
        starting_after: startingAfter,
      });

      payments.push(...paymentResponse.data);
      refunds.push(...refundResponse.data);
      hasMore = paymentResponse.has_more || refundResponse.has_more;
      startingAfter = paymentResponse.data[paymentResponse.data.length - 1]?.id;
    }

    // Aggregate payments and refunds by day
    const dailyGrossVolume: { [key: number]: number } = {};
    const dailyRefundVolume: { [key: number]: number } = {};

    // Loop through each payment to aggregate by day
    payments.forEach(payment => {
      const paymentDate = new Date(payment.created * 1000);
      const dayStart = getStartOfDay(paymentDate);

      if (!dailyGrossVolume[dayStart]) {
        dailyGrossVolume[dayStart] = 0;
      }

      dailyGrossVolume[dayStart] += payment.amount_received; // Amount in smallest currency unit (e.g., cents)
    });

    // Loop through each refund to aggregate by day
    refunds.forEach(refund => {
      const refundDate = new Date(refund.created * 1000);
      const dayStart = getStartOfDay(refundDate);

      if (!dailyRefundVolume[dayStart]) {
        dailyRefundVolume[dayStart] = 0;
      }

      dailyRefundVolume[dayStart] += refund.amount; // Amount in smallest currency unit (e.g., cents)
    });

    // Ensure every day in the past 28 days is represented in the data
    const graphData = pastDays.map((day) => ({
      date: getDateString(day),
      grossVolume: (dailyGrossVolume[day] || 0) / 100, // Convert cents to dollars
      netVolume: ((dailyGrossVolume[day] || 0) - (dailyRefundVolume[day] || 0)) / 100, // Subtract refunds from gross volume
    }));

    res.status(200).json(graphData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}
