"use client";

import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import Loader from "../../loading";
import CustomersTable from "./components/CustomersTable";
import Header from "./components/Header";
import TopBar from "./components/TopBar";
import useCustomers from "./hooks/useCustomers";

const NoData = (
  <h3 className="mx-auto mt-5 w-[50%] max-w-[700px] text-center text-xl">😔 Aucun nouvel abonné sur cette période</h3>
);

function Client() {
  const {
    customers,
    activeCustomers,

    loadingCustomers,

    rangeDate,
    setRangeDate,
  } = useCustomers();

  return (
    <>
      <Header rangeDate={rangeDate} />
      <DatePickerWithRange
        date={rangeDate}
        setDate={setRangeDate}
      />
      {loadingCustomers ? (
        <Loader />
      ) : (
        <div className="flex min-w-[1100px] max-w-[1600px] grow flex-col space-y-3">
          <TopBar
            customers={customers}
            activeCustomers={activeCustomers}
            rangeDate={rangeDate}
          />
          <div className="h-[1px] grow overflow-auto">
            {customers.length === 0 ? NoData : <CustomersTable customers={customers} />}
          </div>
        </div>
      )}
    </>
  );
}

export default Client;
