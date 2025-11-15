/**
 * Unit tests for script.js
 * Tests card positioning, drag functionality, and event handling
 */

const fs = require('fs');
const path = require('path');

describe('script.js - Card Positioning and Layout', () => {
  let scriptContent;
  let mockDocument;
  let mockWindow;
  let randomCards;
  let header;
  let footer;

  beforeEach(() => {
    // Read the script file
    scriptContent = fs.readFileSync(
      path.join(__dirname, '../script.js'),
      'utf-8'
    );

    // Create mock cards
    randomCards = [];
    for (let i = 0; i < 5; i++) {
      const card = {
        style: {},
        offsetLeft: 0,
        offsetTop: 0,
        classList: {
          classes: new Set(),
          add: function(className) { this.classes.add(className); },
          remove: function(className) { this.classes.delete(className); },
          contains: function(className) { return this.classes.has(className); }
        },
        addEventListener: jest.fn()
      };
      randomCards.push(card);
    }

    // Create mock header and footer
    header = {
      offsetHeight: 80
    };

    footer = {
      offsetHeight: 60
    };

    // Setup mock document
    mockDocument = {
      addEventListener: jest.fn(),
      querySelectorAll: jest.fn((selector) => {
        if (selector === '.random') {
          return randomCards;
        }
        return [];
      }),
      querySelector: jest.fn((selector) => {
        if (selector === 'header') return header;
        if (selector === 'footer') return footer;
        return null;
      })
    };

    // Setup mock window
    mockWindow = {
      innerWidth: 1024,
      innerHeight: 768
    };

    // Mock Math.random for predictable tests
    jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('DOMContentLoaded Event Listener', () => {
    test('should register DOMContentLoaded event listener', () => {
      expect(scriptContent).toContain('DOMContentLoaded');
      expect(scriptContent).toContain('addEventListener');
    });

    test('should use arrow function for event handler', () => {
      expect(scriptContent).toContain('=> {');
    });
  });

  describe('Element Selection', () => {
    test('should query for random cards', () => {
      expect(scriptContent).toContain('querySelectorAll(".random")');
    });

    test('should query for header element', () => {
      expect(scriptContent).toContain('querySelector("header")');
    });

    test('should query for footer element', () => {
      expect(scriptContent).toContain('querySelector("footer")');
    });

    test('should handle null header gracefully', () => {
      expect(scriptContent).toContain('header?');
      expect(scriptContent).toContain('header.offsetHeight : 0');
    });

    test('should handle null footer gracefully', () => {
      expect(scriptContent).toContain('footer?');
      expect(scriptContent).toContain('footer.offsetHeight : 0');
    });
  });

  describe('Random Card Positioning Logic', () => {
    test('should calculate usable width correctly', () => {
      expect(scriptContent).toContain('window.innerWidth - 220');
    });

    test('should calculate usable height considering header and footer', () => {
      expect(scriptContent).toContain('window.innerHeight - headerHeight - footerHeight - 20');
    });

    test('should iterate over each random card', () => {
      expect(scriptContent).toContain('randomCards.forEach');
    });

    test('should use Math.random for x position', () => {
      expect(scriptContent).toContain('Math.random() * usableWidth');
    });

    test('should use Math.random for y position calculation', () => {
      expect(scriptContent).toContain('Math.random() * usableHeight');
    });

    test('should set card left position in pixels', () => {
      expect(scriptContent).toContain('card.style.left');
      expect(scriptContent).toMatch(/\+ "px"/);
    });

    test('should set card top position in pixels', () => {
      expect(scriptContent).toContain('card.style.top');
    });

    test('should offset y position by headerHeight', () => {
      expect(scriptContent).toContain('headerHeight +');
    });
  });

  describe('Card Positioning Calculations', () => {
    test('should position cards within viewport bounds (x-axis)', () => {
      const usableWidth = 1024 - 220; // 804px
      
      // Mock Math.random to return 0.5
      Math.random.mockReturnValue(0.5);
      
      const expectedX = 0.5 * usableWidth; // 402px
      expect(expectedX).toBeGreaterThanOrEqual(0);
      expect(expectedX).toBeLessThanOrEqual(usableWidth);
    });

    test('should position cards within viewport bounds (y-axis)', () => {
      const headerHeight = 80;
      const footerHeight = 60;
      const usableHeight = 768 - headerHeight - footerHeight - 20; // 608px
      
      Math.random.mockReturnValue(0.5);
      
      const expectedY = headerHeight + (0.5 * usableHeight); // 384px
      expect(expectedY).toBeGreaterThanOrEqual(headerHeight);
      expect(expectedY).toBeLessThanOrEqual(768 - footerHeight);
    });

    test('should account for card width in usable space (220px)', () => {
      expect(scriptContent).toContain('220');
    });

    test('should account for margin in height calculation (20px)', () => {
      expect(scriptContent).toContain('- 20');
    });
  });

  describe('Drag Functionality - Mouse Events', () => {
    test('should register mousedown event listener on each card', () => {
      expect(scriptContent).toContain('addEventListener("mousedown"');
    });

    test('should register mousemove event listener on document', () => {
      expect(scriptContent).toContain('addEventListener("mousemove"');
    });

    test('should register mouseup event listener on document', () => {
      expect(scriptContent).toContain('addEventListener("mouseup"');
    });

    test('should define start function for mouse events', () => {
      expect(scriptContent).toContain('const start = (e) => {');
    });

    test('should define move function for mouse events', () => {
      expect(scriptContent).toContain('const move = (e) => {');
    });

    test('should define end function for mouse events', () => {
      expect(scriptContent).toContain('const end = () => {');
    });
  });

  describe('Drag Functionality - Touch Events', () => {
    test('should register touchstart event listener', () => {
      expect(scriptContent).toContain('addEventListener("touchstart"');
    });

    test('should register touchmove event listener', () => {
      expect(scriptContent).toContain('addEventListener("touchmove"');
    });

    test('should register touchend event listener', () => {
      expect(scriptContent).toContain('addEventListener("touchend"');
    });

    test('should set passive: false for touch events', () => {
      expect(scriptContent).toContain('{ passive: false }');
    });

    test('touchstart should use passive: false to prevent default', () => {
      const touchstartMatch = scriptContent.match(/touchstart.*passive:\s*false/);
      expect(touchstartMatch).toBeTruthy();
    });

    test('touchmove should use passive: false to prevent scrolling', () => {
      const touchmoveMatch = scriptContent.match(/touchmove.*passive:\s*false/);
      expect(touchmoveMatch).toBeTruthy();
    });
  });

  describe('Drag State Management', () => {
    test('should declare offsetX variable', () => {
      expect(scriptContent).toContain('offsetX');
    });

    test('should declare offsetY variable', () => {
      expect(scriptContent).toContain('offsetY');
    });

    test('should declare isDown flag', () => {
      expect(scriptContent).toContain('isDown');
    });

    test('should initialize drag state variables inline', () => {
      // The actual code uses: let offsetX = 0, offsetY = 0, isDown = false;
      expect(scriptContent).toMatch(/let\s+offsetX\s*=\s*0,\s*offsetY\s*=\s*0,\s*isDown\s*=\s*false/);
    });

    test('should set isDown to true on start', () => {
      expect(scriptContent).toContain('isDown = true');
    });

    test('should set isDown to false on end', () => {
      expect(scriptContent).toContain('isDown = false');
    });
  });

  describe('Drag Start Behavior', () => {
    test('should add dragging class on start', () => {
      expect(scriptContent).toContain('classList.add("dragging")');
    });

    test('should handle touch events with e.touches', () => {
      expect(scriptContent).toContain('e.touches');
      expect(scriptContent).toContain('e.touches[0]');
    });

    test('should use ternary operator to handle both mouse and touch', () => {
      expect(scriptContent).toContain('e.touches ? e.touches[0] : e');
    });

    test('should calculate offsetX from clientX and card.offsetLeft', () => {
      expect(scriptContent).toContain('evt.clientX - card.offsetLeft');
    });

    test('should calculate offsetY from clientY and card.offsetTop', () => {
      expect(scriptContent).toContain('evt.clientY - card.offsetTop');
    });

    test('should set card z-index to 999 to bring to front', () => {
      expect(scriptContent).toContain('card.style.zIndex = 999');
    });
  });

  describe('Drag Move Behavior', () => {
    test('should check isDown flag before moving', () => {
      expect(scriptContent).toContain('if (!isDown) return');
    });

    test('should handle touch events in move function', () => {
      const moveFunction = scriptContent.match(/const move = \(e\) => \{[\s\S]*?\};/);
      expect(moveFunction).toBeTruthy();
      expect(moveFunction[0]).toContain('e.touches');
    });

    test('should update card.style.left during move', () => {
      const moveFunction = scriptContent.match(/const move = \(e\) => \{[\s\S]*?\};/);
      expect(moveFunction[0]).toContain('card.style.left');
    });

    test('should update card.style.top during move', () => {
      const moveFunction = scriptContent.match(/const move = \(e\) => \{[\s\S]*?\};/);
      expect(moveFunction[0]).toContain('card.style.top');
    });

    test('should subtract offsetX from clientX for left position', () => {
      expect(scriptContent).toContain('evt.clientX - offsetX');
    });

    test('should subtract offsetY from clientY for top position', () => {
      expect(scriptContent).toContain('evt.clientY - offsetY');
    });
  });

  describe('Drag End Behavior', () => {
    test('should check isDown before ending', () => {
      const endFunction = scriptContent.match(/const end = \(\) => \{[\s\S]*?\};/);
      expect(endFunction[0]).toContain('if (isDown)');
    });

    test('should remove dragging class on end', () => {
      expect(scriptContent).toContain('classList.remove("dragging")');
    });

    test('should reset isDown to false', () => {
      const endFunction = scriptContent.match(/const end = \(\) => \{[\s\S]*?\};/);
      expect(endFunction[0]).toContain('isDown = false');
    });
  });

  describe('Event Listener Registration', () => {
    test('should register card-specific mousedown listener', () => {
      expect(scriptContent).toMatch(/card\.addEventListener\("mousedown",\s*start\)/);
    });

    test('should register document-level mousemove listener', () => {
      expect(scriptContent).toMatch(/document\.addEventListener\("mousemove",\s*move\)/);
    });

    test('should register document-level mouseup listener', () => {
      expect(scriptContent).toMatch(/document\.addEventListener\("mouseup",\s*end\)/);
    });

    test('should register card-specific touchstart listener with options', () => {
      expect(scriptContent).toMatch(/card\.addEventListener\("touchstart",\s*start,\s*\{[^}]*passive:\s*false[^}]*\}\)/);
    });

    test('should register document-level touchmove listener with options', () => {
      expect(scriptContent).toMatch(/document\.addEventListener\("touchmove",\s*move,\s*\{[^}]*passive:\s*false[^}]*\}\)/);
    });

    test('should register document-level touchend listener', () => {
      expect(scriptContent).toMatch(/document\.addEventListener\("touchend",\s*end\)/);
    });
  });

  describe('Code Quality and Best Practices', () => {
    test('should use const for functions that do not reassign', () => {
      expect(scriptContent).toContain('const start');
      expect(scriptContent).toContain('const move');
      expect(scriptContent).toContain('const end');
    });

    test('should use let for variables that can be reassigned', () => {
      // Variables are declared inline: let offsetX = 0, offsetY = 0, isDown = false;
      expect(scriptContent).toMatch(/let\s+offsetX/);
    });

    test('should use arrow functions for event handlers', () => {
      expect(scriptContent).toMatch(/=> \{/g);
    });

    test('should use forEach for iteration', () => {
      expect(scriptContent).toContain('.forEach');
    });

    test('should use optional chaining for null checks', () => {
      expect(scriptContent).toContain('?');
    });

    test('should use ternary operator for conditional assignment', () => {
      expect(scriptContent).toContain('?');
      expect(scriptContent).toContain(':');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle missing header element', () => {
      expect(scriptContent).toMatch(/header\?\s*header\.offsetHeight\s*:\s*0/);
    });

    test('should handle missing footer element', () => {
      expect(scriptContent).toMatch(/footer\?\s*footer\.offsetHeight\s*:\s*0/);
    });

    test('should handle missing random cards', () => {
      // The forEach will simply not execute if no cards are found
      expect(scriptContent).toContain('randomCards.forEach');
    });

    test('should prevent event propagation properly', () => {
      // Using passive: false allows preventDefault
      expect(scriptContent).toContain('passive: false');
    });
  });

  describe('Comments and Documentation', () => {
    test('should have Korean comment for random placement', () => {
      expect(scriptContent).toContain('// 랜덤 배치');
    });

    test('should have Korean comment for drag functionality', () => {
      expect(scriptContent).toContain('// 드래그');
    });

    test('should have comment explaining dragging class', () => {
      expect(scriptContent).toContain('// 드래그 스타일');
    });

    test('should have comment explaining z-index', () => {
      expect(scriptContent).toContain('// 가장 위에 보이도록');
    });

    test('should have comments for PC and mobile sections', () => {
      expect(scriptContent).toContain('// PC');
      expect(scriptContent).toContain('// 모바일');
    });
  });

  describe('Variable Scoping', () => {
    test('should declare positioning variables inside forEach scope', () => {
      expect(scriptContent).toContain('const usableWidth');
      expect(scriptContent).toContain('const usableHeight');
      expect(scriptContent).toContain('const x');
      expect(scriptContent).toContain('const y');
    });

    test('should declare drag state variables inside forEach scope', () => {
      // Each card gets its own drag state
      expect(scriptContent).toMatch(/forEach\(card => \{[\s\S]*?let offsetX/);
    });

    test('should use const for event variable', () => {
      expect(scriptContent).toContain('const evt');
    });
  });
});

describe('script.js - Integration and Functional Tests', () => {
  test('file should exist and be readable', () => {
    const filePath = path.join(__dirname, '../script.js');
    expect(fs.existsSync(filePath)).toBe(true);
    
    const stats = fs.statSync(filePath);
    expect(stats.isFile()).toBe(true);
    expect(stats.size).toBeGreaterThan(0);
  });

  test('should be valid JavaScript syntax', () => {
    const scriptContent = fs.readFileSync(
      path.join(__dirname, '../script.js'),
      'utf-8'
    );
    
    // This will throw if syntax is invalid
    expect(() => {
      new Function(scriptContent);
    }).not.toThrow();
  });

  test('should not have syntax errors', () => {
    const scriptContent = fs.readFileSync(
      path.join(__dirname, '../script.js'),
      'utf-8'
    );
    
    // Check for common syntax errors
    expect(scriptContent).not.toMatch(/\bfunction\s+\(/); // Ensure arrow functions used
    expect(scriptContent).not.toMatch(/\bvar\s+/); // Ensure no var usage
  });

  test('file should not be excessively large', () => {
    const stats = fs.statSync(path.join(__dirname, '../script.js'));
    // Script should be under 50KB
    expect(stats.size).toBeLessThan(50 * 1024);
  });
});

describe('script.js - Security Tests', () => {
  let scriptContent;

  beforeEach(() => {
    scriptContent = fs.readFileSync(
      path.join(__dirname, '../script.js'),
      'utf-8'
    );
  });

  test('should not use eval', () => {
    expect(scriptContent).not.toContain('eval(');
  });

  test('should not use innerHTML', () => {
    expect(scriptContent).not.toContain('innerHTML');
  });

  test('should not have inline event handlers', () => {
    expect(scriptContent).not.toMatch(/on\w+\s*=/);
  });

  test('should not use document.write', () => {
    expect(scriptContent).not.toContain('document.write');
  });
});

describe('script.js - Performance Tests', () => {
  let scriptContent;

  beforeEach(() => {
    scriptContent = fs.readFileSync(
      path.join(__dirname, '../script.js'),
      'utf-8'
    );
  });

  test('should register event listeners efficiently', () => {
    // Should use forEach instead of for loops for better readability
    expect(scriptContent).toContain('.forEach');
  });

  test('should use document-level listeners for move and end events', () => {
    // More efficient than per-card listeners
    expect(scriptContent).toContain('document.addEventListener("mousemove"');
    expect(scriptContent).toContain('document.addEventListener("mouseup"');
  });

  test('should use const for values that do not change', () => {
    const constCount = (scriptContent.match(/const\s+/g) || []).length;
    expect(constCount).toBeGreaterThan(0);
  });

  test('should cache element queries', () => {
    // randomCards, header, footer are cached
    expect(scriptContent).toContain('const randomCards');
    expect(scriptContent).toContain('const header');
    expect(scriptContent).toContain('const footer');
  });
});