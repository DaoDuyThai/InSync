import { NextApiRequest, NextApiResponse } from "next";
import stripe from "../../lib/stripe"; // Ensure you import your Stripe instance correctly
import { Stripe } from 'stripe'; // Import Stripe types

// Helper function to get UNIX timestamp for a specific date
const getUnixTimestampForDate = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

// Get the date ranges for the last 4 weeks, divided by day
const getLast4WeeksDateRanges = () => {
  const today = new Date();
  const dateRanges = [];
  
  for (let i = 0; i < 28; i++) {
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - i);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // End of the current day
    
    dateRanges.push({
      startDate: getUnixTimestampForDate(startDate),
      endDate: getUnixTimestampForDate(endDate),
    });
  }

  return dateRanges.reverse(); // Return ranges from oldest to newest
};

// Main function to get settled payments for each day in the last 4 weeks
const getSettledPayments = async () => {
  try {
    const dateRanges = getLast4WeeksDateRanges(); // Get date ranges for the last 4 weeks
    const dailyVolumes = [];

    // Loop through each day in the last 4 weeks
    for (const { startDate, endDate } of dateRanges) {
    let balanceTransactions: Stripe.BalanceTransaction[] = [];
      let hasMore = true;
      let startingAfter = null;

      // Fetch all transactions for this day
      while (hasMore) {
        const response: Stripe.ApiList<Stripe.BalanceTransaction> = await stripe.balanceTransactions.list({
          created: { gte: startDate, lte: endDate },
          limit: 100,
          starting_after: startingAfter || undefined,
        });

        balanceTransactions = balanceTransactions.concat(response.data);
        hasMore = response.has_more;
        startingAfter = response.data[response.data.length - 1]?.id;
      }

      // Calculate gross and net volume for this day
      const grossVolume = balanceTransactions.reduce((acc, transaction) => {
        if (transaction.type === 'charge') {
          return acc + transaction.amount; // Amount before fees (gross volume)
        }
        return acc;
      }, 0);

      const netVolume = balanceTransactions.reduce((acc, transaction) => {
        if (transaction.type === 'charge') {
          return acc + transaction.net; // Net volume after fees
        }
        return acc;
      }, 0);

      // Push the results for the day
      dailyVolumes.push({
        date: new Date(startDate * 1000).toLocaleDateString(), // Format the date
        grossVolume: grossVolume / 100, // Convert to USD (since Stripe returns amounts in cents)
        netVolume: netVolume / 100, // Convert to USD
      });
    }

    return dailyVolumes;
  } catch (error) {
    console.error("Error fetching balance transactions:", error);
    throw error; // Rethrow the error so it can be caught elsewhere
  }
};

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getSettledPayments();
    res.status(200).json(data); // Return the calculated gross and net volumes
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settled payments" });
  }
}
