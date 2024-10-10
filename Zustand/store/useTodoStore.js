import { create } from 'zustand';

//zustand에서 상태 관리 스토어를 만들기 위해 create 함수로 스토어 생성.
//set은 zustand 의 핵심함수로 상태를 업데이트 하는데 사용됨.
//set 함수의 state는 Zustand 스토어의 현재 상태를 나타냄.
const useTodoStore = create((set) => ({
    todos: [],
    addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
    removeTodo: (index) => set((state) => ({
      todos: state.todos.filter((_, i) => i !== index),
    })),
}));

export default useTodoStore;