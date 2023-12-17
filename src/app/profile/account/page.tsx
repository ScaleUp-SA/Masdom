import ProfileForm from "@/components/profileForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";

type Props = {};

export const metadata = {
  title: "حسابي",
};

const page = async (props: Props) => {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <div className="h-screen flex w-full justify-center items-center bg-[#5647FF] bg-opacity-5 rounded-lg">
      <div className="  m-auto w-[90%] md:w-[480px] h-[581px]">
        <ProfileForm session={session} />
      </div>
    </div>
  );
};

export default page;
