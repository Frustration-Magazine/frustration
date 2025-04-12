import {
  AddressElement,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { type StripePaymentElementOptions } from "@stripe/stripe-js";
import { actions } from "astro:actions";
import React from "react";

// 🧱 Components
import CircleLoader from "@/components/loaders/loader-circle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FREQUENCY } from "../_models";
import { RainbowButton } from "./RainbowButton";

// 🔧 Utils
import { cn } from "@/libs/tailwind";
import { MessageCircleWarning } from "lucide-react";

const paymentElementOptions: StripePaymentElementOptions = {
  layout: "tabs",
  paymentMethodOrder: ["card", "sepa_debit", "paypal"],
};

const { MODE, SITE, PUBLIC_STRIPE_PRODUCT_SUBSCRIPTION } = import.meta.env;

// 🔄 Redirection

const CAMPAIGN_TAG = "dons-fin-2024";

const CREATE_CUSTOMER_ENDPOINT = "/api/create-customer";
const CREATE_PAYMENT_INTENT_ENDPOINT = "/api/create-payment-intent";
const UPDATE_PAYMENT_INTENT_ENDPOINT = "/api/update-payment-intent";
const CREATE_SUBSCRIPTION_ENDPOINT = "/api/create-subscription";

const SUCCESS_PAGE = "paiement-termine";
const REDIRECT_URL_BASE =
  MODE === "production"
    ? `${SITE}/${SUCCESS_PAGE}`
    : `http://localhost:4321/${SUCCESS_PAGE}`;

// ============== //
//      UI 🚀     //
// ============== //

// 🗿 Props
type Props = {
  frequency: FREQUENCY;
  setFrequency: (frequency: FREQUENCY) => void;
  amount: number;
  hasGifts?: boolean;
  wantsNewsletter: boolean;
};

const CheckoutForm = ({
  frequency,
  setFrequency,
  amount,
  hasGifts = false,
  wantsNewsletter = false,
}: Props) => {
  // Params
  const queryParams = new URLSearchParams(window.location.search);
  const defaultPaymentMethod = queryParams.get("payment_method");
  if (defaultPaymentMethod)
    paymentElementOptions.paymentMethodOrder = [defaultPaymentMethod];

  // 🪝 Hooks
  const stripe = useStripe();
  const elements = useElements();

  // 🔼 State
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const mode = frequency === FREQUENCY.ONETIME ? "payment" : "subscription";
  const [forcePayment, setForcePayment] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  React.useEffect(() => {
    setErrorMessage(null);
  }, [frequency]);

  const disableCheckout = isLoading || !stripe || !elements;

  /* Handle payment */
  /* -------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🔁 Check everything is loaded
    if (!stripe || !elements) return;

    // 1️⃣ Check form is valid
    const { error: submitError } = await elements.submit();
    if (submitError) return;

    setIsLoading(true);

    let clientSecret;

    /* ---------------- */
    /* ONE TIME PAYMENT */
    /* ---------------- */
    if (frequency === FREQUENCY.ONETIME) {
      // 1️⃣ Customer
      let customer;
      if (email) {
        const resCustomerCreation = await fetch(CREATE_CUSTOMER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            metadata: {
              campaign: CAMPAIGN_TAG,
            },
          }),
        }).then((res) => res.json());

        if (resCustomerCreation?.customer)
          customer = resCustomerCreation.customer;
      }

      // 2️⃣ Payment intent
      let paymentIntent;
      if (customer) {
        const resPaymentIntentCreation = await fetch(
          CREATE_PAYMENT_INTENT_ENDPOINT,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customer: customer.id,
              amount,
              receipt_email: customer.email,
              currency: "eur",
              metadata: {
                hasGifts,
                campaign: CAMPAIGN_TAG,
              },
              description: `${amount / 100}€`,
            }),
          },
        ).then((res) => res.json());

        if (resPaymentIntentCreation?.paymentIntent) {
          paymentIntent = resPaymentIntentCreation.paymentIntent;
          clientSecret = paymentIntent.client_secret;
        }
      }
    }

    /* ---------------- */
    /*   SUBSCRIPTION   */
    /* ---------------- */
    if (frequency === FREQUENCY.RECURRING) {
      let customer;
      let address = {};
      let name = null;
      const addressElement = elements.getElement("address");

      if (hasGifts && addressElement) {
        await addressElement.getValue().then(({ value }) => {
          address = value.address;
          name = value.name;
        });
      }

      if (email) {
        // 1️⃣ Customer
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

        // 3️⃣ Payment intent
        if (resSubscriptionCreation?.subscription) {
          subscription = resSubscriptionCreation.subscription;
          const paymentIntent = subscription?.latest_invoice?.payment_intent;
          const resUpdatedPaymentIntent = await fetch(
            UPDATE_PAYMENT_INTENT_ENDPOINT,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentIntentId: paymentIntent.id,
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
    }

    if (clientSecret) {
      // 3️⃣ Try to confirm payment and redirect if that the case or handle error
      const return_url = `${REDIRECT_URL_BASE}?mode=${mode}&status=success${hasGifts ? "&has_gifts" : ""}`;

      if (wantsNewsletter) {
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

        actions.addSubscriber(formData);
      }

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
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-16 w-full">
      {/* ====================================================================== */}
      {/* 1️⃣ CONTACT INFO */}
      <h3 className="font-montserrat mb-6 flex flex-col items-center justify-center text-center text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left">
        <span className="max-lg:text-3xl">1️⃣</span>
        <span>Vos informations de contact</span>
      </h3>
      <LinkAuthenticationElement
        onChange={({ value: { email } }) => setEmail(email)}
      />
      <div className="my-2"></div>
      {hasGifts ? (
        <AddressElement
          options={{
            mode: "shipping",
          }}
        />
      ) : null}
      {/* ====================================================================== */}
      {/* 2️⃣ PAYMENT */}
      <h3 className="font-montserrat mb-6 mt-10 flex flex-col items-center justify-center text-center text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left">
        <span className="max-lg:text-3xl">2️⃣</span>
        <span>Vos informations de paiement</span>
      </h3>
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
        className="mb-4"
      />

      {/* ====================================================================== */}
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
                href="mailto:redaction@frustrationmagazine.fr">
                redaction@frustrationmagazine.fr
              </a>
            </span>
          </div>
        </div>
      )}

      {/* ====================================================================== */}

      {/* ⬛ Validation */}
      {mode === "payment" && !forcePayment ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div
              className={cn(
                "mx-auto mt-10 w-fit",
                disableCheckout && "opacity-30",
              )}>
              <RainbowButton className="mx-auto rounded-md px-4 py-3 lg:py-4">
                <span className="text-frustration-yellow text-xl font-bold lg:text-2xl">
                  💝 Soutenir Frustration
                </span>
              </RainbowButton>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Souhaiteriez-vous passer à <b>un don mensuel</b> ? Vous recevrez
                en contrepartie plusieurs cadeaux comme le dernier numéro papier
                de <i>Frustration</i> ou l'édition poche de <i>Parasites</i> de
                Nicolas Framont 🙌
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setForcePayment(true)}>
                Rester sur un don unique
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={() => setFrequency(FREQUENCY.RECURRING)}>
                  Passer à un don mensuel 🎁
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <div
          className={cn(
            "mx-auto mt-10 w-fit",
            disableCheckout && "opacity-30",
          )}>
          <RainbowButton
            className="mx-auto rounded-md px-4 py-3 lg:py-4"
            type="submit"
            id="submit">
            {isLoading ? (
              <CircleLoader color="##FFF200" />
            ) : (
              <span className="text-frustration-yellow text-xl font-bold lg:text-2xl">
                💝 Soutenir Frustration
              </span>
            )}
          </RainbowButton>
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
