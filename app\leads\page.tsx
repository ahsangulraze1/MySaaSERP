'use client';

import { FormEvent, useEffect, useState } from 'react';
import AgentWidget from '../components/AgentWidget';

type Lead = {
  id: string;
  name: string;
  email?: string;
  status: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState('');

  async function loadLeads() {
    const res = await fetch('/api/leads');
    if (res.ok) {
      const data = await res.json();
      setLeads(data);
    } else {
      setError('Cannot load leads');
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  async function handleCreateLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const body = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value
    };

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      form.reset();
      loadLeads();
    } else {
      const data = await res.json();
      setError(data.message || 'Error');
    }
  }

  return (
    <div>
      <h2>Leads</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {leads.map((l) => (
          <li key={l.id}>{l.name} ({l.email}) - {l.status}</li>
        ))}
      </ul>
      <h3>Create Lead</h3>
      <form onSubmit={handleCreateLead}>
        <div>
          <label>Name: <input name="name" required /></label>
        </div>
        <div>
          <label>Email: <input name="email" type="email" /></label>
        </div>
        <button type="submit">Create</button>
      </form>
      <AgentWidget />
    </div>
  );
}
