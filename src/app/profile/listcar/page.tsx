import ListingCarsForm from "@/components/listingCarsForm";

type Props = {};

const Page = (props: Props) => {


  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center  mt-6">
        <h1 className="text-[#04214c] font-bold text-3xl">
          إضــافة سيـارة للبيـــع
        </h1>
      </div>

   
      <ListingCarsForm />
    </div>
  );
};

export default Page;
