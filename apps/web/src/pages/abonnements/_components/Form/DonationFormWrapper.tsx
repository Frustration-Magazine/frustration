import { useState } from "react";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import DonationForm from "./DonationForm";
import { cn } from "@/lib/utils";

const { PUBLIC_STRIPE_PUBLIC_KEY } = import.meta.env;
const stripePromise = loadStripe(PUBLIC_STRIPE_PUBLIC_KEY);

const DEFAULT_AMOUNT = 900;

const options: StripeElementsOptions = {
  mode: "payment",
  amount: DEFAULT_AMOUNT,
  currency: "eur",
  appearance: {
    theme: "stripe",
  },
};

/* ==================================================== */
/* ==================================================== */

export default function Subscription() {
  return (
    <div className="mx-auto mt-32">
      {/* 🔠 Titres */}
      <div className="mb-10">
        <h3 className={cn(
          "font-bakbak text-center font-bold text-balance uppercase",
          "text-3xl ",
          "sm:text-4xl",
          "md:text-4xl",
          "lg:text-5xl")}>
          Hmm je préfère faire un don unique...
        </h3>
        <h5 className="text-center text-xl font-bold italic">C'est encore plus simple !</h5>
      </div>

      <div className="mx-auto w-[500px] max-w-[90vw]">
        <Elements
          options={options as any}
          stripe={stripePromise}>
          <DonationForm/>
        </Elements>
      </div>
    </div>
  );
}
