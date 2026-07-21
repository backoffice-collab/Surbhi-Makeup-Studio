'use client'

import { useState } from 'react'
import { site } from '@/lib/site'
import styles from './contact.module.css'

const INTERESTS = [
  'Bridal Makeup',
  'Party / Event Makeup',
  'Academy Admission',
  'Other',
] as const

type Errors = Partial<Record<'name' | 'phone', string>>

/**
 * The prototype's form had no <form>, no labels, no validation and a submit
 * handler that only fired an alert() — every enquiry was silently lost.
 *
 * This composes the enquiry into a WhatsApp message and opens the chat. It
 * works with no backend and lands where this studio already takes bookings.
 * To switch to email later, replace handleSubmit with a POST to an API route.
 */
export default function ContactForm() {
  const [values, setValues] = useState({
    name: '',
    phone: '',
    interest: '' as string,
    message: '',
  })
  const [errors, setErrors] = useState<Errors>({})

  const set = (k: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    setErrors((s) => ({ ...s, [k]: undefined }))
  }

  const validate = (): boolean => {
    const next: Errors = {}
    if (!values.name.trim()) next.name = 'Please enter your name.'
    // Indian mobile numbers: 10 digits, optionally +91 prefixed.
    const digits = values.phone.replace(/\D/g, '')
    if (!digits) next.phone = 'Please enter a phone number.'
    else if (digits.length < 10) next.phone = 'Please enter a valid 10-digit phone number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const lines = [
      `Hello Surbhi Makeup Studio, I'd like to enquire.`,
      ``,
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
      values.interest ? `Interested in: ${values.interest}` : '',
      values.message.trim() ? `Message: ${values.message.trim()}` : '',
    ].filter(Boolean)

    window.open(
      `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`,
      '_blank',
      'noopener',
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.formTitle}>Send us a message</h2>

      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Your name <span aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={values.name}
          onChange={set('name')}
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className={styles.error} role="alert">{errors.name}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="phone" className={styles.label}>
          Phone number <span aria-hidden="true">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          value={values.phone}
          onChange={set('phone')}
          className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className={styles.error} role="alert">{errors.phone}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="interest" className={styles.label}>I&apos;m interested in</label>
        <select
          id="interest"
          name="interest"
          value={values.interest}
          onChange={set('interest')}
          className={styles.input}
        >
          <option value="">Select an option</option>
          {INTERESTS.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>Your message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={values.message}
          onChange={set('message')}
          className={`${styles.input} ${styles.textarea}`}
        />
      </div>

      <button type="submit" className="btn btn--dark">Send Enquiry</button>
      <p className={styles.hint}>
        Opens WhatsApp with your details filled in, so you can send in one tap.
      </p>
    </form>
  )
}
