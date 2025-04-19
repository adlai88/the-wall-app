/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      'cdn.cosmos.so', 
      'images.unsplash.com',
      'qryxxshzopxiuilberlo.supabase.co'  // Updated Supabase project URL
    ],
  },
}

module.exports = nextConfig 