import { json, redirect, ActionFunction } from '@remix-run/node';
import {useActionData, Form, Link} from '@remix-run/react';
import { loginUser } from '~/utils/authentication.server';
import { getSession, commitSession } from '~/utils/session.server';
import xss from "xss";
import bcrypt from "bcryptjs";
import React from "react";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const username = xss(formData.get('username') as string);
    const password = xss(formData.get('password') as string);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        const user = await loginUser(username, hashedPassword);
        if (!user) {
            return json({ errorMessage: 'Invalid username or password' }, { status: 400 });
        }

        const session = await getSession(request);
        session.set('userId', user.id);

        return redirect('/dashboard', {
            headers: {
                'Set-Cookie': await commitSession(session),
            },
        });
    } catch (error) {
        return json({ errorMessage: 'Something went wrong' }, { status: 500 });
    }
};


interface ActionData {
    errorMessage?: string;
}

const LoginPage: React.FC = () => {
    const actionData = useActionData<ActionData>();

    return (
        <div className="container">
            <Form method="post" className="form">
                <h2>Login</h2>
                {actionData?.errorMessage && <p className="error">{actionData.errorMessage}</p>}
                    <input type="text" id="username" name="username" placeholder="Username" required />
                    <input type="password" id="password" name="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                <p>
                    Do not have an account? <Link to="/" className="link">Register</Link>
                </p>
            </Form>
        </div>
    );
};

export default LoginPage;
