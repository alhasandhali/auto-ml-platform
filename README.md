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

## 📄 License
This project is open-source and available under the MIT License.
