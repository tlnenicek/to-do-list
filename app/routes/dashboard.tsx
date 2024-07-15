import React from 'react';
import { LoaderFunction, redirect, ActionFunction, json } from '@remix-run/node';
import { useLoaderData, Form } from '@remix-run/react';
import { getSession, commitSession } from '~/utils/session.server';
import { addTodo, fetchTodos, removeTodo } from '~/utils/todomanipulation.server';
import xss from 'xss';

interface TodoItem {
    id: number;
    userId: number;
    todo: string;
}

type LoaderData = {
    todos: TodoItem[];
};

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request);
    const userId = session.get('userId');

    if (!userId) {
        return redirect('/login');
    }

    const todos = await fetchTodos(Number(userId));
    return json<LoaderData>({ todos });
};

export const action: ActionFunction = async ({ request }) => {
    const session = await getSession(request);
    const userId = session.get('userId');
    const formData = await request.formData();
    const actionType = formData.get('_action');

    if (actionType === 'add') {
        const todoText = formData.get('todo') as string;
        await addTodo(Number(userId), xss(todoText));
    } else if (actionType && typeof actionType === 'string' && actionType.startsWith('delete-')) {
        const todoId = Number(actionType.split('-')[1]);
        await removeTodo(todoId);
    } else if (actionType === 'logout') {
        session.unset('userId');
        return redirect('/login', {
            headers: {
                'Set-Cookie': await commitSession(session),
            },
        });
    }

    return null;
};

const Dashboard: React.FC = () => {
    const { todos } = useLoaderData<LoaderData>();

    return (
        <div className="dashboard-container">
            <h1>To Do List</h1>

            <Form method="post" className="form-add-todo">
                <input type="text" name="todo" placeholder="Add a new todo" />
                <button type="submit" name="_action" value="add" className="addButton">Add</button>
            </Form>

            <ul className="todo-list">
                {todos.map(todo => (
                    <li key={todo.id} className="todo-item">
                        <span>{todo.todo}</span>
                        <Form method="post">
                            <button type="submit" name="_action" value={`delete-${todo.id}`}>Delete</button>
                        </Form>
                    </li>
                ))}
            </ul>

            <div className="logout-button-form">
                <Form method="post">
                    <button type="submit" name="_action" value="logout" className="logout-button">Logout</button>
                </Form>
            </div>
        </div>
    );
};

export default Dashboard;
