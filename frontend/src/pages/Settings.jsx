import { Settings as SettingsIcon, Bell, Lock, User, Eye, Zap } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    alerts: true,
    language: 'en',
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const cardStyle = {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
  };

  const fieldStyle = {
    backgroundColor: 'var(--secondary)',
    borderColor: 'var(--border)',
    color: 'var(--foreground)',
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }} className="p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" style={{ color: 'var(--primary)' }} />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <p style={{ color: 'var(--muted-foreground)' }}>
          Manage your account and application preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div style={cardStyle} className="rounded-lg border p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5" style={{ color: 'var(--primary)' }} />
            <h2 className="text-lg font-bold">Account Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label style={{ color: 'var(--muted-foreground)' }} className="mb-2 block text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                value="trader_john"
                readOnly
                style={fieldStyle}
                className="w-full rounded-lg border px-4 py-2 transition focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label style={{ color: 'var(--muted-foreground)' }} className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                value="trader@example.com"
                readOnly
                style={fieldStyle}
                className="w-full rounded-lg border px-4 py-2 transition focus:border-primary focus:outline-none"
              />
            </div>
            <button
              className="mt-4 rounded-lg px-6 py-2 font-bold transition"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              Save Changes
            </button>
          </div>
        </div>

        <div style={cardStyle} className="rounded-lg border p-6">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" style={{ color: 'var(--primary)' }} />
            <h2 className="text-lg font-bold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p style={{ color: 'var(--muted-foreground)' }} className="text-sm">
                  Receive trading signals via email
                </p>
              </div>
              <div
                className="h-6 w-11 rounded-full transition"
                style={{
                  backgroundColor: settings.emailNotifications ? 'var(--primary)' : 'var(--secondary)',
                }}
                onClick={() => handleToggle('emailNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p style={{ color: 'var(--muted-foreground)' }} className="text-sm">
                  Get instant alerts on your device
                </p>
              </div>
              <div
                className="h-6 w-11 rounded-full transition"
                style={{
                  backgroundColor: settings.pushNotifications ? 'var(--primary)' : 'var(--secondary)',
                }}
                onClick={() => handleToggle('pushNotifications')}
              />
            </div>
          </div>
        </div>

        <div style={cardStyle} className="rounded-lg border p-6">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5" style={{ color: 'var(--primary)' }} />
            <h2 className="text-lg font-bold">Alert Preferences</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label style={{ color: 'var(--muted-foreground)' }} className="mb-2 block text-sm font-medium">
                Minimum Confidence Level
              </label>
              <select
                value={settings.alerts ? '70' : '50'}
                onChange={(e) => handleChange('confidence', e.target.value)}
                style={fieldStyle}
                className="w-full rounded-lg border px-4 py-2 transition focus:border-primary focus:outline-none"
              >
                <option value="50">50% and above</option>
                <option value="70">70% and above</option>
                <option value="80">80% and above</option>
                <option value="90">90% and above</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Alerts</p>
                <p style={{ color: 'var(--muted-foreground)' }} className="text-sm">
                  Turn alerts on/off
                </p>
              </div>
              <div
                className="h-6 w-11 rounded-full transition"
                style={{ backgroundColor: settings.alerts ? 'var(--primary)' : 'var(--secondary)' }}
                onClick={() => handleToggle('alerts')}
              />
            </div>
          </div>
        </div>

        <div style={cardStyle} className="rounded-lg border p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5" style={{ color: 'var(--primary)' }} />
            <h2 className="text-lg font-bold">Security</h2>
          </div>
          <div className="space-y-4">
            <button
              className="w-full rounded-lg border px-6 py-2 font-bold transition"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              Change Password
            </button>
            <button
              className="w-full rounded-lg border px-6 py-2 font-bold transition"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              Enable Two-Factor Authentication
            </button>
          </div>
        </div>

        <div style={cardStyle} className="rounded-lg border p-6">
          <div className="mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5" style={{ color: 'var(--primary)' }} />
            <h2 className="text-lg font-bold">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label style={{ color: 'var(--muted-foreground)' }} className="mb-2 block text-sm font-medium">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={fieldStyle}
                className="w-full rounded-lg border px-4 py-2 transition focus:border-primary focus:outline-none"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
            <div>
              <label style={{ color: 'var(--muted-foreground)' }} className="mb-2 block text-sm font-medium">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                style={fieldStyle}
                className="w-full rounded-lg border px-4 py-2 transition focus:border-primary focus:outline-none"
              >
                <option value="en">English</option>
                <option value="es">Espanol</option>
                <option value="fr">Francais</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
