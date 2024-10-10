import { useState } from 'react';
import useTodoStore from '../store/useTodoStore';

export default function Home() {
    const [todo, setTodo] = useState('');
    const todos = useTodoStore((state) => state.todos);
    const addTodo = useTodoStore((state) => state.addTodo);
    const removeTodo = useTodoStore((state) => state.removeTodo);
    
    const handleAddTodo = () => {
        if (todo.trim() !== '') {
            addTodo(todo);
            setTodo('');
        }
    };

    return (
        <div>
            <h1>Zustand Todo List</h1>
            <input
                type="text"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                placeholder="할 일을 입력하세요"
            />
            <button onClick={handleAddTodo}>추가</button>
            <ul>
                {todos.map((task, index) => (
                    <li key={index}> {task}
                    <button onClick={() => removeTodo(index)}>삭제</button>
                </li>
                ))}
            </ul>
        </div>
    );
}
