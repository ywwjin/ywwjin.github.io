# Test Suite Documentation

This directory contains comprehensive unit and integration tests for the portfolio website.

## Test Files

### aboutme.html.test.js
Tests for the new About Me page including:
- HTML structure validation
- Navigation consistency
- Content sections (Skills, Experience, Contact)
- Accessibility compliance
- Cross-page consistency

### index.html.test.js
Tests for the homepage including:
- Navigation updates (Home link, Github link changes)
- Card layout structure
- Footer content
- Script integration
- Regression tests for changes

### script.js.test.js
Tests for JavaScript functionality including:
- Card random positioning algorithm
- Drag and drop functionality (mouse + touch)
- Event listener registration
- State management
- Performance optimizations
- Security validations

### html-validation.test.js
Comprehensive HTML validation including:
- W3C compliance checking
- Cross-file consistency
- Accessibility standards
- Security best practices
- Known issues documentation

## Running Tests

```bash
# All tests
npm test

# Specific file
npm test tests/aboutme.html.test.js

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

## Test Structure

Each test file follows this structure:
1. **Setup**: beforeEach/beforeAll hooks
2. **Describe blocks**: Group related tests
3. **Test cases**: Individual assertions
4. **Teardown**: afterEach/afterAll hooks

## Writing New Tests

Follow these guidelines:
1. Use descriptive test names
2. Test one thing per test
3. Include edge cases
4. Mock external dependencies
5. Clean up after tests

## Test Coverage Goals

- Statements: > 70%
- Branches: > 70%
- Functions: > 70%
- Lines: > 70%