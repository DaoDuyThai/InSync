import type { NextApiRequest, NextApiResponse } from "next";
import stripe from "@/lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      limit: 100, // Adjust the limit as needed
    });
    res.status(200).json(subscriptions);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}