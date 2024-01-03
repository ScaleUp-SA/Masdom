"use client";

import AddingCarsForm from "@/components/addingShopsForm";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center  mt-6">
        <h1 className="text-[#04214c] font-bold text-3xl">
          إضــافة محلات صيانة
        </h1>
      </div>
      <AddingCarsForm />
    </div>
  );
};

export default page;
