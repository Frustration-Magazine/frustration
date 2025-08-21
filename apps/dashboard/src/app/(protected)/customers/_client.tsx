"use client";

import Loader from "../../loading";
import { CustomersTable } from "./components/CustomersTable";
import { Header } from "./components/Header";
import { TopBar } from "./components/TopBar";
import useCustomers from "./hooks/useCustomers";

function Client() {
  const {
    stripeNewCustomers,
    allActiveCustomersCount,
    loadingCustomers,

    rangeDate,
    setRangeDate,
  } = useCustomers();

  return (
    <>
      <Header rangeDate={rangeDate} />

      {loadingCustomers ? (
        <Loader />
      ) : (
        <div className="mt-4 flex grow flex-col gap-4">
          <TopBar
            newCustomers={stripeNewCustomers}
            activeCustomersCount={allActiveCustomersCount}
            rangeDate={rangeDate}
            setRangeDate={setRangeDate}
          />

          <div className="h-[1px] grow overflow-auto">
            <CustomersTable customers={stripeNewCustomers} />
          </div>
        </div>
      )}
    </>
  );
}

export default Client;
