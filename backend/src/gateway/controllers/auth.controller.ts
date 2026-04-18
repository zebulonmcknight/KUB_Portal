import dotenv from "dotenv";
import { Request, Response } from "express";
import { supabase } from "../../database/supabase";
import { auth0Service } from "../../services/auth/auth0.service";
dotenv.config();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const token = await auth0Service.login(email, password);

    return res.status(200).json({
      access_token: token.access_token,
      expires_in: token.expires_in,
    });
  } catch (error: any) {
    console.error("Login error details:", error);
    console.error("message: ", error.message);
    // return the error description or if null, 'Login Failed'
    return res.status(401).json({
      error: error.response?.data?.error_description || "Login Failed",
    });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, account_number, first_name, last_name, phone } =
      req.body;
    if (!email || !password || !account_number) {
      return res
        .status(400)
        .json({ error: "Email, password, and account_number are required" });
    }

    const signup = await auth0Service.signup(
      email,
      password,
      account_number,
      first_name,
      last_name,
      phone,
    );

    // Query kub accounts table to see which services they have
    const { data, error: queryError } = await supabase
      .from("kub_accounts")
      .select("has_electric, has_water, has_wastewater")
      .eq("account_number", account_number)
      .single();

    if (queryError) {
      return res.status(500).json({ error: queryError.message });
    }
    // if the database query resulted in no response
    if (!data) {
      return res.status(404).json({ error: "User Not Found" });
    }

    // create an empty array where we will store the price ids based on their services
    const priceIds = [];
    if (data.has_electric) priceIds.push(process.env.STRIPE_ELECTRIC_ID);
    if (data.has_wastewater) priceIds.push(process.env.STRIPE_WASTE_WATER_ID);
    if (data.has_water) priceIds.push(process.env.STRIPE_WATER_ID);

    const stripeSubscriptionResponse = await fetch(
      "https://kubportal-production.up.railway.app/api/billing/newCustomerSubscription",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${signup.access_token}`,
        },
        body: JSON.stringify({ priceIds }),
      },
    );

    if (!stripeSubscriptionResponse.ok) {
      return res
        .status(500)
        .json({ error: "Failed to create billing subscription" });
    }

    return res.status(201).json({
      message: "Signup Successful",
      access_token: signup.access_token,
      expires_in: signup.expires_in,
    });
  } catch (error: any) {
    console.error("Signup error details:", error);
    console.error("message", error.message);

    if (error.status === 409) {
      return res.status(409).json({ error: error.message });
    }
    // return the error description or if null, 'Signup Failed'
    console.log("Auth0 error data:", error.response?.data);
    return res.status(401).json({
      error:
        error.response?.data?.message ||
        error.response?.data?.description ||
        "Signup Failed",
    });
  }
};

export const verifyKubAccount = async (req: Request, res: Response) => {
  try {
    const { account_number, ssn_last4, zip } = req.body;
    if (!account_number || !ssn_last4 || !zip) {
      return res
        .status(400)
        .json({ error: "account_number, ssn_last4, and zip are required." });
    }

    await auth0Service.verifyKubAccount(account_number, ssn_last4, zip);
    return res.status(200).json({ account_number });
  } catch (error: any) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Verification failed" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await auth0Service.resetPassword(email);

    return res.status(200).json({
      message:
        "If an account exists for that email, a reset link has been sent.",
    });
  } catch (error: any) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Password reset failed" });
  }
};
