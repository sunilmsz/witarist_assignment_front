import { useState, useEffect, useRef, useMemo } from "react";
import { TodoCreate } from "../Todo/TodoCreate";
import { Todo } from "../Todo/Todo";
import "./dashBoard.css";
import { MySocket } from "../../utils/socketService";

export function Dashboard() {
  const [showMyTodo, setShowMyTodo] = useState(true);

  const socketRef = useRef(null);
  const myTodoRef = useRef(null);
  const otherTodoRef = useRef(null);
  const [myTodos, setMyTodos] = useState([]);

  const [otherEmailId, setOtherEmailId] = useState("");
  const emailId = localStorage.getItem("email");
  useEffect(() => {
    const socketInstance = new MySocket();
    socketRef.current = socketInstance.socket;
    const socket = socketInstance.socket;
    socket.emit("join", emailId);
    socket.on("todos", (todos) => {
      console.log(todos);
      setMyTodos(todos || []);
    });
    // socket.on("other-todos",todos => setOtherTodos(todos))
    socket.on("created", (todo) => {
      setMyTodos((myTodos) => {
        return [...myTodos, todo];
      });
    })

      socket.on("deleted", (todoId) => {
        console.log({ myTodos, todoId });
        setMyTodos((myTodos) => [
          ...myTodos.filter((obj) => obj._id != todoId),
        ]);
      });

      socket.on("edited", (todo) =>
       {
        console.log({ myTodos, todo });
        setMyTodos((myTodos) => [
          ...myTodos.map((obj) => (obj._id != todo._id ? obj : { ...todo })),
        ]);
      });

    // socket.on("other-created",todo=>setOtherTodos([...otherTodos,todo]))
  }, []);

  useEffect(() => {
    const selectedClass = "menu-item-selected";
    if (showMyTodo) {
      myTodoRef.current.classList.add(selectedClass);
      otherTodoRef.current.classList.remove(selectedClass);
      socketRef.current.emit("getTodos", emailId);
    } else {
      myTodoRef.current.classList.remove(selectedClass);
      otherTodoRef.current.classList.add(selectedClass);
    }
    console.log(myTodoRef.current.classList);
  }, [showMyTodo]);

  const sortedTodos = useMemo(() => {
    const todos = [...myTodos].sort(
      (obj1, obj2) => obj2.priority - obj1.priority
    );
    return todos;
  }, [myTodos]);

  const getOtherUserTodo = () => {
    socketRef.current.emit("get-other-todos", otherEmailId);
  };

  return (
    <>
      <div className="dashboard flow ">
        <p className="heading-100 text-center">Dashboard</p>
        <div className="dashboard-menu">
          <p
            className="dashboard-menu-item menu-item-selected"
            ref={myTodoRef}
            onClick={() => {
              setMyTodos([]);
              setShowMyTodo(true);
            }}
          >
            My Todos
          </p>
          <p
            className="dashboard-menu-item"
            ref={otherTodoRef}
            onClick={() => {
              setMyTodos([]);
              setShowMyTodo(false);
            }}
          >
            other Todos
          </p>
        </div>

        {showMyTodo ? (
          <>
            <TodoCreate />
            {sortedTodos.map((obj, index) => (
              <Todo
                actions={true}
                category={obj.category}
                priority={obj.priority}
                key={index}
                content={obj.content}
                status={obj.isCompleted}
                todoId={obj._id}
              />
            ))}
          </>
        ) : (
          <div className="flow">
            <div className="other-user-input">
              <input
                type="text"
                className="app-input "
                value={otherEmailId}
                onChange={(e) => setOtherEmailId(e.target.value)}
                placeholder="Enter Email"
                style={{ marginRight: "1rem" }}
              />
              <button className="button" onClick={getOtherUserTodo}>
                show
              </button>
            </div>
            {sortedTodos.map((obj, index) => (
              <Todo
                key={index}
                category={obj.category}
                priority={obj.priority}
                content={obj.content}
                status={obj.isCompleted}
                todoId={obj._id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
