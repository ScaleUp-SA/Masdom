import ProfileForm from "@/components/profileForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
type Props = {};

export const metadata = {
  title: "حسابي",
};

const Page = async (props: Props) => {
  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <div className="flex w-full justify-center items-center bg-[#5647FF] bg-opacity-5 rounded-lg">
      <div className=" m-auto w-[90%] md:w-[480px] h-[581px] flex justify-center items-center ">
        <h2 className=" font-bold text-3xl">
          مرحبا{" "}
          <span className=" text-green-600">
            {session?.user.username.toLocaleUpperCase()}{" "}
          </span>
        </h2>
      </div>
    </div>
  );
};

export default Page;
