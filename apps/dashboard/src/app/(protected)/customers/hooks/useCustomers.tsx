import { useState, useEffect } from "react";
import { fetchCustomers, fetchActiveCustomers } from "../_actions";
import { Customer } from "@data-access/stripe";

const firstDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const now = new Date();

const useCustomers = () => {
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activeCustomers, setActiveCustomers] = useState<number | null>(0);

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

        const customers = await fetchCustomers({
          from: rangeDate.from,
          to: nextDay,
        });

        setCustomers(customers);
        setLoadingCustomers(false);
      }
    })();
  }, [rangeDate]);

  // Active customers last month
  useEffect(() => {
    (async () => {
      setLoadingCustomers(true);
      const activeCustomers = await fetchActiveCustomers();
      setActiveCustomers(activeCustomers);
      setLoadingCustomers(false);
    })();
  }, []);

  return {
    activeCustomers,
    customers,
    loadingCustomers,
    rangeDate,
    setRangeDate,
  };
};

export default useCustomers;
