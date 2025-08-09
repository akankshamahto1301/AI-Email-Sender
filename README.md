# AI Emailinator

A full-stack AI-powered email generator and sender built with Next.js, Tailwind CSS, shadcn/ui, and Google's Gemini AI.

## Features

- 🤖 **AI Email Generation**: Generate professional emails using Google's Gemini AI
- 📧 **Multi-recipient Support**: Send emails to multiple recipients at once
- ✏️ **Editable Content**: Edit generated emails before sending
- 🎨 **Beautiful UI**: Clean, minimal design with shadcn/ui components
- 📱 **Responsive**: Works on desktop and mobile devices
- ⚡ **Fast**: Built with Next.js and optimized for performance

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd emailinator
npm install
```

### 2. Environment Configuration

Copy the environment template:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your API keys:

#### Get Gemini API Key:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to `GEMINI_API_KEY` in `.env.local`

#### Email Configuration (for Gmail):

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password
3. Add your email and app password to `.env.local`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

### 3. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Add Recipients**: Enter email addresses of people you want to send emails to
2. **Create Prompt**: Describe what kind of email you want to generate
3. **Generate Email**: Click "Generate Email" to create AI-powered content
4. **Edit Content**: Review and modify the generated subject and body
5. **Send Email**: Click "Send" to deliver the email to all recipients

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI**: Google Gemini AI
- **Email**: Nodemailer
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate-email/   # AI email generation endpoint
│   │   └── send-email/       # Email sending endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── EmailGenerator.tsx    # Main email generator component
└── lib/
    └── utils.ts              # Utility functions
```

## Environment Variables

| Variable         | Description                 | Required                 |
| ---------------- | --------------------------- | ------------------------ |
| `GEMINI_API_KEY` | Google Gemini AI API key    | Yes                      |
| `EMAIL_HOST`     | SMTP server host            | Yes (for sending emails) |
| `EMAIL_PORT`     | SMTP server port            | Yes (for sending emails) |
| `EMAIL_USER`     | Email username              | Yes (for sending emails) |
| `EMAIL_PASS`     | Email password/app password | Yes (for sending emails) |
| `EMAIL_FROM`     | From email address          | Yes (for sending emails) |

## License

MIT License
