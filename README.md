# AI-Powered CRM

A modern CRM system with AI capabilities for managing contacts, deals, and workflows.

## Environment Setup

1. Clone the repository
2. Copy the environment variables template:
   ```bash
   cp .env.example .env
   ```
3. Fill in your environment variables in `.env`:
   - Firebase configuration
   - Google OAuth credentials
   - API keys

⚠️ **Important Security Notes**:
- Never commit `.env` files to version control
- Keep your API keys and secrets secure
- Rotate credentials regularly
- Use separate credentials for development and production

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Security Best Practices

1. Environment Variables:
   - Use `.env` for local development
   - Use secure secrets management in production
   - Never expose credentials in logs or error messages

2. API Keys:
   - Use environment-specific API keys
   - Implement proper key rotation
   - Set up proper access controls and rate limiting

3. Authentication:
   - Implement proper session management
   - Use secure authentication flows
   - Follow OAuth 2.0 best practices
