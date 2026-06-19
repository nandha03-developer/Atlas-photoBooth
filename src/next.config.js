/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // images: {
  //   domains: ['scontent.cdninstagram.com'], // Add your allowed domain(s) here
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3-ap-south-1.amazonaws.com',
        port: '',
        pathname: '/web-laabam.one/image/photobooth/**', // Adjust the path based on your needs
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/post_upload/:path*',
        destination: 'https://g7p7gx7okzuqmrbcoohenvca5q0ommgm.lambda-url.ap-south-1.on.aws/swagger/:path*', // Proxy to external API
      },
      {
        source: '/cognito_signup/:path*',
        destination: 'https://24cfameel4ryyophwr2liqrgpy0dzdxu.lambda-url.us-east-1.on.aws/:path*', // Proxy to external API
      },
      {
        source: '/cognito_verify_otp/:path*',
        destination: 'https://24cfameel4ryyophwr2liqrgpy0dzdxu.lambda-url.us-east-1.on.aws/:path*', // Proxy to external API
      },
      {
        source: '/cognito_signin_admin/:path*',
        destination: 'https://24cfameel4ryyophwr2liqrgpy0dzdxu.lambda-url.us-east-1.on.aws/:path*', // Proxy to external API
      },
      {
        source: '/cognito_forgotpassword/:path*',
        destination: 'https://24cfameel4ryyophwr2liqrgpy0dzdxu.lambda-url.us-east-1.on.aws/:path*', // Proxy to external API
      },
      {
        source: '/cognito_forgotpassword_confirm/:path*',
        destination: 'https://24cfameel4ryyophwr2liqrgpy0dzdxu.lambda-url.us-east-1.on.aws/:path*', // Proxy to external API
      },
      {
        source: '/cognito_resend_otp/:path*',
        destination: 'https://24cfameel4ryyophwr2liqrgpy0dzdxu.lambda-url.us-east-1.on.aws/:path*', // Proxy to external API
      },
    ];
  },
  // Additional configurations can go here
};

module.exports = nextConfig;
