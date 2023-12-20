import { useEffect, useState,useRef } from "react";
import axios from "axios";
import {  toast } from 'react-toastify'
import './todoCreate.css'
import {MySocket} from '../../utils/socketService'
export function TodoCreate(prop) {

    const socketRef = useRef("");
    const [content,setContent] = useState("")
    const [priority,setPriority] = useState(50)
    const [category,setCategory] = useState("");
    const options = [{label:"High",value:50},{label:"Medium",value:30},{label:"Low",value:10}]

    
    useEffect(()=>{
        const socket = new MySocket();
        socketRef.current = socket.socket;
    },[])

    async function createTodo() {
        const apiUrl = import.meta.env.VITE_API_URL;
        const options = {
            method: "post",
            url: `${apiUrl}/todos`,
            headers: {
                "authorization": localStorage.getItem("authKey"),
              "Content-Type": "application/json",
              'Accept': 'application/json'
            },
            data :{
                content,category,priority
            },
              withCredentials: true
        }
        
        const response = await axios.request(options)
        toast.info(response.data.msg);
        const emailId = localStorage.getItem('email')
        socketRef.current.emit("create-todo",emailId,response.data.data._id)
    }

    return <>
    <div className="todo-input-container flow-right">
        <input type="text" className="app-input todo-input" value={content} onChange={(e)=>setContent(e.target.value)} placeholder='Todo..' />
        <input type="text" className="app-input todo-input" value={category} onChange={(e)=>setCategory(e.target.value)} placeholder='Category ' />
        <select className="todo-priority-select" onChange={(e)=>setPriority(e.target.value)} >
        {options.map((option, index) => {
                    return (
                        <option value={option.value} key={index}>
                            {option.label}
                        </option>
                    );
                })}

        </select>
        <button className="button" onClick={createTodo} >create</button>
    
    </div>
    </>
}