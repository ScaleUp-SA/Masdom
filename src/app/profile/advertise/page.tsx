import { getUserCars } from "@/lib/dbQueries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import styles from "../../page.module.css";
import CarCard from "@/components/carCard";

type Props = {};

const page = async (props: Props) => {
  const session = await getServerSession(authOptions);
  console.log(session);
  const userCars = await getUserCars(session?.user.id!);

  console.log(userCars, "sss");

  return (
    <div className={styles.content}>
      {userCars.map((item, index) => (
        <div key={index}>
          <CarCard carData={item} />
        </div>
      ))}
    </div>
  );
};

export default page;
