"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Session } from "@/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import logo from "../../public/masdomLogo.png";
import { useSession } from "next-auth/react";
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [header, setHeader] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const navigation =
    pathname.includes("profile") === false
      ? [
          { name: "الرئيسية", href: "/" },
          { name: "حسابي", href: "/profile" },
          { name: "المحلات", href: "/shops" },
        ]
      : [
          { name: "الرئيسية", href: "/" },
          { name: "المحادثات", href: "/profile/chat" },
        ];

  const handleSignOut = async () => {
    console.log("asasa");
    if (session) {
      try {
        await signOut();
        toast({
          title: "تم تسجيل الخروج",
        });
        router.refresh();
        router.push("/login");
      } catch (error) {
        console.error(error);
      }
    } else {
      router.push("/login");
    }
  };

  // handle header
  const scrollHeader = () => {
    if (window.scrollY >= 20) {
      setHeader(true);
    } else {
      setHeader(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHeader);
    return () => {
      window.removeEventListener("scroll", scrollHeader);
    };
  }, []);

  const logStatues = session
    ? { title: "تسجيل الخروج", path: "/", handleSignOut }
    : { title: "تسجيل الدخول", path: "/login", handleSignOut };

  return pathname === "/login" || pathname === "/signup" ? null : (
    <header
      className={` ${
        pathname === "/"
          ? "fixed w-full z-10 backdrop-blur-md bg-black/30"
          : "block w-full bg-white"
      } `}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Masdoom</span>
            {pathname === "/" ? (
              <Image
                width={200}
                height={200}
                className="h-8 w-auto"
                src="https://uploads-ssl.webflow.com/63c520dbb2108882704bf6eb/6443e56ceae6ea7806d4f161_masdoom%20logo%20white%20.svg"
                alt="logo"
              />
            ) : (
              <Image
                width={200}
                height={200}
                className="h-10 w-auto"
                src={logo}
                alt="logo"
              />
            )}
          </a>
        </div>
        <div className="hidden max-lg:flex">
          <button
            type="button"
            className={` ${
              pathname === "/"
                ? "inline-flex items-center justify-center rounded-md p-2.5 text-white"
                : "inline-flex items-center justify-center rounded-md p-2.5 text-gray-900"
            }`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-7 w-7" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              // className="text-sm font-semibold leading-6 text-white"
              className={` text-sm font-semibold leading-6 ${
                pathname === "/" ? "text-white" : "text-gray-900"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        {session ? (
          <div
            onClick={handleSignOut}
            className="hidden lg:flex lg:flex-1 lg:justify-end"
          >
            <p
              className={` text-sm font-semibold leading-6 cursor-pointer ${
                pathname === "/" ? "text-white" : "text-gray-900"
              }`}
            >
              {logStatues.title}
            </p>
          </div>
        ) : (
          <div
            onClick={handleSignOut}
            className="hidden lg:flex lg:flex-1 lg:justify-end"
          >
            <p
              className={` text-sm font-semibold leading-6 cursor-pointer ${
                pathname === "/" ? "text-white" : "text-gray-900"
              }`}
            >
              {logStatues.title}
            </p>
          </div>
        )}
      </nav>

      <Dialog
        as="div"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="fixed inset-0 z-10"
      >
        <div className="fixed items-center justify-center inset-0 z-10 bg-black/50 px-12" />
        <Dialog.Panel className="fixed items-center justify-center min-w-[100%] h-screen z-20 bg-white py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
            <div className="flex lg:flex-1">
              <a href="/" className="p-1">
                <span className="sr-only">Masdoom</span>
                <Image
                  width={250}
                  height={250}
                  className="h-10 w-auto"
                  src={logo}
                  alt="logo"
                />
              </a>
            </div>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-8 w-8" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root h-screen w-screen flex-col items-center justify-center">
            <div className="my-32 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-semibold leading-6 text-center"
                  >
                    <h4 className="text-gray-900 mt-12 text-[3rem] max-md:text-2xl max-md:mt-4">
                      {item.name}
                    </h4>
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {session ? (
                  <Link
                    href={"/"}
                    onClick={handleSignOut}
                    className="mx-3 mt-10 p-2 px-8 block rounded-lg  text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {logStatues.title}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="mx-3 mt-10 p-2 px-8 block rounded-lg  text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {logStatues.title}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
