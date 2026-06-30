import {
  Camera,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Send,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { sendContactMessage } from '../lib/api';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email developers',
    value: 'developers@trendai.app',
    text: 'For bug reports, product questions, partnerships, and custom builds.',
    href: 'mailto:developers@trendai.app',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp support',
    value: '+237 000 000 000',
    text: 'Reach the team for fast questions about setup and app usage.',
    href: 'https://wa.me/237000000000',
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'Remote team',
    text: 'Building TrendAI for traders across Africa and global markets.',
    href: null,
  },
];

const socialLinks = [
  { label: 'TikTok', href: 'https://www.tiktok.com/@trendai', icon: Music2 },
  { label: 'Instagram', href: 'https://www.instagram.com/trendai', icon: Camera },
  { label: 'Facebook', href: 'https://www.facebook.com/trendai', icon: Users },
  { label: 'GitHub', href: 'https://github.com/trendai', icon: Users },
  { label: 'WhatsApp', href: 'https://wa.me/237000000000', icon: MessageCircle },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const inputStyle = {
    borderColor: 'var(--border)',
    backgroundColor: 'var(--secondary)',
    color: 'var(--foreground)',
  };

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');
    setErrorMessage('');

    try {
      await sendContactMessage(formData);
      setStatusMessage('Message sent. The TrendAI team will review it soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8" style={{ color: 'var(--foreground)' }}>
      <section
        className="rounded-[28px] border p-5 sm:p-6 lg:p-8"
        style={{
          borderColor: 'var(--border)',
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, transparent), transparent 38%), var(--card)',
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--primary)' }}>
          Contact Us
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          Talk to the TrendAI developers
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
          Send feedback, report issues, request features, or connect with us on social media.
          We use your messages to make TrendAI sharper for real traders.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-4">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            const content = (
              <div
                className="rounded-[24px] border p-5 transition hover:-translate-y-0.5"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--primary) 13%, transparent)',
                      color: 'var(--primary)',
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold">{method.title}</h2>
                    <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                      {method.value}
                    </p>
                    <p className="mt-2 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
                      {method.text}
                    </p>
                  </div>
                </div>
              </div>
            );

            return method.href ? (
              <a key={method.title} href={method.href} target="_blank" rel="noreferrer">
                {content}
              </a>
            ) : (
              <div key={method.title}>{content}</div>
            );
          })}

          <div
            className="rounded-[24px] border p-5"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
          >
            <h2 className="font-bold">Social media</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-85"
                    style={{
                      backgroundColor: 'var(--secondary)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border p-5 sm:p-6"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
        >
          <h2 className="text-xl font-bold">Send a message</h2>
          <p className="mt-2 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
            Send feedback, report a bug, or request a feature directly to the backend.
          </p>

          {statusMessage ? (
            <div
              className="mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold"
              style={{
                borderColor: 'color-mix(in srgb, var(--primary) 34%, var(--border))',
                backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                color: 'var(--primary)',
              }}
            >
              {statusMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div
              className="mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold"
              style={{
                borderColor: 'color-mix(in srgb, var(--destructive) 34%, var(--border))',
                backgroundColor: 'color-mix(in srgb, var(--destructive) 10%, transparent)',
                color: 'var(--destructive)',
              }}
            >
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                Name
              </span>
              <input
                className="h-12 w-full rounded-2xl border px-4 outline-none"
                onChange={(event) => updateField('name', event.target.value)}
                required
                style={inputStyle}
                value={formData.name}
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                Email
              </span>
              <input
                type="email"
                className="h-12 w-full rounded-2xl border px-4 outline-none"
                onChange={(event) => updateField('email', event.target.value)}
                required
                style={inputStyle}
                value={formData.email}
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>
              Message
            </span>
            <textarea
              className="min-h-40 w-full rounded-2xl border px-4 py-3 outline-none"
              onChange={(event) => updateField('message', event.target.value)}
              required
              style={inputStyle}
              value={formData.message}
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </section>
    </div>
  );
}
