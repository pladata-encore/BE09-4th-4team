/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/products',
                destination: 'http://localhost:8080/api/products',
            },
        ];
    },
};

export default nextConfig;
