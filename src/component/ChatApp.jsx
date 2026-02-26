import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://dashboard.render.com/web/srv-d6fvt8hr0fns73ejqtq0");

function ChatApp() {
  const [messageInput, setMessageInput] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      socket.emit("message", messageInput);
      setMessageInput("");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("message", (message) => {
      setMessageList((prev) => [...prev, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  return (
     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
    
    <div className="w-full max-w-md h-[600px] bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-700">
      
      {/* Header */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <h1 className="text-lg font-semibold text-white">
          💬 Live Chat
        </h1>
        <span className="text-sm text-green-400">Online</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-800">
        {messageList.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No messages yet...
          </p>
        ) : (
          messageList.map((message, index) => {
            const isOwn = message.senderId === socket.id;

            return (
              <div
                key={index}
                className={`flex ${
                  isOwn ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow-md ${
                    isOwn
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-gray-700 text-white rounded-bl-none"
                  }`}
                >
                  <p>{message.text}</p>
                  <span className="text-[10px] block text-right opacity-70 mt-1">
                    {message.time}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-gray-900 border-t border-gray-700 flex items-center gap-2">
        <input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-full outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition duration-200"
        >
          ➤
        </button>
      </div>
    </div>
  </div>
);

}

export default ChatApp;
