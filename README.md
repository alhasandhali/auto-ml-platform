# AI Auto ML Platform 🚀

> **🚧 Work in Progress**
> This project is currently under active development and is not yet complete. Features, UI, and documentation are subject to change.

A modern, intelligent Data Science dashboard built with Next.js that empowers users to seamlessly upload datasets, visualize statistical properties, and instantly generate comprehensive data science reports using local AI inference.

## 🌟 Features

- **Seamless File Upload**: Drag-and-drop or click to upload `.csv` and `.xlsx` datasets. The platform instantly parses and previews up to 5,000 rows right in your browser.
- **Dynamic Statistical Dashboard**:
  - **Missing Values**: Instantly spot data sparsity.
  - **Feature Distributions**: Interactive histograms to understand numeric spread.
  - **Correlation Heatmap**: Real-time Pearson correlation matrix for feature analysis.
  - **Class Distribution**: Interactive pie charts for target variables.
- **AI Data Scientist Integration**: Click the "Generate AI Report" button to have a local LLM analyze the statistical footprint of your dataset. It outputs a beautifully formatted Markdown report with insights on data quality, feature engineering, and model recommendations.
- **Privacy First**: AI reporting relies on your local [Ollama](https://ollama.com/) instance, meaning your data context never leaves your machine.

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Spreadsheet Parsing**: [SheetJS (xlsx)](https://sheetjs.com/)
- **AI Integration**: [Ollama](https://ollama.com/) (`llama3.2`)
- **Backend Analytics**: FastAPI (proxied through Next.js)

## 🚀 Getting Started

### Prerequisites
1. **Node.js**: Ensure you have Node.js v18+ installed.
2. **Ollama**: Download and install [Ollama](https://ollama.com/).
3. Pull the AI model by running: 
   ```bash
   ollama pull llama3.2
   ```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/alhasandhali/auto-ml-platform.git
   cd auto-ml-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   FASTAPI_URL=https://dataset-api-fastapi.onrender.com
   OLLAMA_BASE_URL=http://127.0.0.1:11434
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment Notes (Vercel)

The frontend is fully optimized for Vercel deployment. However, **Vercel's cloud servers cannot access your local Ollama instance (`http://127.0.0.1:11434`)**. 

If you deploy this project to Vercel, you must either:
1. Use a tool like **Ngrok** or **Cloudflare Tunnels** to expose your local Ollama port to the internet, and update the `OLLAMA_BASE_URL` environment variable in Vercel to your public tunnel URL.
2. Swap the Ollama API call with a cloud-hosted LLM API (like OpenAI, Groq, or Together AI) in production.

## 📄 License
This project is open-source and available under the MIT License.
