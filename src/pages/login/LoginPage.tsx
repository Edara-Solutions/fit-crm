import { FormEvent, useState } from 'react';
import { LockKeyhole, LogIn, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

type LoginLocationState = {
  from?: {
    pathname?: string;
  };
};

export function LoginPage() {
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = (location.state as LoginLocationState | null)?.from?.pathname ?? '/dashboard';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Invalid email or password.');
    }
  }

  return (
    <main className="min-h-screen bg-bg-deep font-sans text-[#F5F5F5]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_480px]">
        <section className="relative hidden overflow-hidden border-r border-border-subtle bg-panel lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(163,20,28,0.28),transparent_38%),radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_24%)]" />
          <div className="relative flex h-full flex-col justify-between p-12">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-brand text-2xl font-black italic text-white">F</div>
              <span className="text-2xl font-black italic tracking-tighter text-white underline decoration-brand decoration-4 underline-offset-4">FIT</span>
            </div>

            <div className="max-w-2xl">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-brand">CRM Control Center</p>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white">
                Sales, inventory, and customers in one command view.
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-6 text-gray-400">
                Track supplement orders, monitor low stock, manage customers, and keep the FIT operation moving from a single dashboard.
              </p>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3">
              {['LIVE NODE', 'SECURE OPS', 'ADMIN READY'].map((label) => (
                <div key={label} className="border border-border-subtle bg-bg-deep/70 px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">{label}</p>
                  <div className="mt-2 h-1 bg-brand" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-brand text-xl font-black italic text-white">F</div>
              <span className="text-2xl font-black italic tracking-tighter text-white underline decoration-brand decoration-4 underline-offset-4">FIT</span>
            </div>

            <Card>
              <CardContent className="p-6 sm:p-8">
                <div className="mb-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">Admin Login</p>
                  <h2 className="mt-2 text-3xl font-black uppercase italic tracking-tighter text-white">Welcome Back</h2>
                  <p className="mt-2 text-sm text-gray-500">Sign in to open the dashboard.</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">Email</span>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                      <Input className="pl-10" onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" type="email" value={email} />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">Password</span>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                      <Input className="pl-10" onChange={(event) => setPassword(event.target.value)} placeholder="password123" type="password" value={password} />
                    </div>
                  </label>

                  {error && <p className="border-l-2 border-brand bg-brand/10 px-3 py-2 text-xs font-semibold text-red-200">{error}</p>}

                  <Button className="w-full" disabled={loading} icon={<LogIn className="h-4 w-4" />} type="submit">
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
