import { useState } from "react";
import "./Login.css";

function Login({onLogin , onSignup}){
    const [email ,setEmail] =useState("");
    const [password ,setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/auth/login",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();
            if(!response.ok){
                alert(data.message);
                return;
            }

            alert("Login successful");
           onLogin(data.token);

        } catch (error) {
            console.error("Login error:", error);
            alert("Something went wrong");
        }
    };
    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div className="login-circle">
                        S
                    </div>
                    <h1>Sigmagpt</h1>
                </div>
                <p className="login-subtitle">Welcome back</p>

                <form onSubmit={handleLogin}>
                    <label> Email</label>
                    <input type="email"
                         placeholder="Email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                   />
                   <br />
                    <label> Password</label>
                   <input type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                   />
                   <br />
                   <button type="submit">
                    Login
                   </button>
            </form>
            <p className="signup-text">Don't have an account?{" "}
                <span onClick= {onSignup}>Sign up</span>
            </p>
            </div>
            
            
        </div>
    );

}

export default Login;