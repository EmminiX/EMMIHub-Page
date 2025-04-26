/**
 * EMMIHUB - Typewriter Animation Module
 * 
 * This module provides advanced typewriter text animations with customizable options.
 * Features include variable typing speeds, cursor effects, and callbacks.
 * 
 * @author Emmi C.
 * @version 1.0
 */

import errorLogger from '../core/error-logging.js';

/**
 * TypewriterEffect class for creating and controlling typewriter animations
 */
class TypewriterEffect {
  /**
   * Create a new typewriter effect instance
   * @param {Object} options - Configuration options
   * @param {HTMLElement|string} options.element - Target element or selector
   * @param {string} [options.text] - Text to type (defaults to element's text content)
   * @param {number|Array<number>} [options.charDelay=[30,70]] - Character delay in ms (single value or [min,max] for vowels)
   * @param {number} [options.startDelay=0] - Delay before starting animation in ms
   * @param {boolean} [options.cursor=true] - Whether to show cursor
   * @param {number} [options.cursorPulse=500] - Cursor pulse animation duration in ms
   * @param {string} [options.cursorChar='|'] - Cursor character
   * @param {string} [options.cursorColor='currentColor'] - Cursor color
   * @param {Function} [options.onStart] - Callback when animation starts
   * @param {Function} [options.onChar] - Callback after each character is typed
   * @param {Function} [options.onComplete] - Callback when animation completes
   */
  constructor(options) {
    // Default options
    this.defaults = {
      element: null,
      text: null,
      charDelay: [30, 70], // [consonant, vowel] delay
      startDelay: 0,
      cursor: true,
      cursorPulse: 500,
      cursorChar: '|',
      cursorColor: 'currentColor',
      onStart: null,
      onChar: null,
      onComplete: null
    };
    
    // Merge options with defaults
    this.options = { ...this.defaults, ...options };
    
    // Get element
    if (typeof this.options.element === 'string') {
      this.element = document.querySelector(this.options.element);
    } else {
      this.element = this.options.element;
    }
    
    // Validate element
    if (!this.element) {
      errorLogger.error('Typewriter element not found', 'typewriter', 'high');
      return;
    }
    
    // Get text to type
    this.text = this.options.text || this.element.textContent || '';
    
    // Clear element for animation
    this.element.textContent = '';
    
    // Animation state
    this.state = {
      isTyping: false,
      isPaused: false,
      charIndex: 0,
      cursorElement: null
    };
    
    // Initialize
    this.init();
  }
  
  /**
   * Initialize the typewriter effect
   * @private
   */
  init() {
    try {
      // Add typewriter class to element
      this.element.classList.add('typewriter-container');
      
      // Create text container
      this.textContainer = document.createElement('span');
      this.textContainer.classList.add('typewriter-text');
      this.element.appendChild(this.textContainer);
      
      // Create cursor if enabled
      if (this.options.cursor) {
        this.createCursor();
      }
      
      // Start typing after delay
      setTimeout(() => {
        this.start();
      }, this.options.startDelay);
    } catch (error) {
      errorLogger.error(
        `Failed to initialize typewriter: ${error.message}`,
        'typewriter',
        'medium',
        { element: this.element, options: this.options }
      );
    }
  }
  
  /**
   * Create cursor element
   * @private
   */
  createCursor() {
    // Create cursor element
    this.state.cursorElement = document.createElement('span');
    this.state.cursorElement.classList.add('typewriter-cursor');
    this.state.cursorElement.textContent = this.options.cursorChar;
    this.state.cursorElement.style.color = this.options.cursorColor;
    
    // Add cursor animation
    if (this.options.cursorPulse > 0) {
      this.state.cursorElement.style.animation = `cursorPulse ${this.options.cursorPulse}ms infinite`;
    }
    
    // Add cursor to element
    this.element.appendChild(this.state.cursorElement);
  }
  
  /**
   * Start the typewriter animation
   * @returns {TypewriterEffect} This instance for chaining
   */
  start() {
    if (this.state.isTyping) return this;
    
    this.state.isTyping = true;
    this.state.isPaused = false;
    
    // Call onStart callback
    if (typeof this.options.onStart === 'function') {
      this.options.onStart.call(this);
    }
    
    // Start typing
    this.typeNextChar();
    
    return this;
  }
  
  /**
   * Pause the typewriter animation
   * @returns {TypewriterEffect} This instance for chaining
   */
  pause() {
    this.state.isPaused = true;
    return this;
  }
  
  /**
   * Resume the typewriter animation
   * @returns {TypewriterEffect} This instance for chaining
   */
  resume() {
    if (!this.state.isPaused) return this;
    
    this.state.isPaused = false;
    this.typeNextChar();
    
    return this;
  }
  
  /**
   * Stop the typewriter animation
   * @param {boolean} [complete=false] - Whether to complete the text immediately
   * @returns {TypewriterEffect} This instance for chaining
   */
  stop(complete = false) {
    this.state.isTyping = false;
    this.state.isPaused = false;
    
    if (complete) {
      // Complete the text immediately
      this.textContainer.textContent = this.text;
      
      // Call onComplete callback
      if (typeof this.options.onComplete === 'function') {
        this.options.onComplete.call(this);
      }
    }
    
    return this;
  }
  
  /**
   * Type the next character
   * @private
   */
  typeNextChar() {
    if (!this.state.isTyping || this.state.isPaused) return;
    
    if (this.state.charIndex < this.text.length) {
      // Get next character
      const char = this.text[this.state.charIndex];
      
      // Add character to text container
      this.textContainer.textContent += char;
      
      // Increment character index
      this.state.charIndex++;
      
      // Call onChar callback
      if (typeof this.options.onChar === 'function') {
        this.options.onChar.call(this, char, this.state.charIndex);
      }
      
      // Calculate delay for next character
      let delay;
      if (Array.isArray(this.options.charDelay)) {
        // Use different delays for vowels and consonants
        const isVowel = 'aeiouAEIOU'.includes(char);
        delay = isVowel ? this.options.charDelay[1] : this.options.charDelay[0];
      } else {
        // Use fixed delay
        delay = this.options.charDelay;
      }
      
      // Schedule next character
      setTimeout(() => {
        this.typeNextChar();
      }, delay);
    } else {
      // Typing complete
      this.state.isTyping = false;
      
      // Call onComplete callback
      if (typeof this.options.onComplete === 'function') {
        this.options.onComplete.call(this);
      }
    }
  }
  
  /**
   * Reset the typewriter animation
   * @param {string} [newText] - New text to type (optional)
   * @returns {TypewriterEffect} This instance for chaining
   */
  reset(newText) {
    // Stop current animation
    this.stop();
    
    // Update text if provided
    if (newText !== undefined) {
      this.text = newText;
    }
    
    // Reset state
    this.state.charIndex = 0;
    this.textContainer.textContent = '';
    
    return this;
  }
  
  /**
   * Type a new text
   * @param {string} text - Text to type
   * @returns {TypewriterEffect} This instance for chaining
   */
  type(text) {
    this.reset(text);
    this.start();
    return this;
  }
  
  /**
   * Remove the typewriter effect and restore original content
   * (Safeguard: only remove the .typewriter-text span, never touch siblings)
   */
  destroy() {
    // Stop animation
    this.stop();

    // Remove cursor
    if (this.state.cursorElement && this.state.cursorElement.parentNode) {
      this.state.cursorElement.parentNode.removeChild(this.state.cursorElement);
    }

    // Restore original content only inside the .typewriter-text span
    if (this.textContainer) {
      this.textContainer.textContent = this.text;
    }

    // Remove typewriter class
    this.element.classList.remove('typewriter-container');
  }
}

/**
 * Initialize typewriter effects on elements with the 'typewriter' class
 * @param {Object} [options] - Default options for all typewriters
 * @returns {Array<TypewriterEffect>} Array of typewriter instances
 */
function initTypewriters(options = {}) {
  const elements = document.querySelectorAll('.typewriter');
  const instances = [];
  
  elements.forEach(element => {
    // Get element-specific options from data attributes
    const elementOptions = {
      element,
      text: element.textContent,
      charDelay: element.dataset.typewriterDelay ? 
                 JSON.parse(element.dataset.typewriterDelay) : 
                 options.charDelay,
      startDelay: element.dataset.typewriterStartDelay ? 
                  parseInt(element.dataset.typewriterStartDelay, 10) : 
                  options.startDelay,
      cursor: element.dataset.typewriterCursor ? 
              element.dataset.typewriterCursor !== 'false' : 
              options.cursor,
      cursorChar: element.dataset.typewriterCursorChar || 
                  options.cursorChar,
      onComplete: function() {
        // Keep cursor for 2s, then fade out
        if (this.state.cursorElement) {
          this.state.cursorElement.style.transition = 'opacity 0.5s';
          setTimeout(() => {
            this.state.cursorElement.style.opacity = '0';
          }, 2000);
        }
        
        // Let the main script handle subheadline animations
        if (typeof options.onComplete === 'function') {
          options.onComplete.call(this);
        }
      }
    };
    
    // Create typewriter instance with merged options
    const instance = new TypewriterEffect({
      ...options,
      ...elementOptions
    });
    
    instances.push(instance);
  });
  
  return instances;
}

// Export the TypewriterEffect class and initialization function
export { TypewriterEffect, initTypewriters };
export default TypewriterEffect;