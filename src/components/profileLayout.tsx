"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/sidebarNav";
import { usePathname } from "next/navigation";
type Props = {
  children: React.ReactNode;
};

const sidebarNavItems = [
  {
    title: "حسابي",
    href: "/profile/account",
  },

  {
    title: "اعلاناتي",
    href: "/profile/advertise",
  },
  {
    title: "المحادثات",
    href: "/profile/chat",
  },
  {
    title: "اضف اعلان",
    href: "/profile/listcar",
  },
];

const ProfileLayout = ({ children }: Props) => {
  const pathname = usePathname();
  return (
    <>
      <div>
        <div className=" space-y-6 p-10 pb-16 md:block w-full">
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="lg:w-1/5 ml-10">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 ">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileLayout;
