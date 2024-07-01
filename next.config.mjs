// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/onboardingpage',
          permanent: false, // Set this to `true` if you want this to be a permanent redirect (HTTP 301)
        },
      ];
    },
  };
  
  export default nextConfig;
  