# Playback Policy Guide

## Set up

- [Create a Livepeer Studio account](https://livepeer.studio/register)
- [Create an API key that has CORS access](https://docs.livepeer.studio/quickstart)
- [Create an account and API key with Infura](https://docs.infura.io/infura/getting-started)

## Adding dependencies

- Install [Livepeer SDK](https://livepeerjs.org/)
- Install [NextJS w/Typescript](https://nextjs.org/docs/getting-started)
- Install [Wagmi](https://www.npmjs.com/package/wagmi)
- Install [Ethers](https://www.npmjs.com/package/ethers)
- Install [dotenv](https://www.npmjs.com/package/dotenv)
- Install [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- Install [SIWE](https://www.npmjs.com/package/siwe)
- Install [Iron-Session](https://github.com/vvo/iron-session)
- Install [Rainbow Kit](https://www.rainbowkit.com/docs/installation)

## Steps

## Set Playback Policy for stream

> *Requires a stream in Livepeer studio. Create a stream either through the dashboard, [SDK](https://livepeerjs.org/react/stream/useCreateStream), or [API](https://docs.livepeer.studio/guides/live/create-a-livestream)*
> 

- Create signing key
    
    ```tsx
    fetch('https://livepeer.studio/api/access-control/signing-key', {
    method: 'POST',
    headers: {
    Authorization: `Bearer ${api_key}`,
    'Content-Type': 'application/json' 
    }
    })
    ```
    

- Save `publicKey` and `privateKey` from the response for later use
    
    > *This is the only time you will have access to the private key - please store it somewhere safe
    The private key also needs to be decoded base64 when using it for JWT*
    > 
    
    ```json
    {
    "publicKey": "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFeVlZZGNKL0tFbUIrWjAvb29sbXJ2bXNlblRiNgpnc1FuQmhnRVhmdkhycDgxNFg0b0lBbVg1VjlnZzhEclJLUFRhNWxlRkhRYm5LQ0VvTk1NckoxK2F3PT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==",
    "privateKey": "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFOTRXNFRBWjFOSGc5VGxGcUFPS1AzOXNJZkNPcQphNjdrNlhtZXNOYi9oaXNPOE1LdzFudU5lSFN0UG4vNUlkQ2RFMFVhTDM4dE1iNm1xWW5aSFlQbWd3PT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg=="
    }
    ```
    

- Apply Playback Policy for `Stream`

> This can be done on creation of a stream or to an existing stream
> 

```tsx
fetch('https://livepeer.studio/api/access-control/signing-key/stream/${streamId}', {
method: 'PATCH',
headers: {
Authorization: `Bearer ${api_key}`,
'Content-Type': 'application/json' 
}, 
body: JSON.strinfy({
playbackPolicy:{
type: 'jwt'
	}
}})
```

### ENV file

- Make sure to create an .env file to store all sensitive keys needed for the project

> When deploying this project, make sure to also set up the env in the service being used(ex. Vercel)
> 

```tsx
PUBLIC_KEY=""
PRIVTE_KEY=""
LIVEPEER_API_KEY=""
INFURA_API_KEY=""
INRON_PASSWORD=""
```

### Main project component setup

- In `_app.tsx` import tools from LivepeerJS, Wagmi and configure.
- Following the [Livepeer](https://livepeerjs.org/react/LivepeerConfig), [Rainbowconnect Kit](https://www.rainbowkit.com/docs/installation) and  [Wagmi](https://wagmi.sh/examples/connect-wallet) instructions for more details
- Should look something like the following examples

```tsx
import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react';
import { WagmiConfig, chain, createClient } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, midnightTheme } from '@rainbow-me/rainbowkit';
```

- Set up Wagmi client and connect to Goerli testnet

```tsx
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY }),
  publicProvider(),
] );

const { connectors } = getDefaultWallets( {
  appName: 'Playback Policy',
  chains
} )

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});
```

- Set up Studio provider and pass in your Livepeer Studio API key

```tsx
const client = createReactClient({
     provider: studioProvider({ apiKey: process.env.NEXT_PUBLIC_API_CORS }),
   });
```

- Wrap the Wagmi, and Livepeer SDK around the main app component

```tsx
return (
    <>
      <WagmiConfig client={wagmiClient}>
          <LivepeerConfig client={client}>
						<RainbowKitProvider chains={chains}>
	            <Component {...pageProps} />
						</RainbowKitProvider>
          </LivepeerConfig>
      </WagmiConfig>
    </>
  );

export default MyApp
```

### API endpoints

- Create a directory inside `pages` see [NEXTJS](https://nextjs.org/docs/api-routes/introduction) form more information on this set up
- Follow the instructions for creating the routes for [SIWE](https://wagmi.sh/examples/sign-in-with-ethereum)
    
    > ***This used to verify the wallet address and the user***
    > 

# SIWE

### Nonce page

- In `nonce.ts`
- Generates a random nonce for unique session to prevent replay attacks

```tsx
import { withIronSessionApiRoute} from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { generateNonce } from 'siwe';
import { ironOptions } from '../../utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case 'GET':
      req.session.nonce = generateNonce();
      await req.session.save();
      res.setHeader('Content-Type', 'text/plain');
      res.send(req.session.nonce);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
```

### Verify page

- In`verify.ts`
- Verifies message created and user session

```tsx
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { SiweMessage } from 'siwe';
import { ironOptions } from '../../utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case 'POST':
      try {
        const { message, signature } = req.body;
        const siweMessage = new SiweMessage(message);
        const fields = await siweMessage.validate(signature);

        if (fields.nonce !== req.session.nonce)
          return res.status(422).json({ message: 'Invalid nonce.' });

        req.session.siwe = fields;
        await req.session.save();
        res.json({ ok: true });
      } catch (_error) {
        res.json({ ok: false });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
```

### Login Address page

- In `loginAddress.ts`
- Getting the address of the signed-in user

```tsx
import { ironOptions } from '../../utils';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case 'GET':
      res.send({ address: req.session.siwe?.address });
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
```

### Logout page

- In `logout.ts`
- Allow user to logout of SIWE

```tsx
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
 const { method } = req
 switch (method) {
 case 'GET':
 req.session.destroy()
 res.send({ ok: true })
 break
 default:
 res.setHeader('Allow', ['GET'])
 res.status(405).end(`Method ${method} Not Allowed`)
 }
}

export default withIronSessionApiRoute(handler, ironOptions)
```

# Livepeer Studio

### Create Keys page

> **This step is not required as keys can be generated through the dashboard in Livepeer Studio**
> 
- In `createKeys.ts`
- This page makes an API request to generate key pairs for playback policy

```tsx
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`https://livepeer.studio/api/access-control/signing-key`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}
```

### Delete Keys page

- In `delete.ts`
- This page makes an API request to delete playback policy keys

```tsx
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
  try {
    const response = await fetch(
      `https://livepeer.studio/api/access-control/signing-key/${req.body.deleteKeyId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    res.status(400).send(error);
    
  }
}
```

### Get Key by Id page

- In `keyInfo.ts`
- This page makes an API request to get information for a specific key

```tsx
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(
      `https://livepeer.studio/api/access-control/signing-key/${req.query.signKeyInfo}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.STAGING_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    res.status(400).send(error);
  }
}
```

### Get Keys page

- In `keyInfos.ts`
- This page makes an API request to get information for all existing keys

```tsx
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`https://livepeer.studio/api/access-control/signing-key`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}
```

### Update Keys page

- In `updateKey.ts`
- This page makes an API request to update information on a specific key

```tsx
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
  const { disableKey, name, updateKeyId } = req.body;
  try {
    const response = await fetch(
      `https://livepeer.studio/api/access-control/signing-key/${updateKeyId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( {
          disabled,
          name,
        }),
      }
    );
    const data = await response.json();
    return res.status( 200 ).json( data );
    
  } catch (error) {
    res.status(400).send(error);
  }
}
```

# JWT

### Create a JWT

- In `createJWT.tsx`
- This page gets payload information and generates a JWT to use

```tsx
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { playbackId, address } = req.body;

// Need to decode the private key from base 64
const privatekey = process.env.PRIVATE_KEY;
const decodePrivateKey = Buffer.from(privatekey!, 'base64').toString()

  // Expires in 1 hour
  const expiration = Math.floor(Date.now() / 1000) + 60 * 60;
  // Creating JWT
  const payload: JwtPayload = {
    sub: playbackId,
    action: 'pull',
    custom: {
      'walletAddress': address,
    },
    iss: 'Livepeer Studio',
    pub: process.env.PUBLIC_KEY,
    exp: expiration,
  };

  res.json({
    token: jwt.sign(payload, decodePrivateKey as Secret, {
      algorithm: 'ES256',
    } ),
  });
}
```

### Restrict stream page

- Create a page called `login.tsx`
- Have user connect to a wallet
- Wallet address must exist and have a certain amount of ETH
- Set the playback ID of the stream to restrict.(This example has a hard coded `playbackId`)
- Then SIWE with the button which will generate a JWT and then contain information to use for the playback URL (JWT has to be decoded in order to get payload params)
    - ex. `https://livepeercdn.com/hls/${playbackId}/index.m3u8?jwt=${token}`
    
  > When using the SDK, the `playbackId` and `jwt` can be passed as an attribute to the `<Player />` instead of playback url
    >

```tsx
import { useEffect, useState } from 'react';
import { Player } from '@livepeer/react';
import jwt from 'jsonwebtoken';
import { useAccount, useBalance, useNetwork, useSignMessage, useConnect, useDisconnect } from 'wagmi';
import { SiweMessage } from 'siwe';
import styles from '../styles/Home.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Login() {
  const { chain } = useNetwork();
  const { signMessageAsync, isSuccess } = useSignMessage();
  const [verifySignature, setVerifiedSignature] = useState<string>();
  const [token, setToken] = useState<string>();
  const [disableButton, setDisablebutton] = useState<boolean>(false);
  const [playbackId, setPlaybackId] = useState<string>('b0aakwxhj9xpi1qf');

  // Using Wagmi to get wallet information
  const { address, isConnected, isDisconnected } = useAccount();
  const { data } = useBalance({
    addressOrName: address, //Getting wallet address with useAccount()
    chainId: 5, //Goerli testnet});
    formatUnits: 'ethers', //in ethers
  });

  const signIn = async () => {
    const nonceRes = await fetch('/api/nonce');

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Etherum to the app',
      uri: window.location.origin,
      version: '1',
      chainId: chain?.id,
      nonce: await nonceRes.text(),
    });

    const signature = await signMessageAsync({
      message: message.prepareMessage(),
    });

    // Verifying the signature
    const verifyRes = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        signature,
      }),
    });

    // Generate JWT
    const createJWTRes = await fetch('/api/createJWT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playbackId,
        address,
      }),
    });
    const { token } = await createJWTRes.json();

    if (verifyRes.ok) {
      setVerifiedSignature(signature);
    }
    setToken(token);
    setDisablebutton(true);

    // Decode token to get playbackId of stream
    if (token) {
      const decodedToken = jwt.decode(token) as { [key: string]: string };
      setPlaybackId(decodedToken.sub);
    }
  };

  // Logout of Siwe
  async function logOut() {
    await fetch('/api/logout', {
      method: 'POST',
    });
    setVerifiedSignature('');
    setDisablebutton(false);
  }

  // Set minimum amount of Eth in wallet to view
  const minimumEth = 0.001;

  useEffect(() => {
    if (isDisconnected) {
      setDisablebutton(false);
    }
  }, [isDisconnected]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Connect Wallet to view streams</h1>
        <div className={styles.card}>
          {/* Getting wallets */}
          <div>
            <div>
              <ConnectButton />
            </div>
          </div>
          { isConnected && Number( data?.formatted ) < minimumEth && <p className={styles.description}>Access Not Granted: Invalid funds or wallet</p> }

          {isConnected && Number(data?.formatted) > minimumEth && (
            <div>
              <button onClick={signIn} disabled={disableButton} className={styles.button}>
                Sign in with Ethereum
              </button>
              {verifySignature ? (
                <button onClick={logOut} className={styles.button}>
                  Sign Out
                </button>
              ) : (
                <></>
              )}
            </div>
          )}
          {verifySignature ? <p>Signature: {verifySignature}</p> : <></>}
        </div>
        {verifySignature && isConnected ? (
          <div className={styles.player}>
            <Player
              src={`https://livepeercdn.com/hls/${playbackId}/index.m3u8?jwt=${token}`}
              showPipButton
              loop
              autoPlay
              muted
            />
          </div>
        ) : (
          <></>
        )}
      </main>
    </div>
  );
}
```