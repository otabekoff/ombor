# Ombor Contributing Guide

## Qo'shish bo'yicha yo'riqnoma | Contributing Guidelines

Ushbu loyihaga hissa qo'shganingiz uchun rahmat! | Thank you for contributing to this project!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/otabekoff/Ombor.git
   cd Ombor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

## Code Quality

Before submitting a PR, please ensure:

- ✅ **Type check passes**: `npm run type-check`
- ✅ **Linting passes**: `npm run lint`
- ✅ **Formatting is correct**: `npm run format`
- ✅ **Build succeeds**: `npm run build`

## Coding Standards

- Use **TypeScript** for all new code
- Follow the existing code style (2 spaces, single quotes)
- Add JSDoc comments for public APIs
- Keep Uzbek localization for user-facing messages

## Commit Messages

We follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Testing

Currently, we don't have automated tests. Adding tests would be a great contribution!

## Questions?

Open an issue or discussion on GitHub.
