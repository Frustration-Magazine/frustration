"use client";

import { explicitDate } from "utils/";
import React from "react";

export const Header = ({
  rangeDate,
}: {
  rangeDate: {
    from: Date;
    to: Date;
  };
}) => {
  return rangeDate?.from && rangeDate?.to ? (
    <h2 className="text-yellow w-fit bg-black px-4 py-1 text-center text-2xl font-bold">
      Abonnés du {explicitDate(rangeDate.from)} au {explicitDate(rangeDate.to)}
    </h2>
  ) : null;
};
