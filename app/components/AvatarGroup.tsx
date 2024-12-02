"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";

interface IAvatarGroup {
  users: User[];
}
const AvatarGroup = ({ users = [] }: IAvatarGroup) => {
  const slicedUsers = users.slice(0, 3);
  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };
  return (
    <div className="relative h-11 w-11">
      {slicedUsers?.map((user, idx) => (
        <div
          key={user?.id}
          className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px] ${
            positionMap[idx as keyof typeof positionMap]
          }`}
        >
          {user?.image ? (
            <Image alt="Avatar" fill src={user?.image} />
          ) : (
            <CgProfile size={21} />
          )}
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
