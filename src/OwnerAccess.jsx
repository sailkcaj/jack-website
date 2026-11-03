import React, { useState } from 'react';

export default function OwnerAccess({ isEditor, authReady, editorEmail, authError, clearAuthError, signIn, signOutEditor, initiallyOpen = false }) {
  const [open, setOpen] = useState(initiallyOpen);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!authReady) return null;

  if (isEditor) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '12px', color: 'var(--text-secondary)' }}>
        <span>Signed in as {editorEmail}</span>
        <button
          onClick={signOutEditor}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-accent)', fontSize: '12px', textDecoration: 'underline' }}
        >
          Sign out
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          fontSize: '12px', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius)',
          border: '0.5px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer', color: 'var(--text-secondary)',
          whiteSpace: 'nowrap',
        }}
      >
        Sign in to view
      </button>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const ok = await signIn(email, password);
    setSubmitting(false);
    if (ok) {
      setOpen(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', flexWrap: 'wrap', maxWidth: '420px' }}>
      <input
        aria-label="Owner email"
        required
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); clearAuthError(); }}
        placeholder="Email"
        autoComplete="username"
        style={{ padding: '0.4rem 0.55rem', borderRadius: 'var(--radius)', border: '0.5px solid var(--border)', fontSize: '12px', width: '150px', color: 'var(--text-primary)', background: 'var(--surface-1)' }}
      />
      <input
        aria-label="Password"
        required
        type="password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); clearAuthError(); }}
        placeholder="Password"
        autoComplete="current-password"
        style={{ padding: '0.4rem 0.55rem', borderRadius: 'var(--radius)', border: '0.5px solid var(--border)', fontSize: '12px', width: '120px', color: 'var(--text-primary)', background: 'var(--surface-1)' }}
      />
      <button type="submit" disabled={submitting} style={{
        padding: '0.4rem 0.8rem', borderRadius: 'var(--radius)', border: 'none',
        background: 'var(--fill-accent)', color: 'var(--on-accent)', fontSize: '12px', fontWeight: 500,
        cursor: submitting ? 'not-allowed' : 'pointer',
      }}>
        {submitting ? '…' : 'Sign in'}
      </button>
      <button type="button" onClick={() => { setOpen(false); setPassword(''); clearAuthError(); }} style={{
        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '12px', padding: '0.4rem 0',
      }}>
        Cancel
      </button>
      {authError && <span role="alert" style={{ fontSize: '11px', color: '#c0392b', width: '100%' }}>{authError}</span>}
    </form>
  );
}

