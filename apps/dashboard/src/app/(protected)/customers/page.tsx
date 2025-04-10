"use client";

import { DatePickerWithRange as DatePicker } from "@ui/components/date-range-picker";
import Header from "./components/Header";
import CustomersTable from "./components/CustomersTable";
import TopBar from "./components/TopBar";
import Loader from "../../loading";
import useCustomers from "./hooks/useCustomers";

const NoData = (
  <h3 className="mx-auto mt-5 w-[50%] max-w-[700px] text-center text-xl">😔 Aucun nouvel abonné sur cette période</h3>
);

function Page() {
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
      <DatePicker date={rangeDate} setDate={setRangeDate} />
      {loadingCustomers ? (
        <Loader />
      ) : (
        <div className="flex min-w-[1100px] max-w-[1600px] flex-grow flex-col space-y-3">
          <TopBar customers={customers} activeCustomers={activeCustomers} rangeDate={rangeDate} />
          <div className="h-[1px] flex-grow overflow-auto">
            {customers.length === 0 ? NoData : <CustomersTable customers={customers} />}
          </div>
        </div>
      )}
    </>
  );
}

export default Page;
