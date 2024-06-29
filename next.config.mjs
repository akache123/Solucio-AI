/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      CLERK_AUTH_KEY: process.env.CLERK_AUTH_KEY,
    },
  };
  
  export default nextConfig;
  