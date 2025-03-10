"use client";

// 🔩 Base
import { useState, useEffect } from "react";

// 🐝 API
import { fetchCustomers, fetchActiveCustomersLastMonth } from "../_actions";

// 🗿 Models
import { Customer } from "@data-access/stripe";

const useCustomers = () => {
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [numberOfActiveCustomers, setNumberOfActiveCustomers] = useState(0);

  const [rangeDate, setRangeDate] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  useEffect(() => {
    (async () => {
      const numberOfActiveCustomers = await fetchActiveCustomersLastMonth();
      setNumberOfActiveCustomers(numberOfActiveCustomers);
    })();
  }, []);

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

  return {
    numberOfActiveCustomers,
    customers,
    loadingCustomers,
    rangeDate,
    setRangeDate,
  };
};

export default useCustomers;
