"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Session } from "@/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function Header({ session }: { session: Session | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const navigation =
    pathname.includes("profile") === false
      ? [
          { name: "حسابي", href: "/profile" },
          { name: "الرئيسية", href: "/" },
        ]
      : [
          { name: "الرئيسية", href: "/" },
          { name: "المحادثات", href: "/profile/chat" },
        ];

  const handleSignOut = async () => {
    if (!session) {
      router.push("/login");
    } else {
      try {
        await signOut();
        toast({
          title: "تم تسجيل الخروج",
        });
        // Redirect to the desired page after sign-out
      } catch (error) {
        console.error(error);
      }
    }
  };

  const logStatues = session
    ? { title: "تسجيل الخروج", path: "/" }
    : { title: "تسجيل الدخول", path: "/login" };

  return pathname === "/login" || pathname === "/signup" ? null : (
    <header className="backdrop-blur-md bg-white/10 bg-opacity-10">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Masdoom</span>
            <Image
              width={100}
              height={100}
              className="h-8 w-auto"
              src="https://uploads-ssl.webflow.com/63c520dbb2108882704bf6eb/6443e56ceae6ea7806d4f161_masdoom%20logo%20white%20.svg"
              alt="logo"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div
          onClick={handleSignOut}
          className="hidden lg:flex lg:flex-1 lg:justify-end"
        >
          <p className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
            {logStatues.title}
          </p>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image
                height={100}
                width={100}
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6 flex flex-col ">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href={logStatues.path}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  {logStatues.title}
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
