import React from "react";
import { Loader } from "@/components/loaders/loader";

export default () => {
  return (
    <div className="flex h-full grow items-center justify-center overflow-auto">
      <Loader />
    </div>
  );
};
