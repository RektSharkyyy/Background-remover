import { Webhook } from "svix";
import Stripe from "stripe";
import userModel from "../models/userModel.js";
import connectDB from "../configs/mongodb.js";
import transactionModel from "../models/transactionModel.js";

// Initialize Stripe
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

const clerkWebhooks = async (req, res) => {
  try {
    await connectDB();

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(req.rawBody, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
          creditBalance: 0, // default
        };

        await userModel.create(userData);
        res.json({ success: true });
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };

        await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
        res.json({ success: true });
        break;
      }

      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        res.json({ success: true });
        break;
      }

      default:
        res.json({ success: true, message: "Unhandled event type" });
        break;
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get user credits
const userCredits = async (req, res) => {
  try {
    const { clerkId } = req.body; // or req.query depending on frontend

    const userData = await userModel.findOne({ clerkId });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, credits: userData.creditBalance });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Buy credits
const buyCredit = async (req, res) => {
  try {
    const { clerkId, planId } = req.body;

    await connectDB();

    const userData = await userModel.findOne({ clerkId });
    if (!userData || !planId) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    let credits, plan, amount;
    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 50;
        break;
      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 250;
        break;
      default:
        return res.json({ success: false, message: "Invalid plan" });
    }

    // Create transaction record
    const transactionData = {
      clerkId,
      plan,
      amount,
      credits,
      payment: false,
      date: Date.now(),
    };
    const newTransaction = await transactionModel.create(transactionData);

    // Stripe PaymentIntent
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amount * 100,
      currency: process.env.CURRENCY || "usd",
      metadata: { transactionId: newTransaction._id.toString(), clerkId },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      transactionId: newTransaction._id,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { clerkWebhooks, userCredits, buyCredit };
