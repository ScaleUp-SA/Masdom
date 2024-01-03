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
    title: "السيارات المعروضة",
    href: "/profile/adminallcars",
  },
  {
    title: "اضف سيارات",
    href: "/profile/listcar",
  },
  {
    title: "اضف محلات",
    href: "/profile/adminaddshops",
  },
  {
    title: "المحلات المعروضة",
    href: "/profile/adminallshops",
  },
];

const AdminLayout = ({ children }: Props) => {
  const pathname = usePathname();
  return (
    <>
      {pathname.includes("chat") ? (
        <div>{children}</div>
      ) : (
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
      )}
    </>
  );
};

export default AdminLayout;
