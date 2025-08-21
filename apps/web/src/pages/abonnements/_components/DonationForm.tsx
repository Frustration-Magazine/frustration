import React, { useState, type FormEvent } from "react";
import {
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { actions } from "astro:actions";
import { MessageCircleWarning } from "lucide-react";
import { type StripePaymentElementOptions } from "@stripe/stripe-js";
import { cn } from "@/lib/utils";
import LoaderCircle from "@/components/loaders/loader-circle";
import { RainbowButton } from "./RainbowButton";
import { Slider } from "@/components/ui/slider";
import { JSON_HEADERS, SITE_URL, LOCAL_SITE_URL, API_ENDPOINTS } from "@/constants";

const { MODE } = import.meta.env;

// 💰 Stripe
const paymentElementOptions: StripePaymentElementOptions = {
  layout: "tabs",
  business: { name: "Frustration Magazine" },
  paymentMethodOrder: ["card", "paypal"],
};

// 🔄 Redirection

const CAMPAIGN_TAG = "regular";

const SUCCESS_PAGE = "paiement-termine";
const REDIRECT_URL_BASE = MODE === "production" ? `${SITE_URL}${SUCCESS_PAGE}` : `${LOCAL_SITE_URL}${SUCCESS_PAGE}`;

// ============== //
//      UI 🚀     //
// ============== //

type Props = {
  readonly amount: number;
};

export default function StripeForm() {
  // 🪝 Hooks
  const stripe = useStripe();
  const elements = useElements();

  // 🔼 State
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [email, setEmail] = useState("");
  const [addToNewsletter, setAddToNewsletter] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const disableCheckout = isLoading || !stripe || !elements;

  /* Handle payment */
  /* -------------- */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🔁 Check everything is loaded
    if (!stripe || !elements) return;

    // 1️⃣ Check form is valid
    const { error: submitError } = await elements.submit();
    if (submitError) return;

    setIsLoading(true);

    let clientSecret;

    let customer;

    // 1️⃣ Customer
    if (email) {
      const resCustomerCreation = await fetch(API_ENDPOINTS.createCustomer, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({
          email,
          metadata: {
            campaign: CAMPAIGN_TAG,
          },
        }),
      }).then((res) => res.json());

      if (resCustomerCreation?.customer) customer = resCustomerCreation.customer;
    }

    // 2️⃣ Payment intent
    let paymentIntent;
    if (customer) {
      const resPaymentIntentCreation = await fetch(API_ENDPOINTS.createPaymentIntent, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({
          customer: customer.id,
          amount: selectedAmount,
          receipt_email: customer.email,
          currency: "eur",
          metadata: {
            campaign: CAMPAIGN_TAG,
          },
          description: `Don unique de ${selectedAmount / 100}€`,
        }),
      }).then((res) => res.json());

      if (resPaymentIntentCreation?.paymentIntent) {
        paymentIntent = resPaymentIntentCreation.paymentIntent;
        clientSecret = paymentIntent.client_secret;
      }
    }

    /* ---------------- */
    /*   SUBSCRIPTION   */
    /* ---------------- */

    // 3️⃣ Try to confirm payment and redirect if that the case or handle error
    if (clientSecret) {
      const mode = "payment";

      const return_url = `${REDIRECT_URL_BASE}?mode=${mode}`;

      const formData = new FormData();
      formData.append("email", email);

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url,
        },
      });

      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message ?? null);
      } else {
        setErrorMessage("Une erreur inattendue est survenue.");
      }

      if (!error && addToNewsletter) {
        actions.addSubscriberToNewsletter(formData);
      }
    }

    setIsLoading(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="mb-12"
    >
      {/* 1️⃣ AMOUNT */}
      <h3
        className={`font-montserrat mb-6 flex flex-col items-center justify-center text-center text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left`}
      >
        <span className="max-lg:text-3xl">1️⃣</span>
        <span>Votre don</span>
      </h3>
      <div className="font-bakbak mb-4 flex items-center justify-center gap-2 text-4xl">{selectedAmount / 100}€</div>
      <Slider
        min={5}
        max={250}
        step={5}
        value={[selectedAmount / 100]}
        onValueChange={(value) => setSelectedAmount(value[0] * 100)}
        className={cn("mx-auto mb-12 w-[80%]")}
      />
      {/* 2️⃣ CONTACT INFO */}
      <h3
        className={`font-montserrat mb-6 flex flex-col items-center justify-center text-center text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left`}
      >
        <span className="max-lg:text-3xl">2️⃣</span>
        <span>Votre mail pour votre reçu</span>
      </h3>
      <LinkAuthenticationElement onChange={({ value: { email } }) => setEmail(email)} />
      <div className="my-2"></div>
      <h3
        className={`font-montserrat mb-6 mt-10 flex flex-col items-center justify-center text-center text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left`}
      >
        <span className="max-lg:text-3xl">3️⃣</span>
        <span>Vos informations de paiement</span>
      </h3>

      {/* 💬 Error or success message */}
      {/* 3️⃣ PAYMENT */}
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
        className="mb-4"
      />

      {/* 💬 Error or success message */}
      {errorMessage && (
        <div
          className="bg-purple mb-4 flex gap-2 rounded-sm px-4 py-2 text-white"
          id="payment-message"
        >
          <MessageCircleWarning className="shrink-0" />
          <div>
            <span>{errorMessage}</span>{" "}
            <span>
              Veuillez réessayer et si l'erreur persiste n'hésitez pas à nous contacter à{" "}
              <a
                className="text-lightBlue-300 underline"
                href={`mailto:${import.meta.env.MAIL_FROM}`}
              >
                {import.meta.env.MAIL_FROM}
              </a>
            </span>
          </div>
        </div>
      )}

      {/* ====================================================================== */}

      {/* ⬛ VALIDATION */}
      <div className={cn("mx-auto mt-10 w-fit", disableCheckout && "opacity-30")}>
        <RainbowButton
          className="mx-auto rounded-md px-4 py-3 lg:py-4"
          type="submit"
          id="submit"
        >
          {isLoading ? (
            <LoaderCircle color="#FFF200" />
          ) : (
            <span className="text-primary flex gap-3 text-xl font-bold lg:text-2xl">
              <span>💸</span>
              <span>Faire un don à Frustration</span>
            </span>
          )}
        </RainbowButton>
      </div>
    </form>
  );
}
