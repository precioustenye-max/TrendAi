import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  User,
  Eye,
  Zap,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function ToggleRow({ title, description, enabled, onToggle }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={enabled}
        className="relative mt-1 inline-flex h-7 w-12 shrink-0 rounded-full transition"
        style={{ backgroundColor: enabled ? 'var(--primary)' : 'var(--secondary)' }}
      >
        <span
          className="absolute top-1 h-5 w-5 rounded-full bg-white transition"
          style={{ left: enabled ? '1.5rem' : '0.25rem' }}
        />
      </button>
    </div>
  );
}

function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-3xl border p-5 sm:p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-2xl p-2.5" style={{ backgroundColor: 'rgba(96,165,250,0.08)', color: 'var(--primary)' }}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    alerts: true,
    language: 'en',
    confidence: '70',
  });

  const handleToggle = (key) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleChange = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const fieldStyle = {
    backgroundColor: 'var(--secondary)',
    borderColor: 'var(--border)',
    color: 'var(--foreground)',
  };

  return (
    <div
      className="space-y-6 p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <section
        className="rounded-3xl border p-5 sm:p-6 lg:p-8"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
          backgroundImage:
            'linear-gradient(135deg, rgba(24,210,107,0.08), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent)',
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ backgroundColor: 'rgba(24,210,107,0.1)', color: 'var(--primary)' }}>
              <SettingsIcon className="h-4 w-4" />
              Control center
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">Settings</h1>
              <p className="mt-2 max-w-2xl text-sm sm:text-base" style={{ color: 'var(--muted-foreground)' }}>
                Manage account information, notifications, alerts, appearance, and security preferences from a cleaner responsive workspace.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <div className="rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
              <p style={{ color: 'var(--muted-foreground)' }}>Theme</p>
              <p className="mt-1 font-semibold capitalize">{theme}</p>
            </div>
            <div className="rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
              <p style={{ color: 'var(--muted-foreground)' }}>Alerts</p>
              <p className="mt-1 font-semibold">{settings.alerts ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <SectionCard
            icon={User}
            title="Account Settings"
            description="Core profile details used across your workspace."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Username
                </label>
                <input
                  type="text"
                  value="trader_john"
                  readOnly
                  style={fieldStyle}
                  className="w-full rounded-2xl border px-4 py-3 transition focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Email
                </label>
                <input
                  type="email"
                  value="trader@example.com"
                  readOnly
                  style={fieldStyle}
                  className="w-full rounded-2xl border px-4 py-3 transition focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                Save Changes
              </button>
              <button
                className="inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-semibold transition"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                Update Profile
              </button>
            </div>
          </SectionCard>

          <SectionCard
            icon={Bell}
            title="Notifications"
            description="Control how TrendAi reaches you when new signals are generated."
          >
            <div className="space-y-3">
              <ToggleRow
                title="Email Notifications"
                description="Receive trade analysis summaries and important account updates by email."
                enabled={settings.emailNotifications}
                onToggle={() => handleToggle('emailNotifications')}
              />
              <ToggleRow
                title="Push Notifications"
                description="Get instant alerts on supported devices for new opportunities."
                enabled={settings.pushNotifications}
                onToggle={() => handleToggle('pushNotifications')}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={Zap}
            title="Alert Preferences"
            description="Tune the quality threshold and control whether alerts are active."
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Minimum Confidence Level
                </label>
                <select
                  value={settings.confidence}
                  onChange={(e) => handleChange('confidence', e.target.value)}
                  style={fieldStyle}
                  className="w-full rounded-2xl border px-4 py-3 transition focus:border-primary focus:outline-none"
                >
                  <option value="50">50% and above</option>
                  <option value="70">70% and above</option>
                  <option value="80">80% and above</option>
                  <option value="90">90% and above</option>
                </select>
              </div>

              <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Alert status</p>
                <div className="mt-3">
                  <ToggleRow
                    title="Enable Alerts"
                    description="Pause or resume signal alerts without changing other settings."
                    enabled={settings.alerts}
                    onToggle={() => handleToggle('alerts')}
                  />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard
            icon={Eye}
            title="Appearance"
            description="Customize how the application looks and how content is localized."
          >
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  style={fieldStyle}
                  className="w-full rounded-2xl border px-4 py-3 transition focus:border-primary focus:outline-none"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  style={fieldStyle}
                  className="w-full rounded-2xl border px-4 py-3 transition focus:border-primary focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Espanol</option>
                  <option value="fr">Francais</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={Lock}
            title="Security"
            description="Protect your account with stronger authentication and credential management."
          >
            <div className="space-y-3">
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <ShieldCheck className="h-4 w-4" />
                Change Password
              </button>
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <Lock className="h-4 w-4" />
                Enable Two-Factor Authentication
              </button>
            </div>
          </SectionCard>

          <SectionCard
            icon={Globe}
            title="Workspace Notes"
            description="Quick operational context for your current configuration."
          >
            <div className="space-y-3 rounded-2xl border p-4 text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
              <div className="flex items-center justify-between gap-4">
                <span style={{ color: 'var(--muted-foreground)' }}>Preferred theme</span>
                <span className="font-semibold capitalize">{theme}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span style={{ color: 'var(--muted-foreground)' }}>Language</span>
                <span className="font-semibold uppercase">{settings.language}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span style={{ color: 'var(--muted-foreground)' }}>Minimum confidence</span>
                <span className="font-semibold">{settings.confidence}%+</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
