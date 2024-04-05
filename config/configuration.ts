export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
});
