import { useContext, useEffect } from "react";
import "./Sidebar.css";
import { MyContext } from "./MyContext";

function Sidebar(){

    const {allThreads , setAllThreads , currThreadId} = useContext(MyContext);

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

    return (
        <section className="sidebar">
            {/*new chat button */}
            <button>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
                <span><i className="fa-regular fa-pen-to-square"></i></span>
            </button>

            
            {/*history */}
            <ul className="history">
                {
                    allThreads?.map((thread ,idx) => (
                        <li key={idx}>{thread.title}</li>
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