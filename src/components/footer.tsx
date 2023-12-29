"use client";

import React from "react";
import Image from "next/image";
import logo from "/public/images/car.jpg";
import { usePathname } from "next/navigation";
const Footer = () => {
  const pathname = usePathname();

  return pathname === "/login" || pathname === "/signup" ? null : (
    <div className="bg-black w-full pt-20 pb-16 flex flex-col items-center justify-between gap-8">
      <div>
        <Image
          src="/masdoomLogo.svg"
          alt="logo"
          width={200}
          height={200}
          priority
        />
      </div>
      <div className="flex flex-col gap-10 text-white font-bold text-lg  md:flex-row items-center gap-5 py-5">
        <a href="#">الرئيسية</a>
        <a href="#">جميع السيارات</a>
        <a href="#">اتصل بنا</a>
      </div>
      <hr className="w-[80%]"/>
      <div className="text-white flex flex-col items-center justify-between w-[80%] gap-2 md:flex-row justify-between items-center">
        <span>
          <p className="">جميع الحقوق محفوظة لمنصة مصدوم 2023 ©</p>
        </span>
        <span className="flex gap-4">
          <a href="#">سياسة الخصوصية</a>
          <a href="#">الشروط والأحكام</a>
        </span>
      </div>
    </div>
  );
};

export default Footer;
