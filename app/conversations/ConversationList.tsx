"use client";
import clsx from "clsx";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { IFullConversation } from "../types";
import useConversation from "../hooks/useConversation";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./components/ConversationBox";
import GroupChatModal from "./components/GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "../libs/pusher";
import { find } from "lodash";

interface IConversationList {
  initialItems: IFullConversation[];
  users: User[];
}
const ConversationList = ({ initialItems, users }: IConversationList) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();
  const session = useSession();
  const pusherKey = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }
    const newHandler = (conversation: IFullConversation) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }
        return [conversation, ...current];
      });
    };
    const updateHandler = (conversation: IFullConversation) => {
      setItems((current) =>
        current?.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }
          return currentConversation;
        })
      );
    };
    const deleteHandler = (conversation: IFullConversation) => {
      setItems((current) => [
        ...current.filter((convo) => convo.id !== conversation.id),
      ]);
      if (conversation.id === conversationId) {
        router.push("/conversations");
      }
    };
    pusherClient.subscribe(pusherKey);
    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:delete", deleteHandler);
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:delete", deleteHandler);
    };
  }, [pusherKey, conversationId, router]);

  return (
    <>
      <GroupChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
      />
      <aside
        className={clsx(
          `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
              onClick={() => setIsModalOpen(true)}
            >
              <MdOutlineGroupAdd size={18} />
            </div>
          </div>
          {items?.map((item) => (
            <ConversationBox
              key={item?.id}
              data={item}
              selected={conversationId === item?.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
