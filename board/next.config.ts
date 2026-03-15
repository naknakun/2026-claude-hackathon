import type { NextConfig } from "next";

// 개발 환경에서 SSL 인증서 검증 우회 (회사 네트워크 대응)
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
