import { useState, useEffect } from "react";
import { MdCheckBox, MdDeleteForever } from "react-icons/md";
import "./Todo.css";
 
const todoKey = "reactTodo";   //todoKey is just a constant variable."reactTodo" is a string key name. It is used to store and retrieve data from localStorage

export const Todo = () => {   //Holds the current input field value
    const [inputValue, setInputValue] = useState({
    id: "",          //id → unique ID for the todo
    content: "",   //content → text typed by the user
    checked: false  //checked → whether the todo is completed
    });

    const [task, setTask] = useState(() => {   //Stores all todo items in an array
        const rawTodos = localStorage.getItem(todoKey);
        if (!rawTodos) return [];
        return JSON.parse(rawTodos); // to covert the string into array as our data is in array
    });

    //to keep the data even after refreshing the page.    
    useEffect(() => {
    localStorage.setItem(todoKey, JSON.stringify(task));
    }, [task]); //JSON.stringify method to convert the array into string as our data is in aaray.

    const [dateTime, setDateTime] = useState("");

    const handleInputChange = (value) => {
        setInputValue({
            id: Date.now(),
            content: value,
            checked: false
        });
    };   //Runs when typing in the input field. Updates inputValue state. Generates a unique id using Date.now()

    const handleFormSubmit = (event) => {
        event.preventDefault();
    
    const { id, content, checked } = inputValue;
   
    //to check if the input field is empty.
    if (!content) return;
    //to check if the data is alerady existing or not.  cant use include methode for object.
    // if (task.includes(inputValue)) return;
    const ifTodoContentMatched  = task.find(
        (curTask) => curTask.content === content
    );
    if (ifTodoContentMatched) return;

    setTask((prevTask) => [...prevTask, {id:id, content:content, checked:checked}]);
    setInputValue({ id: "", content: "", checked: false });
    };

    useEffect(() => {   
        const interval = setInterval(() => {
        const now = new Date();
        const formttedDate = now.toLocaleDateString();
        const formttedTime = now.toLocaleTimeString();
        setDateTime(`${formttedDate} - ${formttedTime}`)
        }, 1000);
        
        return () => clearInterval(interval);

    }, []);

    const handleDeleteTodo = (todo) => {
        setTask(task.filter((curTask) => curTask.id !== todo.id)); //to clear the list one by one.
    };
    const handleClearTodoData = () => {
        setTask([]);  // the list will be clear by clicking the clear btn the setTask will be empty.
    };

    const handleCheckedTodo = (id) => {
        const updatedTask = task.map((curTask) => {  //.map() loops through every todo. Creates a new array (important for React!)
            if (curTask.id === id) {  //current todo’s id === clicked todo’s id
                return {...curTask, checked: !curTask.checked};
            }else {
                return curTask;  //the item those are not checked keep them as it is
            }
        });
        setTask(updatedTask);
    };

    return (
        <section className="todo-container">
            <header>
                <h1>Todo List</h1>
                <h2 className="date-time">{dateTime}</h2>
            </header>
            <section className="form">
                <form onSubmit={handleFormSubmit}>
                    <div>
                        <input type="text" 
                        className="todo-input" 
                        autoComplete="off" 
                        value={inputValue.content}
                        onChange={(event) => handleInputChange(event.target.value)}  //we will egt the inputValue here.
                        />

                        <button type="submit" className="submit-btn">
                            Add Task
                        </button>
                    </div>
                </form>
            </section>
            <section className="myUnOrdList">
                    <ul>
                        {
                            task.map((curTask) => {
                                return (
                                <li 
                                key={curTask.id} 
                                className="todo-item" 
                                >
                                <span className={curTask.checked ? "checkList" : "notcheckList"}>{curTask.content}</span>
                                <button 
                                className="check-btn" 
                                onClick={() => handleCheckedTodo(curTask.id)}>
                                    <MdCheckBox/>
                                </button>
                                <button 
                                className="delete-btn" 
                                onClick={() => handleDeleteTodo(curTask)}>
                                    <MdDeleteForever/>
                                </button>
                                </li>
                                )
                            })
                        }
                    </ul>
            </section>
            <button className="clear-btn" onClick={handleClearTodoData}>Clear All</button>
        </section>
    )
}