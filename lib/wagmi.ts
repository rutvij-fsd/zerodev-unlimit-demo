import { http, createConfig } from "wagmi";
import { mainnet, sepolia, polygonMumbai, polygonAmoy, opBNBTestnet } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, sepolia, polygonMumbai, polygonAmoy, opBNBTestnet],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygonMumbai.id] : http(),
    [polygonAmoy.id]: http(),
    [opBNBTestnet.id]: http()
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
