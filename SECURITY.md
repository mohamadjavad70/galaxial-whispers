# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Q-Metaram, **do not open a public issue**. Instead, please email the maintainers directly with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

We will investigate promptly and coordinate a fix.

## Security Best Practices

### 1. Environment Variables
- **NEVER commit `.env` files** to the repository.
- Always use `.env.local` for local development.
- Public keys (like Stripe `pk_test_*`) are safe in `.env.example`, but **NEVER include secret keys** (e.g., `sk_*`, `WEBHOOK_SECRET`).
- Backend-only secrets (webhooks, API keys) must reside on the server only.

### 2. API Keys & Tokens
- Rotate keys immediately if exposed.
- Use separate keys for development, staging, and production.
- Store keys in a secure credential manager (e.g., 1Password, HashiCorp Vault).

### 3. Payment Integration (Stripe)
- Frontend: only use public key (`VITE_STRIPE_PUBLIC_KEY`)
- Backend: store `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` server-side
- Always verify webhook signatures before processing

### 4. Git History
- Use `git-secrets` or similar to prevent accidental secret commits
- Regularly audit git history: `git log --all --oneline | grep -i secret`
- If a secret is leaked, rotate immediately and contact Stripe/provider support

### 5. Dependency Security
- Run `npm audit` regularly and fix vulnerabilities
- Use `npm ci` in CI/CD instead of `npm install` for reproducibility
- Keep dependencies up to date: `npm update`

### 6. CORS & CSP
- Define strict CORS policies in backend
- Use Content Security Policy headers to prevent XSS

### 7. Authentication & Authorization
- Use JWT tokens with short expiration
- Store tokens securely (httpOnly cookies preferred over localStorage)
- Validate user permissions on backend for all sensitive operations

### 8. Data Privacy
- Don't log sensitive user data (emails, tokens, payment info)
- Implement proper rate limiting to prevent brute force attacks
- Use HTTPS only in production

## Compliance Checklist
- [ ] `.env` is in `.gitignore`
- [ ] No secrets in `package.json` or other config files
- [ ] `npm audit` passes
- [ ] `.env.example` contains only safe placeholders
- [ ] Backend secrets are documented but never committed
- [ ] CI/CD secrets are stored in GitHub Secrets, not the repo

## Questions?
For security concerns, contact maintainers directly.
