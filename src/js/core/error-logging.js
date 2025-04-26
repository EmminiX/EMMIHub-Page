/**
 * EMMIHUB - Error Logging System
 * 
 * This module provides comprehensive error tracking and handling for the EMMIHUB website.
 * It captures uncaught errors, promise rejections, and allows manual error logging.
 * 
 * Features:
 * - Global error event capturing
 * - Promise rejection handling
 * - Console logging with enhanced formatting
 * - Error categorization and severity levels
 * - User action tracking for context
 * - Optional local storage for offline error collection
 * 
 * @author Emmi C.
 * @version 1.0
 */

class ErrorLogger {
    /**
     * Initialize the error logging system
     * @param {Object} options - Configuration options
     * @param {boolean} options.consoleOutput - Whether to output errors to console (default: true)
     * @param {boolean} options.localStorage - Whether to store errors in localStorage (default: true)
     * @param {number} options.maxStoredErrors - Maximum number of errors to store locally (default: 50)
     * @param {string} options.applicationVersion - Current application version
     */
    constructor(options = {}) {
        this.options = {
            consoleOutput: true,
            localStorage: true,
            maxStoredErrors: 50,
            applicationVersion: '1.0',
            ...options
        };

        // Error storage
        this.errors = [];
        
        // Load any previously stored errors
        this.loadStoredErrors();
        
        // Set up global error handlers
        this.setupGlobalErrorHandling();
        
        // Track current user context
        this.userContext = {
            currentSection: null,
            lastAction: null,
            sessionStartTime: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            theme: document.body.className.match(/theme-[a-z-]+/) ? 
                  document.body.className.match(/theme-[a-z-]+/)[0] : 'unknown'
        };
        
        // Track page navigation
        this.setupNavigationTracking();
        
        console.log('%cEMMIHUB Error Logging System Initialized', 
                   'color: #00f0ff; font-weight: bold; font-size: 12px;');
    }
    
    /**
     * Set up global error event handlers
     * @private
     */
    setupGlobalErrorHandling() {
        // Handle uncaught errors
        window.onerror = (message, source, lineno, colno, error) => {
            this.logError({
                type: 'uncaught',
                message: message,
                source: source,
                lineno: lineno,
                colno: colno,
                stack: error?.stack || 'Stack trace unavailable',
                severity: 'critical'
            });
            return false; // Let the error propagate to console
        };
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'promise',
                message: event.reason?.message || 'Unhandled Promise Rejection',
                stack: event.reason?.stack || 'Stack trace unavailable',
                severity: 'high'
            });
        });
        
        // Handle resource loading errors
        window.addEventListener('error', (event) => {
            // Only handle resource errors here (not JS errors, which go to window.onerror)
            if (event.target && (event.target.tagName === 'SCRIPT' || 
                event.target.tagName === 'LINK' || 
                event.target.tagName === 'IMG')) {
                
                this.logError({
                    type: 'resource',
                    message: `Failed to load ${event.target.tagName.toLowerCase()}: ${event.target.src || event.target.href}`,
                    element: event.target.outerHTML,
                    severity: 'medium'
                });
            }
        }, true); // Use capture phase
    }
    
    /**
     * Track page navigation and section changes
     * @private
     */
    setupNavigationTracking() {
        // Track hash changes for single-page navigation
        window.addEventListener('hashchange', () => {
            const section = window.location.hash.replace('#', '') || 'home';
            this.userContext.currentSection = section;
            this.userContext.lastAction = `Navigated to ${section}`;
        });
        
        // Initial section
        this.userContext.currentSection = window.location.hash.replace('#', '') || 'home';
        
        // Track clicks for user action context, but prevent interference with other interactions
        document.addEventListener('click', (event) => {
            // Skip tracking if the click is on or within an interactive element
            const isInteractive = event.target.closest('button, a, .tier, .assistant-card, [role="button"]');
            if (isInteractive) {
                return;
            }

            // Find the closest element with an ID or class for context
            let element = event.target;
            let elementInfo = '';
            
            // Try to get a meaningful element description
            if (element.id) {
                elementInfo = `#${element.id}`;
            } else if (element.className && typeof element.className === 'string') {
                elementInfo = `.${element.className.split(' ')[0]}`;
            }
            
            this.userContext.lastAction = `Clicked ${elementInfo || element.tagName.toLowerCase()}`;
        }, { passive: true }); // Make the listener passive to improve performance
    }
    
    /**
     * Log an error with the given details
     * @param {Object} errorData - Error information
     * @param {string} errorData.type - Error type (e.g., 'uncaught', 'api', 'validation')
     * @param {string} errorData.message - Error message
     * @param {string} [errorData.severity='medium'] - Error severity ('low', 'medium', 'high', 'critical')
     * @param {string} [errorData.stack] - Error stack trace
     * @param {Object} [errorData.context] - Additional context information
     * @returns {Object} The logged error object
     */
    logError(errorData) {
        const timestamp = new Date().toISOString();
        
        // Create the error object with all available information
        const error = {
            id: this.generateErrorId(),
            timestamp,
            type: errorData.type || 'unknown',
            message: errorData.message || 'Unknown error',
            severity: errorData.severity || 'medium',
            url: window.location.href,
            userContext: { ...this.userContext },
            applicationVersion: this.options.applicationVersion,
            ...errorData
        };
        
        // Add to in-memory collection
        this.errors.push(error);
        
        // Trim collection if it gets too large
        if (this.errors.length > this.options.maxStoredErrors) {
            this.errors = this.errors.slice(-this.options.maxStoredErrors);
        }
        
        // Store in localStorage if enabled
        if (this.options.localStorage) {
            this.storeError(error);
        }
        
        // Output to console if enabled
        if (this.options.consoleOutput) {
            this.consoleOutput(error);
        }
        
        return error;
    }
    
    /**
     * Generate a unique error ID
     * @private
     * @returns {string} Unique error ID
     */
    generateErrorId() {
        return 'err_' + Date.now().toString(36) + '_' + 
               Math.random().toString(36).substr(2, 5);
    }
    
    /**
     * Output error to console with formatting
     * @private
     * @param {Object} error - Error object
     */
    consoleOutput(error) {
        const styles = {
            critical: 'background: #ff2b4e; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
            high: 'background: #ff6b35; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
            medium: 'background: #ffd60a; color: black; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
            low: 'background: #00f0ff; color: black; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
        };
        
        console.group(`%cERROR [${error.severity.toUpperCase()}]: ${error.type}`, styles[error.severity] || styles.medium);
        console.log('Message:', error.message);
        console.log('Timestamp:', error.timestamp);
        console.log('Location:', error.url);
        console.log('User Context:', error.userContext);
        
        if (error.stack) {
            console.log('Stack Trace:');
            console.log(error.stack);
        }
        
        if (error.context) {
            console.log('Additional Context:', error.context);
        }
        
        console.groupEnd();
    }
    
    /**
     * Store error in localStorage
     * @private
     * @param {Object} error - Error object
     */
    storeError(error) {
        try {
            // Get existing errors
            const storedErrors = JSON.parse(localStorage.getItem('emmihub_errors') || '[]');
            
            // Add new error
            storedErrors.push(error);
            
            // Trim if needed
            const trimmedErrors = storedErrors.slice(-this.options.maxStoredErrors);
            
            // Save back to localStorage
            localStorage.setItem('emmihub_errors', JSON.stringify(trimmedErrors));
        } catch (e) {
            // If localStorage fails, just log to console
            console.error('Failed to store error in localStorage:', e);
        }
    }
    
    /**
     * Load previously stored errors from localStorage
     * @private
     */
    loadStoredErrors() {
        if (!this.options.localStorage) return;
        
        try {
            const storedErrors = JSON.parse(localStorage.getItem('emmihub_errors') || '[]');
            this.errors = storedErrors;
        } catch (e) {
            console.error('Failed to load stored errors:', e);
            // Clear potentially corrupted data
            localStorage.removeItem('emmihub_errors');
        }
    }
    
    /**
     * Clear all stored errors
     */
    clearErrors() {
        this.errors = [];
        if (this.options.localStorage) {
            localStorage.removeItem('emmihub_errors');
        }
    }
    
    /**
     * Get all logged errors
     * @returns {Array} Array of error objects
     */
    getErrors() {
        return [...this.errors];
    }
    
    /**
     * Filter errors by criteria
     * @param {Object} criteria - Filter criteria
     * @param {string} [criteria.type] - Error type to filter by
     * @param {string} [criteria.severity] - Error severity to filter by
     * @param {string} [criteria.after] - ISO timestamp to filter errors after
     * @param {string} [criteria.before] - ISO timestamp to filter errors before
     * @returns {Array} Filtered array of error objects
     */
    filterErrors(criteria = {}) {
        return this.errors.filter(error => {
            // Check each criteria
            if (criteria.type && error.type !== criteria.type) return false;
            if (criteria.severity && error.severity !== criteria.severity) return false;
            if (criteria.after && new Date(error.timestamp) < new Date(criteria.after)) return false;
            if (criteria.before && new Date(error.timestamp) > new Date(criteria.before)) return false;
            
            return true;
        });
    }
    
    /**
     * Log a manual error from anywhere in the application
     * @param {string} message - Error message
     * @param {string} [type='manual'] - Error type
     * @param {string} [severity='medium'] - Error severity
     * @param {Object} [context] - Additional context information
     * @returns {Object} The logged error object
     */
    error(message, type = 'manual', severity = 'medium', context = {}) {
        return this.logError({
            type,
            message,
            severity,
            context
        });
    }
    
    /**
     * Log a warning (low severity error)
     * @param {string} message - Warning message
     * @param {string} [type='warning'] - Warning type
     * @param {Object} [context] - Additional context information
     * @returns {Object} The logged warning object
     */
    warning(message, type = 'warning', context = {}) {
        return this.logError({
            type,
            message,
            severity: 'low',
            context
        });
    }
    
    /**
     * Update the current user context
     * @param {Object} contextUpdate - Context properties to update
     */
    updateUserContext(contextUpdate) {
        this.userContext = {
            ...this.userContext,
            ...contextUpdate
        };
    }
    
    /**
     * Get error statistics
     * @returns {Object} Error statistics
     */
    getStatistics() {
        const stats = {
            total: this.errors.length,
            byType: {},
            bySeverity: {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0
            },
            recentErrors: this.errors.slice(-5)
        };
        
        // Count by type and severity
        this.errors.forEach(error => {
            // Count by type
            if (!stats.byType[error.type]) {
                stats.byType[error.type] = 0;
            }
            stats.byType[error.type]++;
            
            // Count by severity
            if (stats.bySeverity[error.severity] !== undefined) {
                stats.bySeverity[error.severity]++;
            }
        });
        
        return stats;
    }
}

// Create and export the global error logger instance
window.errorLogger = new ErrorLogger();

// Expose a simple API for logging errors from anywhere
window.logError = (message, type, severity, context) => {
    return window.errorLogger.error(message, type, severity, context);
};

window.logWarning = (message, type, context) => {
    return window.errorLogger.warning(message, type, context);
};

// Export the error logger for module usage
export default window.errorLogger;
