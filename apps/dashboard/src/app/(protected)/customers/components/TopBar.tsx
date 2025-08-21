"use client";

import { Customer } from "data-access/stripe";
import { FaPeopleGroup as PeopleIcon } from "react-icons/fa6";
import { RiChatFollowUpFill as ChatIcon } from "react-icons/ri";
import DownloadButton from "./DownloadButton";

const BottomBar = ({
  newCustomers,
  activeCustomersCount,
  rangeDate,
}: {
  newCustomers: Customer[];
  activeCustomersCount: number | null;
  rangeDate: { from: Date; to: Date };
}) => {
  return (
    <div className="flex items-center gap-2 self-stretch">
      <div className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-white shadow-lg">
        <ChatIcon />
        <p>
          {newCustomers.length} {newCustomers.length > 1 ? "nouveaux" : "nouvel"} abonné{newCustomers.length > 1 && "s"}
          sur la période
        </p>
      </div>
      {activeCustomersCount ? (
        <div className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-zinc-900 shadow-lg">
          <PeopleIcon />
          <p>{activeCustomersCount} abonnés actifs le mois dernier</p>
        </div>
      ) : null}
      <div className="ml-auto">
        <DownloadButton
          customers={newCustomers}
          rangeDate={rangeDate}
        />
      </div>
    </div>
  );
};

export default BottomBar;
