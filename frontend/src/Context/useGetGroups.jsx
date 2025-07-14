import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setGroups } from "../features/conversationSlice.js";

const useGetGroups = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getGroups = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/group/user-groups", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        dispatch(setGroups(data));
      } catch (error) {
        console.log("Error in useGetGroups: ", error.message);
      } finally {
        setLoading(false);
      }
    };

    getGroups();
  }, [dispatch]);

  return { loading };
};

export default useGetGroups; 