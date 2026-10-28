export default {
  experimental: { serverComponentsExternalPackages: ["better-sqlite3"] },
  async redirects() {
    return [{ source: "/jobber-marketing-suite-alternative", destination: "/for-jobber", permanent: true }];
  },
};
