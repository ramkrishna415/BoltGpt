import { useContext, useEffect, useState } from "react";
import "./LoginPage.css"
import { myContext } from "./MyContext";
import { useNavigate } from "react-router-dom";

 
function Loginpage(){
 const{isLoging,setIsLogin}=useContext(myContext);
const navigate = useNavigate(); 

const [formData, setFormData] = useState({
     name: "",
      email: "",
       password: ""
     });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

      const clickHandle=()=>{
        setIsLogin(!isLoging)
         setFormData({ name: "", 
            email: "",
             password: ""
     });
      }

       const handleSubmit = async () => {
        const endpoint = isLoging ? "/api/login" : "/api/register";
        
        try {
            const response = await fetch(`https://boltgpt.onrender.com${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
                            if(response.ok){
                            if(isLoging){
                                localStorage.setItem("token", data.token);
                                 setIsLogin(true);
                    alert("Login Successful!");
                            navigate("/");
                            }else{
                                alert("Registration Successful! please login.");
                                setIsLogin(true);
                               
                            }
             }else{
                 alert(data.msg || data.error || "Something went wrong!");
             }
            }catch (err) {
            console.error(err);
             alert("Server is not responding.");
        }
    }

    useEffect(()=>{
   const token = localStorage.getItem("token");
   if(token){
    alert("You are already logged in!");
      navigate("/");
   }
    },[navigate])
    return(
       <>
   <div className="contener">
    <div className="login">
        <div className="input">
           
         <div className="input-group">
             <h2 className="welcome">Welcome to {isLoging ? "Login page" : "Signup page"} </h2>
           {!isLoging && ( 
            <>
          <label>Full Name</label>
           <input type="text" placeholder="Enter the neme"  name="name" value={formData.name} onChange={handleChange} />
         </>
       ) }
        
        
          <label>Email Address</label>
           <input type="email" placeholder="Enter the email"  name="email" value={formData.email} onChange={handleChange}/>
          
          <label>Password</label>
           <input type="password" placeholder="Enter the password"  name="password" value={formData.password} onChange={handleChange} />

       </div>
           <button className="btn"onClick={handleSubmit} >{isLoging ? "Login":"Signup"}</button>

     </div>
    </div>
    <div className="signup">
        <h1 >Welcome Back! </h1>
        <h1>Please {isLoging ? "Signup":"Login"} to stay connected</h1>
        <button className="btn-1" onClick={clickHandle}>{isLoging ? "Signup":"Login"}</button>
    </div>
   </div>

        </>
    )
}

export  default Loginpage;