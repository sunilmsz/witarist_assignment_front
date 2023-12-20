import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import { toast } from "react-toastify";
import { MySocket } from "../../utils/socketService";

export const TodoEdit = (prop) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const socketRef = useRef(null);
  const [content, setContent] = useState(prop.content);
  const [priority, setPriority] = useState(prop.priority);
  const [category, setCategory] = useState(prop.category);
  const [isCompleted,setIsCompleted] = useState(prop.isCompleted);
  const options = [
    { label: "High", value: 50 },
    { label: "Medium", value: 30 },
    { label: "Low", value: 10 },
  ];

  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    socketRef.current = (new MySocket()).socket;
  }, []);

  async function editTodo() {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const options = {
          method: "put",
          url: `${apiUrl}/todos`,
          headers: {
            authorization: localStorage.getItem("authKey"),
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          data: {
            content,
            category,
            priority,
            isCompleted,
            todoId:prop.todoId
          },
          withCredentials: true,
        };
    
        const response = await axios.request(options);
       
        const emailId = localStorage.getItem("email");
        socketRef.current.emit("edit-todo", emailId, response.data.data._id);
        toast.info(response.data.msg);
        setOpen(false);
        setConfirmLoading(false);
    } catch (error) {
        console.log(error)
        setConfirmLoading(false);
    }

  }

  const handleOk = () => {
    editTodo()
    setConfirmLoading(true);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  return (
    <>
      <CiEdit onClick={showModal}></CiEdit>
      <Modal
        title="Edit"
        open={open}
        onOk={handleOk}
        okText="Submit"
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <div className="todo-edit-block">
          <input
            type="text"
            className="app-input todo-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Todo.."
          />
          <input
            type="text"
            className="app-input todo-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category "
          />
          <select
            className="todo-priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {options.map((option, index) => {
              return (
                <option value={option.value} key={index}>
                  {option.label}
                </option>
              );
            })}
          </select>
          <select
          value={isCompleted}
            className="todo-priority-select"
            onChange={(e) => setIsCompleted(e.target.value)}
          >
            <option value={true}>completed</option>

            <option value={false}>not completed</option>
          </select>
        </div>
      </Modal>
    </>
  );
};
