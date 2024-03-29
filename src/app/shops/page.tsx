"use client";
import ShopCard from "@/components/shopCard";
import { Filter } from "@/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FunnelIcon, MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Props = {};

const Page = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [shopData, setShopData] = useState([]);
  const [filtersState, setFiltersState] = useState<Filter[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [pageFilterData, pageData] = await Promise.all([
          axios.get("/api/filterdata/shopsfilter"),
          axios.post("/api/shops/getshops"),
        ]);

        if (pageFilterData.status === 200 && pageData.status === 200) {
          setFiltersState(pageFilterData.data.data.filters);
          setShopData(pageData.data.data.shops);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleCheckboxChange = async (sectionId: string, optionIdx: number) => {
    try {
      const updatedFiltersState = [...filtersState];

      updatedFiltersState.forEach((section) => {
        if (section.id === sectionId) {
          section.options = section.options.map((option, index) => {
            if (index === optionIdx) {
              return {
                ...option,
                checked: !option.checked,
              };
            }
            return option;
          });
        }
      });

      setFiltersState(updatedFiltersState);
      const selectedFilters: { [key: string]: string[] } = {};
      updatedFiltersState.forEach((section) => {
        section.options.forEach((option) => {
          if (option.checked) {
            if (!selectedFilters[section.id]) {
              selectedFilters[section.id] = [];
            }
            selectedFilters[section.id].push(option.value);
          }
        });
      });

      const res = await axios.post("/api/shops/getshops", {
        filters: selectedFilters,
      });

      setShopData(res.data.data.shops);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Mobile filter dialog */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setMobileFiltersOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">فلتر</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4 border-t border-gray-200">
                  <h3 className="sr-only">Categories</h3>

                  {loading === true ? (
                    <>
                      <Skeleton className="h-[70px] my-2" />
                      <Skeleton className="h-[70px] my-2" />
                      <Skeleton className="h-[70px] my-2" />
                      <Skeleton className="h-[70px] my-2" />
                      <Skeleton className="h-[70px] my-2" />
                      <Skeleton className="h-[70px] my-2" />
                      <Skeleton className="h-[70px] my-2" />
                    </>
                  ) : (
                    filtersState.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          section.id,
                                          optionIdx
                                        )
                                      }
                                      defaultChecked={option.checked}
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />

                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))
                  )}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <main className="py-4 px-6">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <span className="sr-only">Filters</span>
              <FunnelIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pb-24 pt-6">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="flex w-full">
            {/* Filters */}

            <form className="border rounded hidden lg:block basis-1/4 ml-10 px-2 py-4">
              {loading === true ? (
                <>
                  <Skeleton className="h-[70px] my-2" />
                  <Skeleton className="h-[70px] my-2" />
                  <Skeleton className="h-[70px] my-2" />
                  <Skeleton className="h-[70px] my-2" />
                  <Skeleton className="h-[70px] my-2" />
                  <Skeleton className="h-[70px] my-2" />
                  <Skeleton className="h-[70px] my-2" />
                </>
              ) : (
                filtersState.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  onChange={() =>
                                    handleCheckboxChange(section.id, optionIdx)
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 px-2"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))
              )}
            </form>

            <div className="flex flex-shrink-1 flex-grow basis-1/2 gap-4 flex-wrap">
              {loading === true ? (
                <div className="w-full">
                  <Skeleton className="h-full" />
                </div>
              ) : (
                shopData.map((item, index) => (
                  <div key={index} className="">
                    <div>
                      <ShopCard shop={item} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;

{
  /* <ShopCard shop={item} /> */
}
