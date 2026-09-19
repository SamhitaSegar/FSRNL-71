import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import AuthField from '../components/AuthField.jsx'
import { signupUser } from '../api/auth.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setServerError('')
  }

  const validate = () => {
    const next = {}
    if (!form.username.trim()) next.username = 'Username is required.'
    else if (form.username.trim().length < 3) next.username = 'Use at least 3 characters.'

    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email address.'

    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 6) next.password = 'Use at least 6 characters.'

    if (!form.confirm) next.confirm = 'Please confirm your password.'
    else if (form.confirm !== form.password) next.confirm = 'Passwords do not match.'

    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    setServerError('')
    try {
      // Backend wiring: this hits POST {VITE_API_URL}/auth/register
      await signupUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      navigate('/login')
    } catch (err) {
      setServerError(err.message || 'Sign up failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join Foodie and start ordering in minutes.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <AuthField
          id="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          autoComplete="username"
          placeholder="foodlover"
        />

        <AuthField
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          placeholder="you@example.com"
        />

        <AuthField
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
          placeholder="At least 6 characters"
        />

        <AuthField
          id="confirm"
          label="Confirm Password"
          type="password"
          value={form.confirm}
          onChange={handleChange}
          error={errors.confirm}
          autoComplete="new-password"
          placeholder="Re-enter your password"
        />

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-muted dark:text-white/60">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
