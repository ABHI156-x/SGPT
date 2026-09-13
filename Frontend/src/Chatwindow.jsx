import "./Chatwindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState , useEffect } from "react";
import {ScaleLoader} from "react-spinners";
function Chatwindow(){
    const {prompt , setPrompt , reply , setReply , currThreadId ,setPrevChat, prevChat} = useContext(MyContext);
    const [loading , setLoading] = useState(false);


    const getReply = async () => {
        setLoading(true);
        const options ={
            method :"POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body:JSON.stringify({
                message :prompt,
                threadId: currThreadId
            })
        };
        try {
           const response = await fetch("http://localhost:8080/api/chat" , options);
           const res = await response.json();
           console.log(res);
           setReply(res.reply);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    //append new chat to prevchats
    useEffect(() => {
        if(prompt && reply) {
            setPrevChat(prevChat => {
                return [...prevChat ,{
                    role :"user",
                    content: prompt
                },{
                    role:"assistant",
                    content:reply
                }]
            })
        }
        setPrompt("");
    },[reply]);


    return (
        <div className="chatwindow">
            <div className="navbar">
                <span>
                    Sigmagpt <i className="fa-solid fa-angle-down"></i>
                    </span>
                    <div className="user">
                        <span className="usericon">
                            <i className="fa-solid fa-user"></i>
                        </span>
                    </div>
                
            </div>

            <Chat></Chat> 
            <ScaleLoader color="#fff" loading={loading}>

            </ScaleLoader>
               
            <div className="chatInput">
                <div className="inputbox">
                    <input type="text"  placeholder="Ask anything"
                     value= {prompt}
                       onChange={(e) =>  setPrompt(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' ? getReply(): ''}
                    >
                      
                    </input>
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>

                <p className="info">
                    Sigmagpt can make mistakes. Check important info. See Cookie Preferences.
                </p>

            </div>
        </div>
    )
}

export default Chatwindow;