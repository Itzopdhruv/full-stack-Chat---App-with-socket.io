import React, { useState } from "react";
import Search from "./Search";
import Users from "./Users";
import Groups from "./Groups";
 

function Left() {
  const [activeTab, setActiveTab] = useState("users"); // "users" or "groups"

  return (
    <div className="w-[30%] bg-black text-gray-300">
      <h1 className="font-bold text-3xl p-2 px-11">Chats</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 px-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "users"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "groups"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Groups
        </button>
      </div>

      <Search />
      <div
        className="flex-1 overflow-y-auto"
        style={{ minHeight: "calc(84vh - 10vh)" }}
      >
        {activeTab === "users" ? <Users /> : <Groups />}
      </div>
   
    </div>
  
  );
}

export default Left;