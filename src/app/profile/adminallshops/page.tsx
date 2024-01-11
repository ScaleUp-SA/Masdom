import { getShops } from "@/lib/dbQueries";
import React from "react";
import styles from "../../page.module.css";
import ShopCard from "@/components/shopCard";

type Props = {};

const page = async (props: Props) => {
  const shops = await getShops();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {shops?.map((item, index) => (
          <div key={index}>
            <ShopCard shop={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
