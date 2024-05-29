/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
                port: "",
                pathname: "/v0/b/food-blog-5fe9c.appspot.com/o/**",
            },
        ],
    },
};

export default nextConfig;
