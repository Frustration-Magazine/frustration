import { formatCurrency } from "utils";
import { styled } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from "@mui/material/ToggleButtonGroup";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { TbBulb } from "react-icons/tb";
import {
  DONATION_AMOUNTS,
  DONATION_FREQUENCIES,
  FREQUENCY,
  GIFTS,
} from "../_models";
import CheckoutForm from "./CheckoutForm";
import "./styles.css";
import { useState, useEffect } from "react";

// 🎨 Styles
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  [`& .${toggleButtonGroupClasses.selected}`]: {
    backgroundColor: "black !important",
    color: "#FFF200 !important",
  },
}));

// 💰 Stripe
const { PUBLIC_STRIPE_PUBLIC_KEY } = import.meta.env;
const stripePromise = loadStripe(PUBLIC_STRIPE_PUBLIC_KEY);

const Form = () => {
  // 🔗 Query params
  // amount
  // type : recurring | onetime
  // payment_method : sepa_debit
  const queryParams = new URLSearchParams(window.location.search);

  const defaultAmount = queryParams.get("amount")
    ? parseInt(queryParams.get("amount")!) * 100
    : DONATION_AMOUNTS[1].value;

  const defaultFrequency = [FREQUENCY.ONETIME, FREQUENCY.RECURRING].includes(
    queryParams.get("type") as FREQUENCY,
  )
    ? queryParams.get("type")
    : FREQUENCY.ONETIME;

  let initialIsCustom = false;
  if (!DONATION_AMOUNTS.map(({ value }) => value).includes(defaultAmount))
    initialIsCustom = true;

  // 🔼 State
  const [selectedFrequency, setSelectedFrequency] = useState(defaultFrequency);

  const [{ selectedAmount, isCustom }, setSelectedAmount] = useState({
    selectedAmount: defaultAmount,
    isCustom: initialIsCustom,
  });

  // 🔄 Effect
  useEffect(() => {
    const scrollToHash = () => {
      const { hash } = window.location; // Get the current hash from the URL
      if (hash) {
        const element = document.getElementById(hash.substring(1)); // Remove the '#' from the hash
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  /* 📨 Newsletter */
  /* ------------- */
  const [wantsNewsletter, setWantsNewsletter] = useState(true);

  /* 🎁 Gifts */
  /* -------- */
  const gifts =
    DONATION_AMOUNTS.findLast(({ value }) => selectedAmount >= value)?.gifts ||
    [];
  const hasGifts =
    selectedFrequency === FREQUENCY.RECURRING && gifts.length > 0;

  // 💳 Stripe
  const options: StripeElementsOptions = {
    mode: selectedFrequency === FREQUENCY.ONETIME ? "payment" : "subscription",
    amount: selectedAmount,
    currency: "eur",
    appearance: {
      theme: "stripe",
    },
    loader: "auto",
  };

  return (
    <div
      className="mx-auto mt-12 flex max-w-[500px] flex-col items-center"
      id="form">
      <div className="mb-8 text-center">
        <h3 className="font-bakbak text-6xl md:text-7xl">
          {" "}
          Faire un don direct
        </h3>
        <p className="text-3xl font-bold">Aidez-nous à grandir ! 🌱</p>
      </div>

      {/* 📅 FREQUENCY */}
      <StyledToggleButtonGroup
        value={selectedFrequency}
        exclusive
        onChange={(_, newDonationType) => setSelectedFrequency(newDonationType)}
        aria-label="text donation-frequency"
        className="mb-8">
        {DONATION_FREQUENCIES.map(({ value: frequency, text }) => (
          <ToggleButton
            sx={{ padding: "10px 30px", fontSize: "17px", lineHeight: "1.3" }}
            key={frequency}
            value={frequency}
            aria-label={frequency}>
            {text}
          </ToggleButton>
        ))}
      </StyledToggleButtonGroup>
      {/* ====================================================================== */}

      <div>
        {/* 🔢 AMOUNT */}
        {DONATION_AMOUNTS.map(({ value: amount, gifts }) => (
          <label
            htmlFor={`amount-${amount}`}
            key={`amount-${amount}`}
            className="has-checked:text-frustration-yellow inline-block w-1/2 cursor-pointer rounded-xs border px-6 py-4 text-center font-bold hover:bg-gray-100 has-checked:bg-black">
            <input
              type="radio"
              className="button-amount hidden"
              checked={selectedAmount === amount && !isCustom}
              onClick={() =>
                setSelectedAmount({ selectedAmount: amount, isCustom: false })
              }
              id={`amount-${amount}`}
            />
            <span className="relative">
              {formatCurrency({ amount: amount / 100, decimals: false })}
              {selectedFrequency === FREQUENCY.RECURRING && gifts.length > 0 ? (
                <small className="absolute top-0 -right-1 translate-x-full -translate-y-3/4">
                  🎁{gifts.length > 1 ? ` x${gifts.length}` : ""}
                </small>
              ) : null}
            </span>
          </label>
        ))}

        {/* 🍡 CUSTOM */}
        <label
          htmlFor="amount-custom"
          className="has-checked:text-frustration-yellow mx-auto mt-4 block w-full cursor-pointer rounded-xs border px-6 py-4 text-center text-lg font-bold hover:bg-gray-100 has-checked:bg-black">
          <input
            type="radio"
            name="amount"
            className="hidden"
            id="amount-custom"
            checked={isCustom}
            onClick={() =>
              setSelectedAmount(({ selectedAmount }) => ({
                selectedAmount,
                isCustom: true,
              }))
            }
          />
          Montant de votre choix
        </label>
        {isCustom && (
          <div className="items-center gap-2 py-4 text-4xl">
            <div className="mb-2 flex items-center justify-center text-center">
              <input
                type="number"
                className="px-0 py-2 text-right font-bold"
                style={{
                  width: `${(selectedAmount / 100).toString().length + 1}ch`,
                }}
                value={selectedAmount / 100}
                min="1"
                onChange={(e) => {
                  let wantedAmount = +e.target.value;
                  if (wantedAmount < 15) wantedAmount = 15;

                  setSelectedAmount({
                    selectedAmount: wantedAmount * 100,
                    isCustom: true,
                  });
                }}
              />
              <span>€</span>
            </div>
            <div className="flex items-center">
              <input
                type="range"
                className="mr-4 grow"
                min="1"
                max={DONATION_AMOUNTS.map(({ value }) => value / 100)
                  .sort((a, b) => b - a)
                  .at(0)}
                value={selectedAmount / 100}
                onChange={(e) =>
                  setSelectedAmount({
                    selectedAmount: +e.target.value * 100,
                    isCustom: true,
                  })
                }
              />
              <span className="ml-3">
                {DONATION_AMOUNTS.findLast(
                  ({ value }) => selectedAmount >= value,
                )?.emoji ?? ""}
              </span>
            </div>
          </div>
        )}
        {selectedFrequency === FREQUENCY.ONETIME && selectedAmount >= 900 && (
          <p
            className="my-4 flex cursor-pointer flex-col items-center gap-2 leading-tight font-bold hover:underline md:flex-row"
            onClick={() => setSelectedFrequency(FREQUENCY.RECURRING)}>
            <TbBulb size={36} />
            <span className="shrink text-center md:text-left">
              Passez à un don mensuel pour recevoir des contreparties en échange{" "}
              <small>🎁 </small>
            </span>
          </p>
        )}

        {/* 🎁 GIFTS */}
        {selectedFrequency === FREQUENCY.RECURRING && gifts.length > 0 && (
          <div>
            <h5 className="mt-5 mb-2 flex gap-2 text-xl font-bold">
              <span>🎁 </span>
              <span>
                Pour vous remercier de votre soutien, nous vous enverrons :{" "}
              </span>
            </h5>
            {gifts.includes(GIFTS.MAGAZINE) && (
              <p>🗞️ Le dernier numéro papier annuel</p>
            )}
            {gifts.includes(GIFTS.BOOK) && (
              <p>
                📔 1 exemplaire de
                <i>
                  <b> Parasites</b>
                </i>{" "}
                (éd. de Poche) de Nicolas Framont
              </p>
            )}
          </div>
        )}

        {/* 📨 Newsletter */}
        <label
          htmlFor="newsletter"
          className="mt-6 flex items-center gap-2">
          <input
            type="checkbox"
            name="newsletter"
            checked={wantsNewsletter}
            onChange={() => setWantsNewsletter(!wantsNewsletter)}
            id="newsletter"
          />
          <span className="leading-none text-pretty">
            <span className="text-sm">
              Je souhaite recevoir la newsletter de{" "}
            </span>
            <span style={{ fontVariant: "all-small-caps" }}>
              Frustration Magazine
            </span>
          </span>
        </label>
      </div>
      {/* 3️⃣ 🗒️ PAYMENT */}
      <Elements
        options={options as any}
        stripe={stripePromise}>
        <CheckoutForm
          frequency={selectedFrequency as FREQUENCY}
          setFrequency={setSelectedFrequency}
          amount={selectedAmount}
          hasGifts={hasGifts}
          wantsNewsletter={wantsNewsletter}
        />
      </Elements>
    </div>
  );
};

export default Form;
