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

// 💰 Stripe
const paymentElementOptions: StripePaymentElementOptions = {
  layout: "tabs",
  paymentMethodOrder: ["card", "sepa_debit", "paypal"],
};

const { MODE, SITE, PUBLIC_STRIPE_PRODUCT_SUBSCRIPTION } = import.meta.env;

// 🔄 Redirection

const CAMPAIGN_TAG = "regular";

const SUCCESS_PAGE = "paiement-termine";
const REDIRECT_URL_BASE =
  MODE === "production"
    ? `${SITE}/${SUCCESS_PAGE}`
    : `http://localhost:4321/${SUCCESS_PAGE}`;

const CREATE_CUSTOMER_ENDPOINT = "/api/create-customer";
const UPDATE_PAYMENT_INTENT_ENDPOINT = "/api/update-payment-intent";
const CREATE_SUBSCRIPTION_ENDPOINT = "/api/create-subscription";

// ============== //
//      UI 🚀     //
// ============== //

// 🗿 Props
type Props = {
  readonly frequency: "onetime" | "recurring";
  readonly amount: number;
  readonly hasGifts?: boolean;
};

export default function StripeForm({
  amount = 900,
  hasGifts = true,
}: Props) {
  // 🪝 Hooks
  const stripe = useStripe();
  const elements = useElements();

  // 🔼 State
  const [email, setEmail] = useState("");
  const [addToNewsletter, setAddToNewsletter] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // const [message, setMessage] = useState<string | null>(null);

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

    /* ---------------- */
    /*   SUBSCRIPTION   */
    /* ---------------- */
      let customer;
      let address = {};
      let name = null;
      const addressElement = elements.getElement("address");
      if (addressElement) {
        await addressElement.getValue().then(({ value }) => {
          address = value.address;
          name = value.name;
        });
      } else {
        console.error("No address element found");
      }

      // 1️⃣ Create customer
      if (email) {
        const resCustomerCreation = await fetch(CREATE_CUSTOMER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...(name ? { name } : {}),
            ...(address ? { address } : {}),
            email,
            metadata: {
              campaign: CAMPAIGN_TAG,
            },
          }),
        }).then((res) => res.json());
        if (resCustomerCreation?.customer)
          customer = { ...resCustomerCreation.customer };
      }

      // 2️⃣ Subscription
      let subscription;
      if (customer) {
        const resSubscriptionCreation = await fetch(
          CREATE_SUBSCRIPTION_ENDPOINT,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerId: customer.id,
              customerAddress: customer.address,
              productId: PUBLIC_STRIPE_PRODUCT_SUBSCRIPTION,
              amount,
              nickname: `Abonnement de soutien à Frustation Magazine de ${amount / 100}€/mois`,
              metadata: {
                campaign: CAMPAIGN_TAG,
              },
            }),
          },
        ).then((res) => res.json());

        // 3️⃣ Payment intent to update
        if (resSubscriptionCreation?.subscription) {
          subscription = resSubscriptionCreation.subscription;
          const paymentIntentForSubscription = subscription?.latest_invoice?.payment_intent;
          const resUpdatedPaymentIntent = await fetch(
            UPDATE_PAYMENT_INTENT_ENDPOINT,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentIntentId: paymentIntentForSubscription.id,
                paymentIntentUpdatedInformations: {
                  receipt_email: customer.email,
                  metadata: {
                    campaign: CAMPAIGN_TAG,
                  },
                },
              }),
            },
          ).then((res) => res.json());
          if (resUpdatedPaymentIntent?.paymentIntent) {
            const {
              paymentIntent: { client_secret },
            } = resUpdatedPaymentIntent;
            clientSecret = client_secret;
          }
        }
      }

    // 3️⃣ Try to confirm payment and redirect if that the case or handle error
    if (clientSecret) {
      const mode = "subscription";

      const return_url = `${REDIRECT_URL_BASE}?mode=${mode}&status=success${hasGifts ? "&has_gifts" : ""}`;

      // 📨 Gather customer data for newsletter
      let firstName = "";
      let lastName = "";
      const addressElement = elements.getElement("address");
      if (addressElement) {
        const { name } = await addressElement
          .getValue()
          .then(({ value }) => value);
        firstName = name;
      }
      const formData = new FormData();
      formData.append("email", email);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);


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

      if(!error && addToNewsletter) {
        actions.addSubscriberToNewsletter(formData);
      }
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-12">
      {/* 2️⃣ CONTACT INFO */}
      <h3
        className={`font-montserrat mb-6 flex flex-col items-center justify-center text-center text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left`}>
        <span className="max-lg:text-3xl">2️⃣</span>
        <span>Vos informations de contact</span>
      </h3>
      <LinkAuthenticationElement
        onChange={({ value: { email } }) => setEmail(email)}
      />
      <div className="my-2"></div>
      <AddressElement options={{ mode: "shipping", display: { name: "split" } }} />
      <h3
        className={`font-montserrat mt-10 mb-6 flex flex-col items-center justify-center text-center text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left`}>
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
          id="payment-message">
          <MessageCircleWarning className="shrink-0" />
          <div>
            <span>{errorMessage}</span>{" "}
            <span>
              Veuillez réessayer et si l'erreur persiste n'hésitez pas à nous
              contacter à{" "}
              <a
                className="text-lightBlue-300 underline"
                href={`mailto:${import.meta.env.MAIL_FROM}`}>
                {import.meta.env.MAIL_FROM}
              </a>
            </span>
          </div>
        </div>
      )}


      {/* ====================================================================== */}

      {/* ⬛ VALIDATION */}
      <div
        className={cn("mx-auto mt-10 w-fit", disableCheckout && "opacity-30")}>
        <RainbowButton
          className="mx-auto rounded-md px-4 py-3 lg:py-4"
          type="submit"
          id="submit">
          {isLoading ? (
            <LoaderCircle color="#FFF200" />
          ) : (
            <span className="text-frustration-yellow text-xl font-bold lg:text-2xl">
              💝 Soutenir Frustration
            </span>
          )}
        </RainbowButton>
      </div>
    </form>
  );
}
