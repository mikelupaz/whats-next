import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

const getUsers = async () => {
  const session = await getSession();
  if (!session?.user?.email) {
    return [];
  }
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: "desc",
      },
      where: {
        NOT: {
          email: session?.user?.email,
        },
      },
    });
    return users;
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
