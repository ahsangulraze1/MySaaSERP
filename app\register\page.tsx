'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const body = {
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      password: (form.elements.namedItem('password') as HTMLInputElement).value
    };

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.message || 'Error');
    }
  }

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: <input name="email" type="email" required /></label>
        </div>
        <div>
          <label>Name: <input name="name" type="text" /></label>
        </div>
        <div>
          <label>Password: <input name="password" type="password" required /></label>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
