import sqlite3 from 'sqlite3';

interface UserRow {
    id: number;
    username: string;
    password: string;
}

interface TodoRow {
    id: number;
    userId: number;
    todo: string;
}

const db = new sqlite3.Database(`temp-db.sqlite`);

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      todo TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
});

interface User {
    id: number;
    username: string;
}

export const createUser = (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
            if (err) {
                reject(err);
            } else {
                db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, user: User) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(user);
                    }
                });
            }
        });
    });
};

export const findUserByUsername = (username: string) => {
    return new Promise<UserRow | null>((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row: UserRow) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

export const createTodo = (userId: number, todo: string) => {
    return new Promise<void>((resolve, reject) => {
        db.run('INSERT INTO todos (userId, todo) VALUES (?, ?)', [userId, todo], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const getTodosByUserId = (userId: number) => {
    return new Promise<TodoRow[]>((resolve, reject) => {
        db.all('SELECT * FROM todos WHERE userId = ?', [userId], (err, rows: TodoRow[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

export const deleteTodo = (todoId: number) => {
    return new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM todos WHERE id = ?', [todoId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export default db;

