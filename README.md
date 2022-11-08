# ![Livepeer Studio Logo](public/favicon.ico) Livepeer Studio Sample App 

A sample application that demonstrates the features of Plyaback Policy for Livepeer Studio

>NOTE: This app uses the Goerli testnest and requires the wallet to contain at least 0.001 testnet Eth 

# ⏱ Quick Start

Prerequisites: [Node (v16 LTS)](https://nodejs.org/en/download/) plus [npm](https://docs.npmjs.com/cli/v8/configuring-npm/install) and [Git](https://git-scm.com/downloads)

> clone/fork 🎥 Livepeer Studio Playback Policy App:

```bash
git clone git@github.com:livepeer/Playback-Policy-Sample-App.git
```

> install Playback Policy App and dependencies:

```bash
cd playback-policy-sample-app
npm install
```

> start Playback Policy Sample App:

```bash
npm run dev
```

🔏 Setup environment Variable:

This sample app uses an API key from a monitored account made for public use. When customizing this for your own use,  setup a `.env` file and store you API key there for security.
>Make sure to include the `.env` in the `.gitignore`

- [What are environment variables](https://www.freecodecamp.org/news/what-are-environment-variables-and-how-can-i-use-them-with-gatsby-and-netlify/)

- [dotenv](https://www.npmjs.com/package/dotenv)

- [Environment variables in NextJS](https://nextjs.org/docs/basic-features/environment-variables)

## Additional information

[Playback Policy with LivepeerJS SDK](https://livepeerjs.org/examples/react/access-control)

### For a more in-depth guide, [visit this page](/Guide/PlaybackPolicyGuide.md).