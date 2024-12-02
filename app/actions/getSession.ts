import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";

const getSession = async () => {
  return await getServerSession(authOptions);
};

export default getSession;
