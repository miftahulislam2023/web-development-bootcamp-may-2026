/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                hostname: "www.sourcecodester.com",
                protocol: "https",
            }
        ]
    }
}

export default nextConfig
