import React, { useState } from 'react';
import { Button } from './Button';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    // In a real implementation, you would send this data to your backend
  };
  if (submitted) {
    return <div className="bg-sage/10 p-8 rounded-lg text-center">
        <h3 className="text-xl font-display mb-4">
          Thank you for reaching out!
        </h3>
        <p>I'll get back to you within one business day.</p>
      </div>;
  }
  return <form onSubmit={handleSubmit} className="space-y-6">
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
          className="w-full border-b border-text/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
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
          className="w-full border-b border-text/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
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
          className="w-full border border-text/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
          placeholder="Tell me about your session"
        />
      </div>
      {/* Honeypot field for spam protection */}
      <div className="hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Button type="submit" className="w-full md:w-auto">
        Send Message
      </Button>
    </form>;
}
