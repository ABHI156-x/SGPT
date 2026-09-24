import { useState } from "react";
import "./Signup.css";

function Signup({onSignup ,onLogin}){
    const [name ,setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/auth/signup",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );
        const data = await response.json();
        if(!response.ok){
            alert(data.message);
            return;
        }
        onSignup(data.token);
        } catch (error) {
            console.error("Signup error:", error);
            alert("Something went wrong");
        }
    
    };

    return(
        <div className="signup-page">
            <div className="signup-card">
                <div className="signup-logo">
                    <div className="signup-circle">
                        S
                    </div>
                    <h1>Sigmagpt</h1>
                </div>
                <p className="signup-subtitle">
                    Create your account
                </p>
                <form onSubmit={handleSignup}>
                    <label >Name</label>
                    <input type="text" 
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label >Email</label>
                    <input type="email" 
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label >Password</label>
                    <input type="password" 
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">
                        Create account
                    </button>
                </form>
                <p className="signup-text">
                    Already have an account?{" "}
                  <span onClick={onLogin}>
                       Login
                 </span>
                </p>
            </div>
        </div>
    );
}

export default Signup;