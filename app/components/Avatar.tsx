"use client";
import { User } from "@prisma/client";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import useActiveList from "../hooks/useActiveList";
import { useMemo } from "react";

interface IAvatar {
  user: User;
}

const Avatar = ({ user }: IAvatar) => {
  const { members } = useActiveList();

  const isActive = useMemo(() => {
    return user?.email ? members?.indexOf(user?.email) !== -1 : false;
  }, [user?.email, members]);

  return (
    <div className="relative">
      <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
        {user?.image ? (
          <Image alt="Avatar" src={user?.image} fill />
        ) : (
          <CgProfile size={44} />
        )}
      </div>
      {isActive && (
        <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3" />
      )}
    </div>
  );
};

export default Avatar;
