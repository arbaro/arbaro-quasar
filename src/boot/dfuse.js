import { createDfuseClient } from "@dfuse/client";

const client = createDfuseClient({
  apiKey: process.env.DFUSE_API_KEY,
  network: process.env.DFUSE_NETWORK
});

export default async ({ Vue }) => {
  Vue.prototype.$dfuse = client;
};
