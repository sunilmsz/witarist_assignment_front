
import {useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {  toast } from 'react-toastify'
import axios from 'axios';

export function Register() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [name,setName] = useState("");
    const navigate = useNavigate();

    function signup(e) {
        e.preventDefault();
        if(!name || name.trim().length<=2)
        return toast.error("Enter valid Name!");

        if(!email || email.trim()=="")
        return toast.error("Enter valid email!");
        
        if(!password || password.trim()=="")
        return  toast.error("Enter valid passowrd!");
        dosignUp()
    }

    async function dosignUp() {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response =  await axios.post(`${apiUrl}/users/`,{name,email,password})
            console.log(response.data)
            toast(response.data.msg)
            navigate('/');
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.msg || "Something went wrong");
        }

        
    }


    return <>
        <form className='text-center flow '  style={{paddingTop:"4.5rem"}}>
            <p className='heading-100'> Register</p>
            <input type='text' className='app-input' value={name} onChange={(e)=>setName(e.target.value)} placeholder=' Name' /> <br />
            <input type='text' className='app-input' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder=' Email' /> <br />
            <input type='text' className='app-input' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder=' Password' /> <br />
            <button type='submit' className='button' onClick={signup} >Signup </button>
            <p>Already have an account?  <Link to="/">Login</Link> </p>
        </form>
    </>
}