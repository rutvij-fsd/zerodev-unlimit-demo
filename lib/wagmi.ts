import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, sepolia],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http()
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
