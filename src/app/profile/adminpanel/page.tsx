import CarCard from "@/components/carCard";
import { getFeaturedCars, getLatestCars } from "@/lib/dbQueries";
import React from "react";
import styles from "../../page.module.css";

type Props = {};

const page = async (props: Props) => {
  const listingCars = await getLatestCars();
  console.log(listingCars, "cars");

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {listingCars.map((item, index) => (
          <div key={index}>
            <CarCard carData={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
