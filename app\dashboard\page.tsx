'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import AgentWidget from '../components/AgentWidget';

type Company = { id: string; name: string };

export default function DashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState('');

  async function loadCompanies() {
    const res = await fetch('/api/companies', { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      setCompanies(data);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  async function handleCreateCompany(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const res = await fetch('/api/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      form.reset();
      loadCompanies();
    } else {
      const data = await res.json();
      setError(data.message || 'Error');
    }
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p><Link href="/leads">Go to Leads</Link></p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Your Companies</h3>
      <ul>
        {companies.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
      <h3>Create Company</h3>
      <form onSubmit={handleCreateCompany}>
        <label>Company Name: <input name="name" required /></label>
        <button type="submit">Create</button>
      </form>
      <AgentWidget />
    </div>
  );
}
