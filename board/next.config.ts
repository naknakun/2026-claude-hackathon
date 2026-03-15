import type { NextConfig } from "next";

// 회사 네트워크 SSL 인증서 검증 우회 (개발/빌드 모두 적용)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;
