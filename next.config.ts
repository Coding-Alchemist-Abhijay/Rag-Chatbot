import path from "path";

const nextConfig = {
  webpack: (config: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
    };
    return config;
  },
};

export default nextConfig;
