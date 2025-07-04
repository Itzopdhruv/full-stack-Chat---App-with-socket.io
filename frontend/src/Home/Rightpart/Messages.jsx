import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessage from "../../Context/useGetMessage.js";
import Loading from "../../Components/Loading.jsx";
import useGetSocketMessage from "../../Context/useGetSocketMessage.js";


function Messages() {
  const { loading, messages } = useGetMessage();
    useGetSocketMessage(); // listing incoming messages

  console.log(messages , "this is seeeeeeeeee");
  const messageArray = messages.length > 0 ? messages[0] : [];
  console.log(messageArray , "HHHhhhhhhahahahahahahhahahah");
  const lastMsgRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      if (lastMsgRef.current) {
        lastMsgRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 100);
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ minHeight: "calc(92vh - 8vh)" }}
    >
      {loading ? (
        <Loading />
      ) : (
        messageArray.length > 0 &&
        messageArray.map((message) => {
          return  <div key={message._id} ref={lastMsgRef}>
            <Message message={message} />
          </div>
        })
      )}

      {!loading && messageArray.length === 0 && (
        <div>
          <p className="text-center mt-[20%]">
            Say! Hi to start the conversation
          </p>
        </div>
      )}
    </div>
  );
}

export default Messages;
