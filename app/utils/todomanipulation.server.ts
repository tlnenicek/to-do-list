import {createTodo, deleteTodo, getTodosByUserId} from './database.server';

export const addTodo = async (userId: number, todo: string) => {
    try {
        await createTodo(userId, todo);
    } catch (error) {
        throw new Error('Unable to add todo');
    }
};

export const fetchTodos = async (userId: number) => {
    try {
        return await getTodosByUserId(userId);
    } catch (error) {
        throw new Error('Unable to fetch todos');
    }
};

export const removeTodo = async (todoId: number) => {
    try {
        await deleteTodo(todoId);
    } catch (error) {
        throw new Error('Unable to delete todo');
    }
};
