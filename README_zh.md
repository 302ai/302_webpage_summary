# <p align="center">📝 AI 网页总结 🚀✨</p>

<p align="center">AI网页总结支持将一个链接通过Jina Reader获取内容，并使用大语言模型对其进行总结，同时生成易于理解的脑图，并提取其中的链接和图片。</p>

<p align="center"><a href="https://302.ai/tools/word/" target="blank"><img src="https://file.302ai.cn/gpt/imgs/github/302_badge.png" /></a></p >

<p align="center"><a href="README zh.md">中文</a> | <a href="README.md">English</a> | <a href="README_ja.md">日本語</a></p>

![3. 脑图](docs/AI网页总结.png)

来自[302.AI](https://302.ai)的[AI网页总结](https://302.ai/tools/websum/)的开源版本。你可以直接登录302.AI，零代码零配置使用在线版本。或者对本项目根据自己的需求进行修改，传入302.AI的API KEY，自行部署。

## 界面预览
输入链接即可生成网页总结。
![3. 脑图](docs/网页2.png)     

生成网页脑图。
![3. 脑图](docs/网页3.png)
## 项目特性
### 📝 网页总结
  对网页进行综述性总结，快速提取网页重点。
### 🧠 脑图
  对网页进行可视化总结，快速生成脑图。
### 🔗 链接
  快速提取网页中存在的超链接。
### 🖼️ 图片
  列出所有在网页中出现过的图片，支持放大查看。
### 🌓 暗色模式
  支持暗色模式，保护您的眼睛。
### 🌍 多语言支持
  - 中文界面
  - English Interface
  - 日本語インターフェース

## 🚩 未来更新计划
- [ ] 链接有效性验证与拓展
- [ ] 增加图片分析与标注功能，比如自动识别图片主题、主体对象、大致情感氛围等，并能给图片添加相应的文字标注，便于用户在查看总结时更好地理解图片与网页整体内容的关联及作用

## 技术栈
- Next.js 14
- Tailwind CSS
- Shadcn UI
- Dexie.js

## 开发&部署
1. 克隆项目 `git clone https://github.com/302ai/302_webpage_summary`
2. 安装依赖 `pnpm install`
3. 配置302的API KEY 参考.env.example
4. 运行项目 `pnpm dev`
5. 打包部署 `docker build -t websum . && docker run -p 3000:3000 websum`


## ✨ 302.AI介绍 ✨
[302.AI](https://302.ai)是一个按需付费的AI应用平台，为用户解决AI用于实践的最后一公里问题。
1. 🧠 集合了最新最全的AI能力和品牌，包括但不限于语言模型、图像模型、声音模型、视频模型。
2. 🚀 在基础模型上进行深度应用开发，我们开发真正的AI产品，而不是简单的对话机器人
3. 💰 零月费，所有功能按需付费，全面开放，做到真正的门槛低，上限高。
4. 🛠 功能强大的管理后台，面向团队和中小企业，一人管理，多人使用。
5. 🔗 所有AI能力均提供API接入，所有工具开源可自行定制（进行中）。
6. 💡 强大的开发团队，每周推出2-3个新应用，产品每日更新。有兴趣加入的开发者也欢迎联系我们

