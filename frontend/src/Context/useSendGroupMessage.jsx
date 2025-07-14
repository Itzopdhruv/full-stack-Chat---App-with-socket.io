import { useState } from "react";
import { useDispatch } from "react-redux";
import { addGroupMessage } from "../features/conversationSlice.js";

const useSendGroupMessage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const sendGroupMessage = async (groupId, message) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/group/${groupId}/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Do NOT dispatch addGroupMessage here; let the socket event handle it
      return data;
    } catch (error) {
      console.log("Error in useSendGroupMessage: ", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { sendGroupMessage, loading };
};

export default useSendGroupMessage; 