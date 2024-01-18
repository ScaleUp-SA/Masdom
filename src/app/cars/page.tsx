"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FunnelIcon, MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { Filter, FullCar } from "@/types";
import CarCard from "@/components/carCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Cars() {
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filtersState, setFiltersState] = useState<Filter[]>([]);
  const [latestCars, setLatestCars] = useState<FullCar[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const [pageFilterData, pageData] = await Promise.all([
          axios.get("/api/filterdata"),
          fetchCarsData(1),
        ]);

        if (pageFilterData.status === 200 && pageData?.status === 200) {
          const updateFilter = pageFilterData.data.data.filters.map(
            (filter: Filter) => {
              if (filter.id === "price") {
                const updatedOptions = filter.options.map(
                  (option: { value: string | number }) => {
                    if (option.value === 0) {
                      return { value: 0, label: "علي السوم" };
                    }
                    return option;
                  }
                );
                return { ...filter, options: updatedOptions };
              }
              return filter;
            }
          );
          setFiltersState(updateFilter);
          setLatestCars(pageData.data.data.listingCars);
          setTotalPages(pageData.data.data.totalPages);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []); // Removed [totalPages] dependency

  const fetchCarsData = async (page: number) => {
    try {
      const skip = (page - 1) * 6;
      const take = 6;
      const response = await axios.post(
        `/api/listingcars/getcars?skip=${skip}&take=${take}`,
        {
          filters: getSelectedFilters(),
        }
      );
      setTotalPages(response.data.data.totalPages); // Update total pages

      return response;
    } catch (error) {
      console.error(error);
    }
  };

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

      const carsData = await fetchCarsData(1);

      setLatestCars(carsData?.data.data.listingCars);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaginationClick = async (page: number) => {
    try {
      const carsData = await fetchCarsData(page);

      setLatestCars(carsData?.data.data.listingCars);
      setCurrentPage(page);
    } catch (error) {
      console.error(error);
    }
  };

  const getSelectedFilters = () => {
    const selectedFilters: { [key: string]: string[] } = {};
    filtersState.forEach((section) => {
      section.options.forEach((option) => {
        if (option.checked) {
          if (!selectedFilters[section.id]) {
            selectedFilters[section.id] = [];
          }
          selectedFilters[section.id].push(option.value);
        }
      });
    });
    return selectedFilters;
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

        <section aria-labelledby="products-heading" className="pb-16 pt-6">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          {/* container */}
          <div className="flex w-full">
            {/* Filters */}
            <form className="border rounded hidden h-[max-content] lg:block basis-1/4 ml-10 px-2 py-4">
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
                          <div className="space-y-4 h-[max-content]">
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

            {/* content */}
            <div className="flex flex-col items-center justify-between gap-4 h-[max-content] min-h-[90vh] flex-shrink-1 flex-grow basis-1/2">
              {/* cars */}
              <div className="flex items-center h-[max-content] w-full justify-center gap-6 flex-wrap">
                {loading === true ? (
                  <div className="w-full h-[85vh]">
                    <Skeleton className="h-full" />
                  </div>
                ) : (
                  latestCars.map((item, index) => (
                    <div key={index} className="">
                      <div>
                        <CarCard carData={item} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6 flex-wrap gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? "bg-[#22C578] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                    onClick={() => handlePaginationClick(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
