import type { NextConfig } from "next";

// 회사 내부망 SSL 인증서 우회 — 개발 환경에서만 적용
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;
