import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout';
import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react';
import { WagmiConfig, defaultChains, createClient, configureChains } from 'wagmi';

import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';


const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY }),
  publicProvider(),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: 'Playback Policy',
    //   },
    // }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     qrcode: true,
    //   },
    // }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: 'Injected',
    //     shimDisconnect: true,
    //   },
    // }),
  ],
  provider,
  webSocketProvider,
});



const client = createReactClient({
  provider: studioProvider({ apiKey: process.env.NEXT_PUBLIC_API_CORS }),
});


function MyApp( { Component, pageProps }: AppProps ) {

  return (
    <>
      <WagmiConfig client={wagmiClient}>
          <LivepeerConfig client={client}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </LivepeerConfig>
      </WagmiConfig>
    </>
  );
}

export default MyApp
