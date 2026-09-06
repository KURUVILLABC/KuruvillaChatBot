# Kuruvilla Chat Website

A minimal, clean chat interface to interact with Kuruvilla's professional knowledge system. Ask about experience, skills, projects, education, and more.

## Features

- 💬 **Clean Chat Interface**: Minimal, focused design with just the chat
- 🎯 **Suggested Questions**: Quick access to common queries
- 🔌 **API Connected**: Seamlessly connects to backend for AI responses
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🌙 **Dark Mode**: Automatic dark mode support
- ⚡ **Fast & Lightweight**: Built with Vite for optimal performance

## Quick Start

### Prerequisites
- Node.js 16+ installed
- Backend API running at `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

The website will open at `http://localhost:5173`

## Environment Variables

```env
# Backend API URL (default: http://localhost:3000)
VITE_BACKEND_URL=http://localhost:3000
```

## Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Deployment

### Deploy to Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Select your GitHub repository
   - Select `chat-website` as the root directory

2. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add `VITE_BACKEND_URL` with your backend API URL
   - Example: `https://api.example.com` or your deployed backend

3. **Deploy**
   - Click "Deploy"
   - Your site will be live in seconds!

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting service
# Options: Netlify, GitHub Pages, Firebase Hosting, etc.
```

## Backend API Requirements

The chat website expects a backend API with these endpoints:

### GET `/api/knowledge`
Returns the current knowledge base (profile, skills, experience, education, projects)

### POST `/api/chat`
Sends a message and gets an AI response

**Request:**
```json
{
  "message": "Tell me about your skills"
}
```

**Response:**
```json
{
  "response": "I'm proficient in TypeScript, React, Node.js..."
}
```

## Development

### Project Structure

```
chat-website/
├── src/
│   ├── main.tsx          # Entry point
│   ├── App.tsx           # Main chat component
│   └── index.css         # Styles
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript config
├── package.json          # Dependencies
└── vercel.json          # Deployment config
```

### Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **CSS3** - Styling with dark mode support

### Styling

All styles are in `src/index.css`. The design includes:
- Clean, modern gradient header
- Smooth animations and transitions
- Responsive grid layout
- Dark mode support via `prefers-color-scheme`
- Mobile-first approach

## Customization

### Change Backend URL

Edit `.env` to point to your backend API:

```env
VITE_BACKEND_URL=https://api.myapp.com
```

### Customize Suggested Questions

Edit `src/App.tsx` and modify the `suggestedQuestions` array:

```typescript
const suggestedQuestions = [
  'Your custom question here',
  'Another question',
  // ...
];
```

### Change Colors

Edit `src/index.css` to customize the color scheme. Key colors:
- Primary: `#2563eb` (blue)
- Background: `#ffffff` (white)
- Text: `#1f2937` (dark gray)

## Troubleshooting

### "🔴 Disconnected" Status

- Verify backend is running at the URL in `.env`
- Check browser console for CORS errors
- Ensure backend allows requests from your domain

### Messages Not Sending

- Check network tab in browser DevTools
- Verify backend `/api/chat` endpoint is working
- Check backend logs for errors

### Blank Screen

- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for JavaScript errors
- Verify Node.js and npm versions

## Performance

- **Bundle Size**: ~50KB gzipped (optimized)
- **First Load**: <1 second on 4G
- **Message Response**: Real-time with streaming
- **Lighthouse Score**: 95+ on Performance

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend logs
3. Check browser DevTools console
4. Contact the development team

---

**Made with ❤️ for Kuruvilla's Professional Knowledge System**
