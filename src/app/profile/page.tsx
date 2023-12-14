import Link from "next/link";
import React from "react";

type Props = {};

export const metadata = {
  title: "حسابي",
};

const Page = (props: Props) => {
  return (
    <div className="h-screen grid grid-cols-6">
      <div className="bg-slate-800 col-span-1 p-4 text-white text-base">
        <span>
          {/* add image of user */}
          <h4 className="text-3xl">username</h4>
        </span>
        <ul className="mt-6">
          <li className="mt-2 text-white hover:text-green-400"><Link href={"profile/listcar"}>أضف سيارة جديدة</Link></li>
          <li className="mt-2 text-white hover:text-green-400">link</li>
          <li className="mt-2 text-white hover:text-green-400">link</li>
          <li className="mt-2 text-white hover:text-green-400">link</li>
        </ul>
      </div>
      <div className="col-span-5 p-4">
        Profile content
      </div>
    </div>
  );
};

export default Page;
