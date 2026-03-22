# Contributing to NeuroScan AI

First off, thank you for considering a contribution to NeuroScan AI! It's people like you that make this such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Describe the expected behavior**
* **Include screenshots or animated GIFs** if possible
* **Include your environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description** of the suggested enhancement
* **Provide specific examples to demonstrate the steps**
* **Explain the current behavior** and the expected behavior
* **Explain why this enhancement would be useful**

### Pull Requests

* Follow the TypeScript and React coding standards
* Include appropriate test coverage
* Update documentation accordingly
* End all files with a newline
* Avoid platform-specific code

## Development Setup

1. Fork the repository
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/neuroscan-ai.git
   cd neuroscan-ai
   ```
3. Create a virtual environment and install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

## Making Changes

1. **Keep commits atomic** - One feature or fix per commit
2. **Write descriptive commit messages**:
   ```
   feat: add patient search functionality
   fix: resolve modal scroll issue
   docs: update API documentation
   style: format code with Prettier
   refactor: simplify patient filtering logic
   test: add tests for authentication
   ```
3. **Update documentation** as you make changes
4. **Test your changes** thoroughly

### Commit Message Format

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

**Type:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process, dependencies, etc.

**Scope:**
- `auth`: Authentication related
- `dashboard`: Dashboard pages
- `api`: API client/services
- `ui`: UI components
- `pages`: Page components

### Code Style

- Use TypeScript for all new code
- Follow existing code conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and small

## Testing

Before submitting a pull request:

```bash
# Build the project
npm run build

# The app should build without errors
```

## Submitting a Pull Request

1. Push your branch to your fork
2. Create a pull request with a clear title and description
3. Link any related issues (e.g., "Fixes #123")
4. Ensure CI/CD checks pass
5. Request review from maintainers
6. Address any feedback or requested changes

## Questions?

Feel free to open a GitHub issue with the `question` label.

## Attribution

This Contributing guide is adapted from the Atom Editor Contributing Guide.
