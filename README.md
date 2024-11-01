# 🤖 Welcome to 302.AI's AI Webpage Summary! 🚀✨

[中文](README_zh.md) | [English](README.md) | [日本語](README_ja.md)

Open-source version of the [AI Webpage Summary](https://302.ai/tools/websum/) from [302.AI](https://302.ai).
You can directly log in to 302.AI for a zero-code, zero-configuration online experience.
Alternatively, customize this project to suit your needs, integrate 302.AI's API KEY, and deploy it yourself.

## ✨ About 302.AI ✨
[302.AI](https://302.ai) is a pay-as-you-go AI application platform, bridging the gap between AI capabilities and practical implementation.
1. 🧠 Comprehensive AI capabilities: Incorporates the latest in language, image, audio, and video models from leading AI brands.
2. 🚀 Advanced application development: We build genuine AI products, not just simple chatbots.
3. 💰 No monthly fees: All features are pay-per-use, fully accessible, ensuring low entry barriers with high potential.
4. 🛠 Powerful admin dashboard: Designed for teams and SMEs - managed by one, used by many.
5. 🔗 API access for all AI features: All tools are open-source and customizable (in progress).
6. 💡 Powerful development team: Launching 2-3 new applications weekly with daily product updates. Interested developers are welcome to contact us.

## Project Features
1. 📝 Webpage summary for quick understanding.
2. 🧠 Mind map for visual summary.
3. 🔗 Quick link extraction.
4. 🖼️ Image listing with zoom-in support.
4. 🌓 Dark mode for eye protection.
5. 🌐 Internationalization supporting Chinese, English, and Japanese.

## Tech Stack
- Next.js 14
- Tailwind CSS
- Shadcn UI
- Dexie.js

## Development & Deployment
1. Clone the project: `git clone https://github.com/302ai/302_webpage_summary`
2. Install dependencies: `pnpm install`
3. Configure the 302 API KEY (refer to .env.example)
4. Run the project: `pnpm dev`
5. Package and deploy: `docker build -t websum . && docker run -p 3000:3000 websum`

## Interface Preview
![1. Main Interface](docs/image-top.png)
![2. Webpage Summary](docs/image-summary.png)
![3. Mind Map](docs/image-mind-map.png)
