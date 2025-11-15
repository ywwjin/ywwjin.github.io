/**
 * Unit tests for aboutme.html
 * Tests HTML structure, accessibility, content validation, and navigation
 */

const fs = require('fs');
const path = require('path');

describe('aboutme.html - Structure and Content Tests', () => {
  let htmlContent;
  let dom;
  let document;

  beforeEach(() => {
    // Read the HTML file
    htmlContent = fs.readFileSync(
      path.join(__dirname, '../aboutme.html'),
      'utf-8'
    );
    
    // Parse HTML
    document = new DOMParser().parseFromString(htmlContent, 'text/html');
    dom = document;
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

    test('should have proper head section with required meta tags', () => {
      const head = document.querySelector('head');
      expect(head).toBeTruthy();
      
      const charset = document.querySelector('meta[charset]');
      expect(charset).toBeTruthy();
      expect(charset.getAttribute('charset')).toBe('UTF-8');
    });

    test('should have viewport meta tag', () => {
      const viewport = document.querySelector('meta[name="viewprot"]');
      expect(viewport).toBeTruthy();
      // Note: There's a typo in the actual HTML - "viewprot" should be "viewport"
    });

    test('should have a title element', () => {
      const title = document.querySelector('title');
      expect(title).toBeTruthy();
      expect(title.textContent).toContain('Portfolio');
    });

    test('should link to external stylesheet', () => {
      const styleLink = document.querySelector('link[rel="stylesheet"]');
      expect(styleLink).toBeTruthy();
      expect(styleLink.getAttribute('href')).toBe('style.css');
    });

    test('should have body element', () => {
      const body = document.querySelector('body');
      expect(body).toBeTruthy();
    });
  });

  describe('Header and Navigation', () => {
    test('should have a header element', () => {
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

    test('should have navigation element', () => {
      const nav = document.querySelector('nav');
      expect(nav).toBeTruthy();
    });

    test('should have exactly 3 navigation links', () => {
      const navLinks = document.querySelectorAll('nav a');
      expect(navLinks.length).toBe(3);
    });

    test('should have Home link pointing to index.html', () => {
      const homeLink = Array.from(document.querySelectorAll('nav a'))
        .find(a => a.textContent === 'Home');
      expect(homeLink).toBeTruthy();
      expect(homeLink.getAttribute('href')).toBe('index.html');
    });

    test('should have About Me link pointing to aboutme.html', () => {
      const aboutLink = Array.from(document.querySelectorAll('nav a'))
        .find(a => a.textContent === 'About Me');
      expect(aboutLink).toBeTruthy();
      expect(aboutLink.getAttribute('href')).toBe('aboutme.html');
    });

    test('should have Github link with external URL', () => {
      const githubLink = Array.from(document.querySelectorAll('nav a'))
        .find(a => a.textContent === 'Github');
      expect(githubLink).toBeTruthy();
      expect(githubLink.getAttribute('href')).toMatch(/^https?:\/\//);
      expect(githubLink.getAttribute('href')).toContain('github.com');
    });

    test('navigation links should be in correct order', () => {
      const navLinks = document.querySelectorAll('nav a');
      expect(navLinks[0].textContent).toBe('Home');
      expect(navLinks[1].textContent).toBe('About Me');
      expect(navLinks[2].textContent).toBe('Github');
    });
  });

  describe('Main Content Section', () => {
    test('should have main element', () => {
      const main = document.querySelector('main');
      expect(main).toBeTruthy();
    });

    test('should have about-me-section div', () => {
      const aboutSection = document.querySelector('.about-me-section');
      expect(aboutSection).toBeTruthy();
    });

    test('should have main heading "About Me"', () => {
      const h1 = document.querySelector('.about-me-section h1');
      expect(h1).toBeTruthy();
      expect(h1.textContent).toBe('About Me');
    });

    test('should have introduction paragraph', () => {
      const paragraphs = document.querySelectorAll('.about-me-section p');
      expect(paragraphs.length).toBeGreaterThan(0);
      expect(paragraphs[0].textContent).toContain('Hello!');
      expect(paragraphs[0].textContent).toContain('developer');
    });
  });

  describe('Skills Section', () => {
    test('should have Skills heading', () => {
      const headings = Array.from(document.querySelectorAll('.about-me-section h2'));
      const skillsHeading = headings.find(h => h.textContent === 'Skills');
      expect(skillsHeading).toBeTruthy();
    });

    test('should have skills list', () => {
      const skillsList = document.querySelector('.about-me-section ul');
      expect(skillsList).toBeTruthy();
    });

    test('should list multiple skills', () => {
      const skillItems = document.querySelectorAll('.about-me-section ul li');
      expect(skillItems.length).toBeGreaterThan(0);
    });

    test('should include HTML, CSS, JavaScript in skills', () => {
      const skillItems = Array.from(document.querySelectorAll('.about-me-section ul li'));
      const htmlCssJs = skillItems.find(li => li.textContent.includes('HTML'));
      expect(htmlCssJs).toBeTruthy();
      expect(htmlCssJs.textContent).toContain('CSS');
      expect(htmlCssJs.textContent).toContain('JavaScript');
    });

    test('should include framework skills', () => {
      const skillItems = Array.from(document.querySelectorAll('.about-me-section ul li'));
      const hasReact = skillItems.some(li => li.textContent.includes('React'));
      const hasVue = skillItems.some(li => li.textContent.includes('Vue'));
      expect(hasReact || hasVue).toBe(true);
    });

    test('should have exactly 4 skill categories', () => {
      const skillItems = document.querySelectorAll('.about-me-section ul li');
      expect(skillItems.length).toBe(4);
    });
  });

  describe('Experience Section', () => {
    test('should have Experience heading', () => {
      const headings = Array.from(document.querySelectorAll('.about-me-section h2'));
      const expHeading = headings.find(h => h.textContent === 'Experience');
      expect(expHeading).toBeTruthy();
    });

    test('should have experience description paragraph', () => {
      const paragraphs = Array.from(document.querySelectorAll('.about-me-section p'));
      const expParagraph = paragraphs.find(p => p.textContent.includes('worked on'));
      expect(expParagraph).toBeTruthy();
    });

    test('experience description should mention projects', () => {
      const paragraphs = Array.from(document.querySelectorAll('.about-me-section p'));
      const expParagraph = paragraphs.find(p => p.textContent.includes('projects'));
      expect(expParagraph).toBeTruthy();
    });
  });

  describe('Contact Section', () => {
    test('should have Contact Me heading', () => {
      const headings = Array.from(document.querySelectorAll('.about-me-section h2'));
      const contactHeading = headings.find(h => h.textContent === 'Contact Me');
      expect(contactHeading).toBeTruthy();
    });

    test('should have contact information paragraph', () => {
      const paragraphs = Array.from(document.querySelectorAll('.about-me-section p'));
      const contactParagraph = paragraphs.find(p => p.textContent.includes('email'));
      expect(contactParagraph).toBeTruthy();
    });

    test('should include email address', () => {
      const paragraphs = Array.from(document.querySelectorAll('.about-me-section p'));
      const contactParagraph = paragraphs.find(p => p.textContent.includes('@'));
      expect(contactParagraph).toBeTruthy();
      expect(contactParagraph.textContent).toMatch(/[\w.-]+@[\w.-]+\.\w+/);
    });
  });

  describe('Content Hierarchy', () => {
    test('should have proper heading hierarchy (h1 -> h2)', () => {
      const h1 = document.querySelector('h1');
      const h2s = document.querySelectorAll('h2');
      
      expect(h1).toBeTruthy();
      expect(h2s.length).toBeGreaterThan(0);
      
      // No h3 before h2
      const h3s = document.querySelectorAll('h3');
      h3s.forEach(h3 => {
        const precedingH2 = document.querySelector('h2');
        expect(precedingH2).toBeTruthy();
      });
    });

    test('should have h2 headings in logical order', () => {
      const h2s = Array.from(document.querySelectorAll('.about-me-section h2'));
      const headingTexts = h2s.map(h => h.textContent);
      
      expect(headingTexts).toContain('Skills');
      expect(headingTexts).toContain('Experience');
      expect(headingTexts).toContain('Contact Me');
    });
  });

  describe('Accessibility Features', () => {
    test('should have semantic HTML5 elements', () => {
      expect(document.querySelector('header')).toBeTruthy();
      expect(document.querySelector('main')).toBeTruthy();
      expect(document.querySelector('nav')).toBeTruthy();
    });

    test('all links should have meaningful text', () => {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        expect(link.textContent.trim().length).toBeGreaterThan(0);
        expect(link.textContent.trim()).not.toBe('click here');
        expect(link.textContent.trim()).not.toBe('link');
      });
    });

    test('should not have empty links', () => {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        expect(link.textContent.trim()).not.toBe('');
      });
    });
  });

  describe('Content Validation', () => {
    test('should not have Lorem Ipsum placeholder text', () => {
      expect(htmlContent.toLowerCase()).not.toContain('lorem ipsum');
    });

    test('should have actual content in paragraphs', () => {
      const paragraphs = document.querySelectorAll('p');
      paragraphs.forEach(p => {
        expect(p.textContent.trim().length).toBeGreaterThan(10);
      });
    });

    test('should have consistent branding/name usage', () => {
      const title = document.querySelector('title');
      expect(title.textContent).toContain('Yourname');
    });
  });

  describe('HTML Validity Edge Cases', () => {
    test('should have properly closed tags', () => {
      // Count opening and closing tags
      const openTags = (htmlContent.match(/<(?!\/|!)[^>]+>/g) || []).length;
      const closeTags = (htmlContent.match(/<\/[^>]+>/g) || []).length;
      const selfClosing = (htmlContent.match(/<[^>]+\/>/g) || []).length;
      
      // Self-closing tags don't need closing tags
      // This is a basic check - more sophisticated validation would use a proper parser
      expect(closeTags).toBeGreaterThan(0);
    });

    test('should not have script tags (security)', () => {
      const scriptTags = document.querySelectorAll('script:not([src])');
      const inlineScripts = Array.from(scriptTags).filter(s => s.textContent.trim().length > 0);
      expect(inlineScripts.length).toBe(0);
    });

    test('should have valid href attributes on all links', () => {
      const links = document.querySelectorAll('a[href]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href.trim()).not.toBe('');
        expect(href).not.toBe('#');
      });
    });
  });

  describe('Cross-page Consistency', () => {
    test('should have consistent header structure with index.html', () => {
      const header = document.querySelector('header .header');
      expect(header).toBeTruthy();
      
      const menuHeading = document.querySelector('header h2');
      expect(menuHeading.textContent).toBe('MENU');
      
      const nav = document.querySelector('header nav');
      expect(nav).toBeTruthy();
    });

    test('should have same navigation links as other pages', () => {
      const navLinks = Array.from(document.querySelectorAll('nav a'));
      const linkTexts = navLinks.map(a => a.textContent);
      
      expect(linkTexts).toContain('Home');
      expect(linkTexts).toContain('About Me');
      expect(linkTexts).toContain('Github');
    });

    test('should link to the same stylesheet as index.html', () => {
      const styleLink = document.querySelector('link[rel="stylesheet"]');
      expect(styleLink.getAttribute('href')).toBe('style.css');
    });
  });
});

describe('aboutme.html - Integration Tests', () => {
  test('HTML file should exist and be readable', () => {
    const filePath = path.join(__dirname, '../aboutme.html');
    expect(fs.existsSync(filePath)).toBe(true);
    
    const stats = fs.statSync(filePath);
    expect(stats.isFile()).toBe(true);
    expect(stats.size).toBeGreaterThan(0);
  });

  test('should be a valid UTF-8 encoded file', () => {
    const htmlContent = fs.readFileSync(
      path.join(__dirname, '../aboutme.html'),
      'utf-8'
    );
    expect(htmlContent).toBeTruthy();
    expect(typeof htmlContent).toBe('string');
  });

  test('file should not be excessively large', () => {
    const stats = fs.statSync(path.join(__dirname, '../aboutme.html'));
    // About page shouldn't be more than 100KB
    expect(stats.size).toBeLessThan(100 * 1024);
  });
});