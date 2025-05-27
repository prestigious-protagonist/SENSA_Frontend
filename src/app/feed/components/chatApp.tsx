// import axios from "axios";
// import { io } from "socket.io-client";
// import React, { useEffect, useState } from "react";

// const socket = io("http://3.109.212.89:3005");

// export const ChatApp = ({
//   currentUserId,
//   otherUserId,
//   authToken,
// }: {
//   currentUserId: string;
//   otherUserId: string;
//   authToken: string;
// }) => {
//   const [chat, setChat] = useState<any>([]);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (!currentUserId || !otherUserId) return;
//     socket.emit("join", currentUserId);
//     const fetchChats = async () => {
//       console.log(currentUserId, otherUserId);

//       try {
//         const res = await axios.get(
//           `http://3.109.212.89:3005/chat/${currentUserId}/${otherUserId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//             },
//           }
//         );
//         setChat(res.data);
//       } catch (err) {
//         console.error("Error fetching chat:", err);
//       }
//     };

//     fetchChats();

//     socket.on("new_message", (newMsg) => {
//       setChat((prev: any) => [...prev, newMsg]);
//     });

//     return () => {
//       socket.off("new_message");
//     };
//   }, [currentUserId, otherUserId, authToken]);

//   const handleSend = async () => {
//     if (!message.trim()) return;

//     const data = { senderId: currentUserId, receiverId: otherUserId, message };

//     socket.emit("send_message", data);

//     try {
//       await axios.post("http://3.109.212.89:3005/chat", data, {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       });
//       setMessage("");
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };
//   return (
//     <div style={{ maxWidth: 500, margin: "0 auto" }}>
//       <h2>Chat with User {otherUserId}</h2>
//       <div
//         style={{
//           border: "1px solid #ccc",
//           height: 400,
//           overflowY: "scroll",
//           padding: 10,
//         }}
//       >
//         {chat.map((msg: any, index: number) => (
//           <div
//             key={index}
//             style={{
//               textAlign: msg.senderId === currentUserId ? "right" : "left",
//             }}
//           >
//             <p>
//               <strong>{msg.senderId}</strong>: {msg.message}
//             </p>
//           </div>
//         ))}
//       </div>
//       <div style={{ display: "flex", marginTop: 10 }}>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type a message"
//           style={{ flex: 1 }}
//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// };

"use client";
import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatInput } from "@/components/ui/chat-input";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { CornerDownLeft } from "lucide-react";

let socket: Socket;

export function ChatApp({
  currentUserId,
  otherUserAvatar,
  otherUserId,
  authToken,
}: {
  currentUserId: string;
  otherUserId: string;
  otherUserAvatar: string;
  authToken: string;
}) {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    // Initialize socket only once
    if (!socket) {
      socket = io("http://3.109.212.89:3005");
    }

    socket.emit("join", currentUserId);

    // Fetch chat history
    const fetchChats = async () => {
      try {
        const res = await axios.get(
          `http://3.109.212.89:3005/chat/${currentUserId}/${otherUserId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const formattedMessages = res.data.map((msg: any, index: number) => ({
          id: index + 1,
          content: msg.message,
          sender: msg.senderId === currentUserId ? "user" : "ai",
          rawSenderId: msg.senderId,
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error("Error fetching chat:", err);
      }
    };

    fetchChats();

    // Listen for incoming message (but avoid duplicates)
    const handleNewMessage = (newMsg: any) => {
      // Only add if message is not already present (basic duplicate prevention)
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (msg) =>
            msg.content === newMsg.message &&
            msg.rawSenderId === newMsg.senderId
        );
        if (isDuplicate) return prev;

        return [
          ...prev,
          {
            id: prev.length + 1,
            content: newMsg.message,
            sender: newMsg.senderId === currentUserId ? "user" : "ai",
            rawSenderId: newMsg.senderId,
          },
        ];
      });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [currentUserId, otherUserId, authToken]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const data = {
      senderId: currentUserId,
      receiverId: otherUserId,
      message: input,
    };

    try {
      // Send message to backend via REST API only (let backend emit via socket)
      await axios.post("http://3.109.212.89:3005/chat", data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Optimistically add user's message to UI
      const newUserMessage = {
        id: messages.length + 1,
        content: input,
        sender: "user",
        rawSenderId: currentUserId,
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="h-[600px] border bg-background rounded-lg flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ChatMessageList>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src={
                  message.sender === "user"
                    ? `${user?.imageUrl}`
                    : `${otherUserAvatar}`
                }
              />
              <ChatBubbleMessage
                variant={message.sender === "user" ? "sent" : "received"}
              >
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                fallback="AI"
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </div>

      <div className="p-4 border-t">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        >
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0 justify-between">
            <Button type="submit" size="sm" className="ml-auto gap-1.5">
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
