import CarCard from "@/components/carCard";
import { getCars } from "@/lib/dbQueries";
import styles from "../../page.module.css";
import { FullCar } from "@/types";

type Props = {};

const Page = async (props: Props) => {
  let listingCars: FullCar[] = [];

  try {
    const carsData: FullCar[] | undefined = await getCars();

    if (carsData) {
      listingCars = carsData;
    }
  } catch (error) {
    // Handle the error (e.g., logging, displaying an error message)
    console.error("Error fetching cars:", error);
  }

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

export default Page;
