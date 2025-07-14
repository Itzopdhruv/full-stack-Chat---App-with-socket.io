import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setGroupMessages } from "../features/conversationSlice.js";

const useGetGroupMessages = (groupId) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getGroupMessages = async () => {
      if (!groupId) return;
      
      setLoading(true);
      try {
        const res = await fetch(`/api/group/${groupId}/messages`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        dispatch(setGroupMessages(data));
      } catch (error) {
        console.log("Error in useGetGroupMessages: ", error.message);
      } finally {
        setLoading(false);
      }
    };

    getGroupMessages();
  }, [groupId, dispatch]);

  return { loading };
};

export default useGetGroupMessages; 