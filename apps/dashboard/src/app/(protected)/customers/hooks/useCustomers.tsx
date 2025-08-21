import { Customer } from "data-access/stripe";
import { useEffect, useState } from "react";
import { fetchAllActiveCustomersCount, fetchStripeNewCustomers } from "../_actions";

const firstDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const now = new Date();

const useCustomers = () => {
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [stripeNewCustomers, setStripeNewCustomers] = useState<Customer[]>([]);
  const [allActiveCustomersCount, setAllActiveCustomersCount] = useState<number | null>(0);

  const [rangeDate, setRangeDate] = useState({
    from: firstDayLastMonth,
    to: now,
  });

  // Customers for selected period
  useEffect(() => {
    (async () => {
      if (rangeDate?.from && rangeDate?.to) {
        setLoadingCustomers(true);

        // We take next day as the end date to include all the data from the selected day
        const nextDay = new Date(rangeDate.to);
        nextDay.setDate(nextDay.getDate() + 1);

        const stripeNewCustomers = await fetchStripeNewCustomers({
          from: rangeDate.from,
          to: nextDay,
        });

        setStripeNewCustomers(stripeNewCustomers);
        setLoadingCustomers(false);
      }
    })();
  }, [rangeDate]);

  // Active customers last month
  useEffect(() => {
    (async () => {
      setLoadingCustomers(true);
      const allActiveCustomersCount = await fetchAllActiveCustomersCount();
      setAllActiveCustomersCount(allActiveCustomersCount);
      setLoadingCustomers(false);
    })();
  }, []);

  return {
    allActiveCustomersCount,
    stripeNewCustomers,
    loadingCustomers,
    rangeDate,
    setRangeDate,
  };
};

export default useCustomers;
