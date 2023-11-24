import Image from "next/image";
import styles from "./page.module.css";
import CarCard from "./components/CarCard/index";

export default function Home() {
  const testArray = [1, 2, 3];
  const testArray2 = [1, 2, 3, 4, 5, 6];

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <h1>
          الحراج الأول <br></br> للسيارات المصدومة
        </h1>
        <div className={styles.links}>
          <button>أبرز الإعلانات</button>
          <a href="#">جميع الإعلانات</a>
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
          {testArray.map((item) => (
            <CarCard />
          ))}
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
          {testArray2.map((item) => (
            <CarCard />
          ))}
        </div>
        <div className={styles.btn}>
          <button>عرض جميع التفاصيل</button>
        </div>
      </div>
    </div>
  );
}
