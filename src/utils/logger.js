// Production-safe logger that only logs in development mode
// This prevents console statements from appearing in production builds

const isDevelopment = __DEV__;

const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    }
    // In production, you could send errors to a service like Sentry
    // if (!isDevelopment) {
    //   reportErrorToService(args);
    // }
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

export default logger;
