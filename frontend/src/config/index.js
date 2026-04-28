const defaultConfig = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  WS_URL: process.env.REACT_APP_WS_URL || 'ws://localhost:5000',
  ENVIRONMENT: process.env.NODE_ENV || 'development'
};

export default defaultConfig;
