import "./Chatwindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState , useEffect } from "react";
import {ScaleLoader} from "react-spinners";
function Chatwindow(){
    const {prompt , setPrompt , reply , setReply , currThreadId ,setPrevChat, prevChat , setNewChat , handleLogout ,user} = useContext(MyContext);
    const [loading , setLoading] = useState(false);
    const [isopen , setisOpen] = useState(false); 
    const [error ,setError] = useState("");


    const getReply = async () => {

        if(!prompt.trim() ||loading){
            return;
        }

        setLoading(true);
        setNewChat(false);
        const token = localStorage.getItem("token");
        const options ={
            method :"POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
            },
            body:JSON.stringify({
                message :prompt,
                threadId: currThreadId
            })
        };
        try {
           const response = await fetch("http://localhost:8080/api/chat" , options);
           const res = await response.json();

           if(response.status === 401){
            handleLogout();
            return;
           }
           if(!response.ok){
            setError(
                res.message || "Something went wrong . Please try again ."
            );
            return;
           }

           setReply(res.reply);
        } catch (error) {
            console.log("Chat error :",error);

            setError("Unable to connect to server. Please check your backend");
        } finally{
        setLoading(false);
        }
    };

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

    const handleprofileclick = () => {
        setisOpen(!isopen);
    }


    return (
        <div className="chatwindow">
            <div className="navbar">
                <span>
                    Sigmagpt <i className="fa-solid fa-angle-down"></i>
                    </span>
                    <div className="user">
                        <span className="usericon" onClick={handleprofileclick}>
                            <i className="fa-solid fa-user"></i>
                        </span>
                    </div>
                
            </div>

            {
                isopen && 
                <div className="dropDown">
                    <div className="dropdownitem user-info">
                        <strong>{user?.name}</strong>
                        <small>{user?.email}</small>
                    </div>
                    <div className="dropdownitem"><i className="fa-solid fa-square-plus"></i>Upgrade Plus</div>
                    
                    <div className="dropdownitem ">Settings</div>


                    <div className="dropdownitem" onClick={handleLogout}>LogOut</div>
                </div>
            }

            <Chat></Chat>
            {error && (
                <div className="chat-error">
                    {error}
                </div>
            )}

            <div className="chat-loader">
                    <ScaleLoader color="#fff" loading={loading}></ScaleLoader>
                </div> 

            
               
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