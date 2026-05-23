import { ArrowRight, Eye, EyeOff, Globe, Sparkles, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const benefits = [
  'Create your personalized analysis dashboard',
  'Store chart screenshots and trade reports',
  'Use Google or email onboarding',
];

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Auth API route was not found. Restart the backend server on the latest code.');
        }
        throw new Error(data.message || data.error || 'Unable to create account');
      }

      localStorage.setItem('trendai_token', data.token);
      localStorage.setItem('trendai_user', JSON.stringify(data.user));
      setSuccessMessage('Account created. Redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
  };

  return (
    <div
      className="min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8"
      style={{
        backgroundColor: '#05080c',
        color: 'var(--foreground)',
      }}
    >
      <div
        className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-[36px] border lg:grid-cols-[0.94fr_1.06fr]"
        style={{
          borderColor: 'rgba(255,255,255,0.06)',
          background:
            'linear-gradient(180deg, rgba(8,11,14,0.96), rgba(6,9,12,0.9))',
          boxShadow: '0 40px 120px rgba(0,0,0,0.45)',
        }}
      >
        <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <div
                  className="grid h-10 w-10 grid-cols-3 gap-1 rounded-xl p-2"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
                  }}
                >
                  {Array.from({ length: 9 }).map((_, index) => (
                    <span
                      key={index}
                      className="rounded-[2px]"
                      style={{
                        backgroundColor:
                          index % 3 === 1 ? 'var(--primary)' : 'rgba(255,255,255,0.82)',
                      }}
                    />
                  ))}
                </div>
                <span className="text-xl font-semibold tracking-[-0.03em] text-white">
                  TrendAi
                </span>
              </Link>
            </div>

            <div
              className="rounded-[30px] p-6 sm:p-8"
              style={{
                background: 'linear-gradient(180deg, rgba(16,20,26,0.92), rgba(11,15,20,0.84))',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
              }}
            >
              <p className="text-sm font-medium text-white/48">Start your account</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                Create your TrendAi profile
              </h1>
              <p className="mt-3 text-sm leading-6 text-white/62">
                Join with email or choose Google for faster onboarding.
              </p>

              <button
                type="button"
                onClick={handleGoogleSignup}
                className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)',
                }}
              >
                <Globe className="h-4 w-4" style={{ color: 'var(--chart-blue)' }} />
                Sign up with Google
              </button>

              <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/28">
                <div className="h-px flex-1 bg-white/8" />
                Or create with email
                <div className="h-px flex-1 bg-white/8" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage ? (
                  <div
                    className="rounded-2xl px-4 py-3 text-sm"
                    style={{
                      backgroundColor: 'rgba(239,68,68,0.12)',
                      color: '#fca5a5',
                      boxShadow: 'inset 0 0 0 1px rgba(239,68,68,0.18)',
                    }}
                  >
                    {errorMessage}
                  </div>
                ) : null}

                {successMessage ? (
                  <div
                    className="rounded-2xl px-4 py-3 text-sm"
                    style={{
                      backgroundColor: 'rgba(34,197,94,0.12)',
                      color: '#86efac',
                      boxShadow: 'inset 0 0 0 1px rgba(34,197,94,0.18)',
                    }}
                  >
                    {successMessage}
                  </div>
                ) : null}

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/72">Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      borderColor: 'rgba(255,255,255,0.08)',
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/72">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      borderColor: 'rgba(255,255,255,0.08)',
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/72">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full rounded-2xl border px-4 py-3 pr-12 text-sm outline-none transition"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        borderColor: 'rgba(255,255,255,0.08)',
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white/72"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/72">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full rounded-2xl border px-4 py-3 pr-12 text-sm outline-none transition"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        borderColor: 'rgba(255,255,255,0.08)',
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white/72"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--primary)',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-white/54">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary-accent hover:opacity-90">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="relative hidden overflow-hidden px-8 py-10 lg:flex lg:flex-col lg:justify-between xl:px-12">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 80% 16%, rgba(24,210,107,0.18), transparent 24%), radial-gradient(circle at 24% 78%, rgba(96,165,250,0.18), transparent 26%), radial-gradient(circle at 48% 50%, rgba(245,158,11,0.08), transparent 20%)',
            }}
          />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div
                className="grid h-10 w-10 grid-cols-3 gap-1 rounded-xl p-2"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
                }}
              >
                {Array.from({ length: 9 }).map((_, index) => (
                  <span
                    key={index}
                    className="rounded-[2px]"
                    style={{
                      backgroundColor:
                        index % 3 === 1 ? 'var(--primary)' : 'rgba(255,255,255,0.82)',
                    }}
                  />
                ))}
              </div>
              <span className="text-xl font-semibold tracking-[-0.03em] text-white">
                TrendAi
              </span>
            </Link>

            <div className="mt-16 max-w-md">
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{
                  backgroundColor: 'rgba(24,210,107,0.1)',
                  color: 'var(--chart-green)',
                  boxShadow: 'inset 0 0 0 1px rgba(24,210,107,0.16)',
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                New account setup
              </div>

              <h2 className="mt-6 text-5xl font-semibold leading-[0.96] tracking-[-0.06em] text-white">
                Build your trading command center.
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/66">
                Create an account to save AI trade reports, compare setup quality, and keep your workflow in one place.
              </p>
            </div>
          </div>

          <div
            className="relative z-10 rounded-[28px] p-5"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
            }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className="inline-flex rounded-2xl p-3"
                style={{
                  backgroundColor: 'rgba(96,165,250,0.1)',
                  color: 'var(--chart-blue)',
                  boxShadow: 'inset 0 0 0 1px rgba(96,165,250,0.14)',
                }}
              >
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">What you unlock</p>
                <p className="text-xs uppercase tracking-[0.16em] text-white/38">
                  Account benefits
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-sm text-white/72">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: 'var(--chart-blue)' }}
                  />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
