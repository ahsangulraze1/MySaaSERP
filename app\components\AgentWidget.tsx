'use client';

import { useState } from 'react';

export default function AgentWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: 'user' | 'agent'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages((m) => [...m, { from: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });
    const data = await res.json();
    setLoading(false);
    setMessages((m) => [...m, { from: 'agent', text: data.reply || 'No reply' }]);
  }

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20 }}>
      {open ? (
        <div style={{ width: 320, height: 400, border: '1px solid #ccc', background: '#fff', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 8, borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
            <span>Agent</span>
            <button onClick={() => setOpen(false)}>X</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 4, textAlign: m.from === 'user' ? 'right' : 'left' }}>
                <span style={{ background: m.from === 'user' ? '#e0f7fa' : '#e8eaf6', padding: '4px 8px', borderRadius: 4 }}>
                  {m.text}
                </span>
              </div>
            ))}
            {loading && <p>Agent is thinking...</p>}
          </div>
          <div style={{ padding: 8, borderTop: '1px solid #ddd' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ width: '80%' }}
              placeholder="Ask the agent..."
            />
            <button onClick={sendMessage} style={{ width: '18%', marginLeft: '2%' }}>Send</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)}>Open Agent</button>
      )}
    </div>
  );
}
