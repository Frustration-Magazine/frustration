export type Payment = {
  date: Date;
  amount: number;
  type: "donation" | "subscription" | "subscription_creation" | "subscription_update" | "other";
  source: string;
};
