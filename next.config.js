/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  compiler: {
    emotion: true
  },
  swcMinify: true,
  env: {
    SECRET_CODE: process.env.SECRET_CODE,

    FIREBASE_CONFIG_API_KEY: process.env.FIREBASE_CONFIG_API_KEY,
    FIREBASE_CONFIG_AUTH_DOMAIN: process.env.FIREBASE_CONFIG_AUTH_DOMAIN,
    FIREBASE_CONFIG_PROJECT_ID: process.env.FIREBASE_CONFIG_PROJECT_ID,
    FIREBASE_CONFIG_STORAGE_BUCKET: process.env.FIREBASE_CONFIG_STORAGE_BUCKET,
    FIREBASE_CONFIG_MESSAGING_SENDER_ID: process.env.FIREBASE_CONFIG_MESSAGING_SENDER_ID,
    FIREBASE_CONFIG_APP_ID: process.env.FIREBASE_CONFIG_APP_ID,
    FIREBASE_CONFIG_MEASUREMENT_ID: process.env.FIREBASE_CONFIG_MEASUREMENT_ID
  },
  images: {
    domains: ['firebasestorage.googleapis.com']
  }
}

module.exports = nextConfig
