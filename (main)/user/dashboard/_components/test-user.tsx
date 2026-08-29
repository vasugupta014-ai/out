'use server'
import { db } from '@/lib/db';
import { promise } from 'zod';

interface User {
  id: number;
  name: string;
  email: string;
}

export default async function TestUsers() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const users = db.prepare('SELECT * FROM users').all() as User[];
    return (
        <>
            <h1>Internal SQLite Users</h1>
              <ul>
                {users.map((user) => (
                  <li key={user.id}>
                    <strong>{user.name}</strong> — {user.email}
                  </li>
                ))}
              </ul>
        </>
    );
}