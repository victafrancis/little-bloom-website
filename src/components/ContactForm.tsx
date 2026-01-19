import React, { useState } from 'react';
import { Button } from './Button';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot field for spam
    const honeypot = (e.target as HTMLFormElement).website?.value;
    if (honeypot) {
      console.log('Spam detected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Send form data to our API route
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error sending email:', err);
      setError(err instanceof Error ? err.message : 'Sorry, there was an error sending your message. Please try again or contact us directly at hello@littlebloomphotography.com');
    } finally {
      setIsLoading(false);
    }
  };
  if (submitted) {
    return <div className="bg-sage/10 p-8 rounded-lg text-center">
        <h3 className="text-xl font-display mb-4">
          Thank you for reaching out!
        </h3>
        <p>I've received your message and will get back to you within one business day.</p>
        <p className="text-sm text-text/70 mt-2">You'll also receive a confirmation email shortly.</p>
      </div>;
  }
  return <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block mb-2 font-medium">
          Name <span className="text-mauve">*</span>
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full border-b border-text/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage disabled:opacity-50"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block mb-2 font-medium">
          Email <span className="text-mauve">*</span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full border-b border-text/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage disabled:opacity-50"
          placeholder="Your email"
        />
      </div>
      <div>
        <label htmlFor="message" className="block mb-2 font-medium">
          Message <span className="text-mauve">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          disabled={isLoading}
          className="w-full border border-text/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage rounded-lg disabled:opacity-50"
          placeholder="Tell me about your session"
        />
      </div>
      {/* Honeypot field for spam protection */}
      <div className="hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex justify-center">
        <Button type="submit" disabled={isLoading} className="w-full md:w-auto disabled:opacity-50">
          {isLoading ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>;
}
