import { ActionFunction, json, redirect } from '@remix-run/node';
import { useActionData, Form, Link } from '@remix-run/react';
import bcrypt from 'bcryptjs';
import "../global.css";
import { getSession, commitSession } from "~/utils/session.server";
import { registerUser } from '~/utils/authentication.server';


interface ActionData {
    errorMessage?: string;
}

function isValidUsername(username: string): boolean {
    return /^\S{3,}$/.test(username);
}

function isValidPassword(password: string): boolean {
    return password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password) &&
        !/\s/.test(password);
}

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get('username')?.toString().trim() ?? '';
    const password = formData.get('password')?.toString() ?? '';

    if (!isValidUsername(username) || !isValidPassword(password)) {
        return json({ errorMessage: "Username or password does not meet requirements." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await registerUser(username, hashedPassword);
        const session = await getSession(request);
        session.set('userId', user.id);

        return redirect('/dashboard', {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    } catch (error) {
        return json({ errorMessage: 'Registration failed. Try a different username.' }, { status: 400 });
    }
};

export default function RegisterPage() {
    const actionData = useActionData<ActionData>();

    return (
        <div className="container">
            <Form method="post" className="form">
                <h2>Register</h2>
                <input type="text" name="username" placeholder="Username" required />
                <input type="password" name="password" placeholder="Password" required />
                {actionData?.errorMessage && <p className="error">{actionData.errorMessage}</p>}
                <button type="submit">Register</button>
                <p>
                    Already have an account? <Link to="/login" className="link">Login</Link>
                </p>
            </Form>
        </div>
    );
}
