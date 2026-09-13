import { useContext, useEffect, useState } from "react";
import "./Chat.css";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

//for gpt response effect react-markdown and rehype -highlight


function Chat(){
    const {newChat ,prevChat , reply} = useContext(MyContext);
    const [latestreply , setLatestReply] = useState(null);

    useEffect(() => {
        //latestreply separate => typing effect create
        if(!prevChat?.length) return;

        const content =reply.split(" "); //individual words

        let idx=0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0 , idx +1).join(" "));

            idx++;
            if(idx >= content.length) clearInterval(interval);
        },40);
        return () => clearInterval(interval);

    },[prevChat , reply])

    

    return (
        <>
            {newChat && <h1>Start a New Chat!</h1>}
            <div className="chats">
                {
                    prevChat?.slice(0, -1).map((chat , idx) => 
                    <div className={chat.role === "user"?"userdiv" : "gptdiv"} key={idx}>
                            {
                                chat.role === "user"?
                                <p className="usermessage">{chat.content}</p> :
                                <ReactMarkdown  rehypePlugins={[rehypeHighlight]}>{String (chat.content)} </ReactMarkdown>
                            }
                    </div>
                    )
                }

                {
                    prevChat.length > 0 && latestreply != null &&
                    <div className="gptdiv" key={"typing"}> 
                         <ReactMarkdown  rehypePlugins={[rehypeHighlight]} >{String(latestreply)} </ReactMarkdown>
                    </div>
                }
                
            </div>
        </>
    )
}

export default Chat;