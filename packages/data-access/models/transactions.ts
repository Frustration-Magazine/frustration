export enum TRANSACTION_TYPES {
  SUBSCRIPTION = "subscription",
  DONATION = "donation",
  PAYMENT_FOR_INVOICE = "payment_for_invoice",
  SALE = "sale",
  PAYOUT = "payout",
  REFUND = "refund",
  FEE = "fee",
  OTHER = "other"
}

export enum TRANSACTION_SUBTYPES {
  SUBSCRIPTION_CREATION = "creation",
  SUBSCRIPTION_UPDATE = "update"
}

export type Payment = {
  date: Date;
  amount: number;
  type: "donation" | "subscription" | "subscription_creation" | "subscription_update" | "other";
  source: string;
};
