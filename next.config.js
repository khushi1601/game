/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals = config.externals || []
    config.externals.push({
      'react-native-config': 'react-native-config',
    })
    return config
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/rapier'],
}

module.exports = nextConfig