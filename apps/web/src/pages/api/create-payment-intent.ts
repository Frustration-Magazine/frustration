import { JSON_HEADERS } from "@/constants";
import type { APIRoute } from "astro";
import { stripe } from "data-access/stripe";

export const prerender = false;

export const POST: APIRoute = async ({ request }: { request: any }) => {
  const paymentIntentInformations = await request.json();

  // 1️⃣ Create a payment intent
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create(paymentIntentInformations);
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return new Response(JSON.stringify({ error: "Failed to create payment intent" }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }

  // 2️⃣ Return payment intent if successful
  if (paymentIntent) {
    return new Response(JSON.stringify({ paymentIntent }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  }

  return new Response();
};
