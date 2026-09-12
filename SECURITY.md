# Security Policy

## Overview

Security is a priority for **KshemOS**. As a platform intended to support public safety and emergency-response workflows, we take vulnerabilities, data protection, and responsible disclosure seriously.

We appreciate security researchers, developers, and community members who help identify and responsibly report security issues.

## Supported Versions

Security fixes are generally provided for the latest actively maintained version of KshemOS.

| Version               | Supported  |
| --------------------- | ---------- |
| Latest release        | ✅          |
| Older releases        | ⚠️ Limited |
| Unmaintained releases | ❌          |

For the most accurate information, refer to the project's latest release and repository documentation.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a potential security vulnerability, report it privately to the KshemOS maintainers.

Your report should include:

* A clear description of the vulnerability
* Steps required to reproduce the issue
* The affected component or feature
* The potential security impact
* Proof-of-concept information, when appropriate
* Suggested mitigation or remediation, if known

Please avoid including real users' personal information or sensitive data in your report.

## What to Report

Examples of security issues include:

* Authentication or authorization vulnerabilities
* Unauthorized access to protected resources
* Data exposure or privacy vulnerabilities
* Injection vulnerabilities
* Cross-site scripting (XSS)
* Cross-site request forgery (CSRF)
* Insecure API endpoints
* Server-side security vulnerabilities
* Sensitive information exposure
* Broken access controls
* Dependency vulnerabilities
* Improper handling of emergency or incident-related data

## Responsible Disclosure

We ask security researchers to:

1. Avoid accessing, modifying, or deleting data that does not belong to them.
2. Avoid disrupting services or degrading system availability.
3. Avoid conducting denial-of-service attacks.
4. Avoid social engineering, phishing, or attacks against project contributors.
5. Avoid publicly disclosing a vulnerability before the maintainers have had a reasonable opportunity to address it.
6. Use test accounts and non-sensitive data whenever possible.

## Response Process

After receiving a vulnerability report, maintainers will make reasonable efforts to:

1. Acknowledge receipt of the report.
2. Investigate and validate the reported issue.
3. Assess its severity and potential impact.
4. Develop and deploy an appropriate fix.
5. Communicate relevant updates to the reporter when appropriate.
6. Credit the reporter if they wish to be publicly acknowledged.

Response times may vary depending on the severity and complexity of the issue.

## Security Best Practices for Contributors

Contributors should:

* Never commit passwords, API keys, tokens, or other secrets.
* Use environment variables for sensitive configuration.
* Avoid storing personal or sensitive information unnecessarily.
* Validate and sanitize untrusted input.
* Follow secure authentication and authorization practices.
* Keep dependencies up to date.
* Review third-party packages before introducing them.
* Use HTTPS for network communication.
* Follow the principle of least privilege.
* Avoid logging sensitive information.

## Sensitive Data

KshemOS may interact with information related to incidents, locations, users, or emergency workflows.

Contributors must not:

* Commit real personal data to the repository.
* Include real emergency records in test fixtures.
* Publish private user information in issues or pull requests.
* Share credentials or access tokens.
* Store unnecessary sensitive information in logs.

Use synthetic or anonymized data for development and testing.

## Dependency Security

Dependencies should be regularly reviewed and updated.

Known vulnerable dependencies should be assessed and updated or replaced when practical.

Automated dependency-security tools may be used to identify known vulnerabilities.

## Security Updates

Security-related updates may be released as patches, minor releases, or emergency releases depending on severity.

Users are encouraged to keep KshemOS deployments and dependencies up to date.

## Contact

For private vulnerability reports, contact the **KshemOS project maintainers** through the security contact or private security-reporting mechanism configured for the repository.

If a dedicated security email is added later, replace this section with that address.

## Disclaimer

KshemOS is provided according to the terms of its project license. Security features and practices m
