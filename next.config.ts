import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow remote HMR loading from local IP and tunnel origins
  allowedDevOrigins: [
    'localhost', 
    '127.0.0.1', 
    '192.168.0.107', 
    '*.lhr.life', 
    '*.loca.lt', 
    '*.localhost.run',
    '*.serveo.net',
    '*.serveousercontent.com',
    '*.ngrok-free.dev',
    '*.ngrok.io'
  ],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
