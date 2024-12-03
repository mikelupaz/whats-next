const getMessages = async (conversationId: string) => {
  try {
    const messages = await prisma?.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    if (!messages) {
      return [];
    }
    return messages;
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return [];
  }
};

export default getMessages;
