import styles from "./page.module.css";
import CarCard from "@/components/carCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { getFeaturedCars, getLatestCars } from "@/lib/dbQueries";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export const metadata = {
  title: "الرئيسية | منصة مصدوم",
};

export default async function Home() {
  const featuredCars = await getFeaturedCars();

  const latestCars = await getLatestCars();

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <h1>
          الحراج الأول <br></br> للسيارات المصدومة
        </h1>
        <div className={styles.links}>
          <Link
            className={cn(
              buttonVariants(),
              " justify-start bg-[#31C77F] hover:bg-[#22ae6a] py-[1.5rem] px-[2.5rem] "
            )}
            href={"/"}
          >
            أبرز الإعلانات{" "}
          </Link>
          <Link href="/cars">جميع الإعلانات</Link>
        </div>
      </div>
      <div className={styles.topOffersSection}>
        <div className={styles.top}>
          <h1>
            إعلانات <span>مختارة</span>
          </h1>
          <h6>تصفح أبرز العروض</h6>
        </div>
        <div className={styles.content}>
          {featuredCars ? (
            featuredCars.map((item, index) => (
              <div key={index}>
                <CarCard carData={item} />
              </div>
            ))
          ) : (
            <Skeleton className="h-[70px] my-2" />
          )}
        </div>
      </div>
      <div className={styles.latestOffersSection}>
        <div className={styles.top}>
          <h1>
            آخر <span>الإعلانات</span>
          </h1>
          <h6>تصفح آخر العروض</h6>
        </div>
        <div className={styles.content}>
          {latestCars ? (
            latestCars.map((item, index) => (
              <div key={index}>
                <CarCard carData={item} />
              </div>
            ))
          ) : (
            <Skeleton className="h-[70px] my-2" />
          )}
        </div>
        <div className={styles.btn}>
          <Link
            className={cn(
              buttonVariants(),
              "styles.btn justify-start bg-[#31C77F] hover:bg-[#22ae6a] px-10 py-6"
            )}
            href={"/cars"}
          >
            عرض جميع التفاصيل
          </Link>
        </div>
      </div>
    </div>
  );
}
