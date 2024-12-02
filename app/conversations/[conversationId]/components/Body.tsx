"use client";

import useConversation from "@/app/hooks/useConversation";
import { IFullMessage } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";

interface IBody {
  initialMessages: IFullMessage[];
}
const Body = ({ initialMessages }: IBody) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    fetch(`/api/conversations/${conversationId}/seen`, {
      method: "POST",
    });
  }, [conversationId]);
  return (
    <div className="flex-1 overflow-y-auto">
      {messages?.map((message, idx) => (
        <MessageBox
          isLast={idx === messages.length - 1}
          key={message?.id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
