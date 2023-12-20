
import {useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios';
import {  toast } from 'react-toastify'

export function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    function signIn(e) {
        e.preventDefault();
        if(!email || email.trim()=="")
        return toast.error("Enter valid email!");
        
        if(!password || password.trim()=="")
        return  toast.error("Enter valid passowrd!");
        
        dosignIn()
        
        
    }

    async function dosignIn() {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response =  await axios.post(`${apiUrl}/users/login`,{email,password})
            console.log(response.data)
            localStorage.setItem('authKey',response.data.data.token)
            localStorage.setItem('email',response.data.data.email)
            toast(response.data.msg)
            navigate('/dashboard');
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.msg || "Something went wrong");
        }

        
    }

    return <>
        <form className='text-center flow ' style={{paddingTop:"4.5rem"}}>
            <p className='heading-100'> Welcome Back!</p>
            <input type='text' className='app-input' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder=' Email' /> <br /> 
            <input type='text' className='app-input' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder=' Password' /> <br />
            <button type='submit' className='button' onClick={signIn} >Login </button>
            <p>Don't have an account?  <span> <Link to="/signup">SignUp</Link>  </span> </p>
        </form>
    </>
}