import './todoItem.css'
import { CiEdit } from "react-icons/ci";
import {TodoEdit} from './TodoEdit'
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import {  toast } from 'react-toastify'
import { useEffect ,useRef} from 'react';
import {MySocket} from '../../utils/socketService'
export function Todo(prop) {
    console.log(prop)
    const socketRef = useRef(null);
    const getPriority = (num) => {
        return num==10 ? "Low" : num==  30 ? "Medium" : "High"
    }

    useEffect(()=> {
        socketRef.current = (new MySocket()).socket
    })

    const deleteTodo =async () => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const options = {
            method: "put",
            url: `${apiUrl}/todos`,
            headers: {
                "authorization": localStorage.getItem("authKey"),
              "Content-Type": "application/json",
              'Accept': 'application/json'
            },
            data :{
                todoId: prop.todoId,
                isArchived:true
            },
              withCredentials: true
        }
        
        const response = await axios.request(options)
        toast.info(response.data.msg);
        const emailId = localStorage.getItem('email')
        socketRef.current.emit("delete-todo",emailId,response.data.data._id)
    }

    return <>
    <div className="todo-item-block">

    <p>{prop.category} - {getPriority(prop.priority)} - {prop.isCompleted ? "Completed" : "Pending" }</p>
    <p>{prop.content}</p>
    {prop.actions &&  <div className="actions">
        <TodoEdit todoId={prop.todoId} content={prop.content} category={prop.category} priority={prop.priority} isCompleted={prop.status}></TodoEdit>   
        <MdDelete onClick={()=>deleteTodo()}></MdDelete>
    </div>}
    
    </div>
    </>
}