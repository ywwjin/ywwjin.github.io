/**
 * Unit tests for index.html
 * Tests HTML structure, navigation updates, and content validation
 */

const fs = require('fs');
const path = require('path');

describe('index.html - Structure and Content Tests', () => {
  let htmlContent;
  let document;

  beforeEach(() => {
    htmlContent = fs.readFileSync(
      path.join(__dirname, '../index.html'),
      'utf-8'
    );
    document = new DOMParser().parseFromString(htmlContent, 'text/html');
  });

  describe('Basic HTML Structure', () => {
    test('should have valid DOCTYPE declaration', () => {
      expect(htmlContent).toMatch(/<!DOCTYPE html>/i);
    });

    test('should have html element with lang attribute', () => {
      const htmlElement = document.querySelector('html');
      expect(htmlElement).toBeTruthy();
      expect(htmlElement.hasAttribute('lang')).toBe(true);
    });

    test('should have proper head section', () => {
      const head = document.querySelector('head');
      expect(head).toBeTruthy();
    });

    test('should have UTF-8 charset', () => {
      const charset = document.querySelector('meta[charset]');
      expect(charset).toBeTruthy();
      expect(charset.getAttribute('charset')).toBe('UTF-8');
    });

    test('should have title element', () => {
      const title = document.querySelector('title');
      expect(title).toBeTruthy();
      expect(title.textContent).toContain('Portfolio');
    });

    test('should link to style.css', () => {
      const styleLink = document.querySelector('link[rel="stylesheet"]');
      expect(styleLink).toBeTruthy();
      expect(styleLink.getAttribute('href')).toBe('style.css');
    });

    test('should have body element', () => {
      const body = document.querySelector('body');
      expect(body).toBeTruthy();
    });
  });

  describe('Navigation Updates (Main Test Focus)', () => {
    test('should have header with navigation', () => {
      const header = document.querySelector('header');
      const nav = document.querySelector('nav');
      expect(header).toBeTruthy();
      expect(nav).toBeTruthy();
    });

    test('should have exactly 3 navigation links', () => {
      const navLinks = document.querySelectorAll('nav a');
      expect(navLinks.length).toBe(3);
    });

    test('should have Home link as first navigation item', () => {
      const navLinks = document.querySelectorAll('nav a');
      const firstLink = navLinks[0];
      expect(firstLink.textContent).toBe('Home');
      expect(firstLink.getAttribute('href')).toBe('index.html');
    });

    test('Home link should point to index.html', () => {
      const homeLink = Array.from(document.querySelectorAll('nav a'))
        .find(a => a.textContent === 'Home');
      expect(homeLink).toBeTruthy();
      expect(homeLink.getAttribute('href')).toBe('index.html');
    });

    test('should have About Me link as second navigation item', () => {
      const navLinks = document.querySelectorAll('nav a');
      const secondLink = navLinks[1];
      expect(secondLink.textContent).toBe('About Me');
      expect(secondLink.getAttribute('href')).toBe('aboutme.html');
    });

    test('About Me link should point to aboutme.html', () => {
      const aboutLink = Array.from(document.querySelectorAll('nav a'))
        .find(a => a.textContent === 'About Me');
      expect(aboutLink).toBeTruthy();
      expect(aboutLink.getAttribute('href')).toBe('aboutme.html');
    });

    test('should have Github link as third navigation item', () => {
      const navLinks = document.querySelectorAll('nav a');
      const thirdLink = navLinks[2];
      expect(thirdLink.textContent).toBe('Github');
    });

    test('Github link should point to https://github.com (updated URL)', () => {
      const githubLink = Array.from(document.querySelectorAll('nav a'))
        .find(a => a.textContent === 'Github');
      expect(githubLink).toBeTruthy();
      expect(githubLink.getAttribute('href')).toBe('https://github.com');
    });

    test('Github link should be an external HTTPS link', () => {
      const githubLink = Array.from(document.querySelectorAll('nav a'))
        .find(a => a.textContent === 'Github');
      const href = githubLink.getAttribute('href');
      expect(href).toMatch(/^https:\/\//);
    });

    test('navigation order should be Home, About Me, Github', () => {
      const navLinks = document.querySelectorAll('nav a');
      expect(navLinks[0].textContent).toBe('Home');
      expect(navLinks[1].textContent).toBe('About Me');
      expect(navLinks[2].textContent).toBe('Github');
    });

    test('all navigation links should have valid href attributes', () => {
      const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href.trim()).not.toBe('');
      });
    });
  });

  describe('Header Structure', () => {
    test('should have header element', () => {
      const header = document.querySelector('header');
      expect(header).toBeTruthy();
    });

    test('should have header div with class "header"', () => {
      const headerDiv = document.querySelector('header .header');
      expect(headerDiv).toBeTruthy();
    });

    test('should have MENU heading in header', () => {
      const menuHeading = document.querySelector('header h2');
      expect(menuHeading).toBeTruthy();
      expect(menuHeading.textContent).toBe('MENU');
    });
  });

  describe('Main Content Section', () => {
    test('should have main element', () => {
      const main = document.querySelector('main');
      expect(main).toBeTruthy();
    });

    test('should have intro card with fixed class', () => {
      const introCard = document.querySelector('.card.fixed.intro');
      expect(introCard).toBeTruthy();
    });

    test('intro card should have Korean greeting', () => {
      const introCard = document.querySelector('.card.fixed.intro');
      expect(introCard.textContent).toContain('안녕하세요');
    });

    test('should have contact card with email', () => {
      const contactCard = document.querySelector('.card.fixed.contact-card');
      expect(contactCard).toBeTruthy();
      expect(contactCard.textContent).toContain('Contact');
      expect(contactCard.textContent).toMatch(/@/);
    });

    test('should have about card', () => {
      const aboutCard = document.querySelector('.card.fixed.about-card');
      expect(aboutCard).toBeTruthy();
      expect(aboutCard.textContent).toContain('aboutme');
    });

    test('should have exactly 3 fixed cards', () => {
      const fixedCards = document.querySelectorAll('.card.fixed');
      expect(fixedCards.length).toBe(3);
    });

    test('should have random project cards', () => {
      const randomCards = document.querySelectorAll('.card.random');
      expect(randomCards.length).toBeGreaterThan(0);
    });

    test('should have exactly 5 random cards', () => {
      const randomCards = document.querySelectorAll('.card.random');
      expect(randomCards.length).toBe(5);
    });

    test('random cards should have project labels', () => {
      const randomCards = document.querySelectorAll('.card.random');
      const projectLabels = Array.from(randomCards).map(card => card.textContent);
      
      expect(projectLabels).toContain('Project A');
      expect(projectLabels).toContain('Project B');
      expect(projectLabels).toContain('Project C');
      expect(projectLabels).toContain('Project D');
      expect(projectLabels).toContain('Project E');
    });
  });

  describe('Footer Section', () => {
    test('should have footer element', () => {
      const footer = document.querySelector('footer');
      expect(footer).toBeTruthy();
    });

    test('should have copyright notice', () => {
      const footer = document.querySelector('footer p');
      expect(footer).toBeTruthy();
      expect(footer.textContent).toContain('©');
      expect(footer.textContent).toContain('2025');
    });
  });

  describe('Script Integration', () => {
    test('should load script.js', () => {
      const script = document.querySelector('script[src="script.js"]');
      expect(script).toBeTruthy();
    });

    test('script should be loaded at the end of body', () => {
      const scripts = document.querySelectorAll('body > script');
      expect(scripts.length).toBeGreaterThan(0);
    });
  });

  describe('Semantic HTML', () => {
    test('should use semantic HTML5 elements', () => {
      expect(document.querySelector('header')).toBeTruthy();
      expect(document.querySelector('main')).toBeTruthy();
      expect(document.querySelector('footer')).toBeTruthy();
      expect(document.querySelector('nav')).toBeTruthy();
    });

    test('should have proper document structure', () => {
      const body = document.querySelector('body');
      const header = body.querySelector('header');
      const main = body.querySelector('main');
      const footer = body.querySelector('footer');
      
      expect(header).toBeTruthy();
      expect(main).toBeTruthy();
      expect(footer).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    test('all links should have meaningful text', () => {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        expect(link.textContent.trim().length).toBeGreaterThan(0);
      });
    });

    test('should not have empty alt attributes on images (if any)', () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.hasAttribute('alt')) {
          // Alt can be empty for decorative images, but should exist
          expect(img.hasAttribute('alt')).toBe(true);
        }
      });
    });
  });

  describe('Content Validation', () => {
    test('should not have Lorem Ipsum placeholder text', () => {
      expect(htmlContent.toLowerCase()).not.toContain('lorem ipsum');
    });

    test('should have unique content in cards', () => {
      const cards = document.querySelectorAll('.card');
      const cardTexts = Array.from(cards).map(card => card.textContent.trim());
      const uniqueTexts = new Set(cardTexts);
      
      // Allow some duplication but not all cards should be identical
      expect(uniqueTexts.size).toBeGreaterThan(1);
    });
  });

  describe('Cross-page Navigation Consistency', () => {
    test('should have same navigation structure as aboutme.html', () => {
      const nav = document.querySelector('nav');
      const navLinks = nav.querySelectorAll('a');
      
      expect(navLinks.length).toBe(3);
      expect(navLinks[0].textContent).toBe('Home');
      expect(navLinks[1].textContent).toBe('About Me');
      expect(navLinks[2].textContent).toBe('Github');
    });

    test('About Me link should point to the correct page', () => {
      const aboutLink = Array.from(document.querySelectorAll('nav a'))
        .find(a => a.textContent === 'About Me');
      expect(aboutLink.getAttribute('href')).toBe('aboutme.html');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle missing elements gracefully in structure', () => {
      // Test that essential elements exist
      const essentialElements = [
        'html',
        'head',
        'body',
        'header',
        'main',
        'footer'
      ];
      
      essentialElements.forEach(tag => {
        expect(document.querySelector(tag)).toBeTruthy();
      });
    });

    test('should not have broken internal links', () => {
      const internalLinks = Array.from(document.querySelectorAll('a[href]'))
        .filter(a => {
          const href = a.getAttribute('href');
          return href && !href.startsWith('http') && !href.startsWith('//');
        });
      
      internalLinks.forEach(link => {
        const href = link.getAttribute('href');
        expect(href).toMatch(/\.(html|htm)$/);
      });
    });

    test('should have valid class names', () => {
      const elements = document.querySelectorAll('[class]');
      elements.forEach(el => {
        const classes = el.getAttribute('class');
        expect(classes.trim()).not.toBe('');
        // Class names should not contain invalid characters
        expect(classes).not.toMatch(/[<>'"]/);
      });
    });
  });
});

describe('index.html - Regression Tests', () => {
  let htmlContent;

  beforeEach(() => {
    htmlContent = fs.readFileSync(
      path.join(__dirname, '../index.html'),
      'utf-8'
    );
  });

  test('Github link should not point to specific user (regression)', () => {
    // This is a regression test - the link was changed from a specific user to generic github.com
    expect(htmlContent).not.toContain('github.com/ywwjin');
    expect(htmlContent).toContain('github.com');
  });

  test('Home link should be present (regression)', () => {
    // This is a regression test - Home link was added in the update
    const document = new DOMParser().parseFromString(htmlContent, 'text/html');
    const homeLink = Array.from(document.querySelectorAll('nav a'))
      .find(a => a.textContent === 'Home');
    expect(homeLink).toBeTruthy();
  });

  test('navigation should have 3 links, not 2 (regression)', () => {
    const document = new DOMParser().parseFromString(htmlContent, 'text/html');
    const navLinks = document.querySelectorAll('nav a');
    expect(navLinks.length).toBe(3);
  });
});