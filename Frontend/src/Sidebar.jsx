import { useContext, useEffect } from "react";
import "./Sidebar.css";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";


function Sidebar(){

    const {allThreads , setAllThreads , currThreadId , setNewChat , setPrompt , setCurrThreadId , setPrevChat , setReply} = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filterData =res.map(thread => ({threadId : thread.threadId ,title:thread.title}));
            setAllThreads(filterData);
        } catch (error) {
            console.log(error);
        }
    };
    
    useEffect(() => {
        getAllThreads();
    }, [currThreadId])


    const createNewChat = () =>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChat([]);

    }

    const changeThread = async ( newThreadId)=> {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res  = await response.json();
            console.log(res);
            setPrevChat(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}` , {method :"DELETE"});
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <section className="sidebar">
            {/*new chat button */}
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
                <span><i className="fa-regular fa-pen-to-square"></i></span>
            </button>

            
            {/*history */}
            <ul className="history">
                {
                    allThreads?.map((thread ,idx) => (
                        <li key={idx}
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); //stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                            
                        </li>
                    ))
                }
            </ul>
            
            {/* sign*/}
            <div className="sign">
                <p>By Abhijit </p>
            </div>
        </section>
    )
}

export default Sidebar;