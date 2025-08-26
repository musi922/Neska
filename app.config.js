export default ({ config }) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    ...config,
    extra: {
      ...config.extra,
      apiUrl: isProduction 
        ? 'https://api.genz.app' 
        : 'http://localhost:3000',
      websocketUrl: isProduction 
        ? 'wss://ws.genz.app' 
        : 'ws://localhost:8080',
      environment: process.env.NODE_ENV || 'development',
    },
  };
};