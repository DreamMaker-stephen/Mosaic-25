
# Mosaic-25

Mosaic-25 是一个驱9/25 宫格图片拆分与打包工具。它可以帮助用户快速将单张图片切分为适合社交媒体展示的宫格图。


需求背景：即梦新出的seedance2.0模型，可以生成九宫格二十五宫，部分玩家需求替换其中的某一个镜头后，重新打包上传，所以做了个小应用。可以将一张图 分拆出25张图，也可以直接在当前页面替换掉某一个镜头后重新合并成一张图。


![项目封面](https://www.zaomengshi.cn/favicon.ico) 

## 🚀 功能特性

- **多模式切分**：支持 9 宫格（3x3）和 25 宫格（5x5）快速拆分。
- **在线预览**：切分后可立即预览每个网格的效果。
- **一键打包**：支持将切分后的图片快速导出和打包。

## 🛠️ 本地开发指南

### 前置条件
- 已安装 [Node.js](https://nodejs.org/) (推荐 LTS 版本)
- 拥有一个 [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone [https://github.com/DreamMaker-stephen/Mosaic-25.git](https://github.com/DreamMaker-stephen/Mosaic-25.git)
   cd Mosaic-25
安装依赖

Bash  巴什
npm install
配置环境变量 在项目根目录下创建一个 .env.local 文件，并添加你的 API Key：

Code snippet  代码片段
VITE_GEMINI_API_KEY=你的_GEMINI_API_KEY
启动开发服务器

Bash  巴什
npm run dev
访问控制台输出的地址（通常是 http://localhost:5173）即可查看。

📦 部署
本项目支持通过 GitHub Actions 自动部署到 GitHub Pages。

确保在 GitHub 项目设置中开启了 Pages 功能。

每次合并代码到 main 分支时，工作流会自动构建并发布。

📄 开源协议
本项目采用 MIT License 开源。

访问官网: 造梦师 (zaomengshi.cn)
