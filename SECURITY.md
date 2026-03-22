# Security Policy

## Reporting a Vulnerability

**Please do NOT open a public issue for a security vulnerability.** Instead, please report it confidentially.

### How to Report

1. **Email**: security@neuroscan-ai.example.com
2. **Specify**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Affected version(s)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Assessment**: Within 7 days
- **Fix/Patch**: Within timeline based on severity
- **Disclosure**: Coordinated disclosure after patch

## Supported Versions

| Version | Status | Last Updated |
|---------|--------|--------------|
| 1.0.x   | Active | Current      |
| < 1.0   | EOL    | N/A          |

## Security Guidelines

### Client-Side
- ✅ Do not store sensitive data in localStorage without encryption
- ✅ Use HTTPS for all API communications
- ✅ Validate user input on the client side
- ✅ Implement CORS properly

### API Integration
- ✅ All API calls use HTTPS
- ✅ Bearer tokens stored securely (httpOnly cookies preferred)
- ✅ Token refresh implemented with proper expiration
- ✅ CSRF protection should be implemented on backend

### Dependencies
- All dependencies are vetted and regularly updated
- Security audits run on every build
- Vulnerable packages are patched immediately

### Authentication
- Passwords are never localStorage
- Sessions use secure tokens
- Role-based access control enforced
- Token expiration: 1 hour (configurable)
- Refresh token expiration: 7 days (configurable)

## Best Practices for Users

1. **Keep Updated**: Always use the latest version
2. **Secure Your Backend**: Implement proper authentication/authorization
3. **Use HTTPS**: Always access over encrypted connections
4. **Validate Input**: The frontend validates input, but backend must also validate
5. **API Security**: Secure your API endpoints with proper authentication

## GDPR & Privacy

- No user data is sent externally except to your API
- All data processing happens in your backend
- Comply with local regulations for patient data handling
- Patient records are protected by role-based access control

## Compliance

- HIPAA compliance depends on proper backend implementation
- Audit logging should be implemented in the backend
- Data retention policies should be defined per your requirements

---

## Acknowledgments

Thanks to the security community for responsibly disclosing vulnerabilities.
