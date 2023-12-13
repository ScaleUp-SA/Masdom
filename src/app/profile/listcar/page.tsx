import ImageUplouder from "@/components/imageUplouder";

type Props = {};

const page = (props: Props) => {
  return (
    <div className=" min-h-screen">
      <div className=" w-full flex justify-center items-center h-24 ">
        <h1 className=" text-[#04214c] font-bold text-[3.5rem] ">
          أضف سيارة جديدة
        </h1>
      </div>
      <div>
        <ImageUplouder />
      </div>
      <div>
        {" "}
        <h1 className=" text-[#04214c] font-bold text-[3.5rem] ">
          أضف سيارة جديدة
        </h1>
      </div>
    </div>
  );
};

export default page;
