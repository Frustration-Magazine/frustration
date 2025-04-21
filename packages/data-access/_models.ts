export type PaymentSource = "stripe" | "helloasso" | "tipeee";
export type PaymentType = "donation" | "subscription" | "subscription_creation" | "subscription_update" | "other";

export type Payment = {
  date: Date;
  amount: number;
  customers: number;
  type: PaymentType;
  source: PaymentSource;
};
