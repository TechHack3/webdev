# 🎨 AI Image Enhancer

> Transform your images with the power of AI! A modern, fast, and intuitive image enhancement tool built with React and powered by cutting-edge AI technology.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.0.0
- **Styling**: Tailwind CSS 4.0.17
- **Animations**: Framer Motion 12.6.2
- **Build Tool**: Vite 6.2.0
- **Icons**: Lucide React
- **API**: picWish API (for image enhancement)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/manabbiswas/ai-image-enhancer.git
   cd ai-image-enhancer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to http://localhost:5173

### Building for Production

```bash
npm run build
# or
yarn build
```

## 🎯 Usage

### Upload an Image
- Drag and drop an image file onto the upload area
- Or click to browse and select an image file
- **Supported formats**: JPG, PNG, WEBP, GIF

### Enhance Your Image
- Click the "Enhance Image" button
- Wait for the AI processing to complete
- View the enhanced result alongside the original

### Download Results
- Click the "Download" button to save the enhanced image
- The image will be saved to your default download folder

### Start Over
- Click the "X" button to clear and upload a new image

## 📁 Project Structure

```
ai-image-enhancer/
├── public/
│   └── vite.svg
├── src/
│   ├── Components/
│   │   ├── Footer.jsx
│   │   ├── ImagePreview.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── Navbar.jsx
│   │   └── TypingEffect.jsx
│   ├── Pages/
│   │   └── Home.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
├── package-lock.json
├── .gitignore
├── .env
├── .env.example
├── README.md
├── tailwind.config.js
└── vite.config.js
```

## 🔧 env Configuration
Use the `.env.example` file to configure your environment variables(ApiKey).


### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 🙏 Acknowledgments

- **Made by**: Manab Biswas
- **Powered by**: picWish API
- **Special thanks to**: Sheryian Coding School
- **Icons**: Lucide React
- **Animations**: Framer Motion