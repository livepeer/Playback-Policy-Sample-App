import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout';
import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { WagmiConfig, chain, createClient } from 'wagmi';


function MyApp( { Component, pageProps }: AppProps ) {
  
   const wagmiClient = createClient(
     getDefaultClient({
       appName: 'Playback Policy',
       chains: [chain.goerli],
       infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
     })
   );
  
   const client = createReactClient({
     provider: studioProvider({ apiKey: process.env.NEXT_PUBLIC_API_CORS }),
   });
  
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <ConnectKitProvider>
          <LivepeerConfig client={client}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </LivepeerConfig>
        </ConnectKitProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp
