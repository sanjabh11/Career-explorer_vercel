module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://services.onetcenter.org/ws/:path*',
      },
    ];
  },
};