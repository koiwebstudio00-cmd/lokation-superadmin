import type { NextConfig } from "next";

const config: NextConfig = {
  logging: { incomingRequests: { ignore: [/\/api\/auth\/callback\//] } },
};
export default config;
