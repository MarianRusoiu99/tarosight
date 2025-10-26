# 🔮 TaroSight

**AI-powered tarot reading application** with multi-provider support, built with Next.js 15, TypeScript, and Prisma.

TaroSight provides mystical tarot readings using local or cloud-based AI models, featuring a modern dark-themed interface, user authentication, and a token-based reading system.

---

## ✨ Features

- 🃏 **AI-Powered Tarot Readings** - Get insightful 3-card readings (Past, Present, Future)
- 💬 **Interactive Chat** - Ask follow-up questions about your readings
- 🤖 **Multi-AI Provider Support** - Choose between Ollama (local/free) or OpenAI (cloud)
- 🔐 **User Authentication** - Secure JWT-based registration and login
- 🪙 **Token System** - Fair usage system with token-based readings
- 🌙 **Dark Theme** - Beautiful, mystical UI with dark mode
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast Development** - Next.js 15 with Turbopack for instant updates

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Beautiful icons
- **next-themes** - Dark mode support

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Relational database
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing

### AI Providers
- **Ollama** - Local AI models (llama3.2, etc.)
- **OpenAI** - Cloud AI (GPT-4, GPT-3.5)

### Architecture
- **Service/Repository Pattern** - Clean separation of concerns
- **Custom Error Handling** - Centralized error management
- **Modular Structure** - Organized by feature domains

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** database
- **AI Provider**: Either [Ollama](https://ollama.com) (local) or [OpenAI API key](https://platform.openai.com/api-keys) (cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MarianRusoiu99/tarosight.git
   cd tarosight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```bash
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/tarosight?schema=public"
   
   # Authentication
   JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
   
   # AI Provider (choose one)
   AI_PROVIDER="ollama"  # or "openai"
   
   # For Ollama (local)
   OLLAMA_API_URL="http://localhost:11434"
   OLLAMA_MODEL="llama3.2"
   
   # For OpenAI (cloud)
   # OPENAI_API_KEY="sk-your-api-key-here"
   # OPENAI_MODEL="gpt-4o-mini"
   ```

4. **Set up the database**
   ```bash
   # Create database
   createdb tarosight
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed with default user (optional)
   npx prisma db seed
   ```

5. **Set up AI provider**

   **Option A: Ollama (Local, Free)**
   ```bash
   # Install Ollama from https://ollama.com
   # Pull a model
   ollama pull llama3.2
   
   # Start Ollama
   ollama serve
   ```

   **Option B: OpenAI (Cloud, Paid)**
   - Get API key from https://platform.openai.com/api-keys
   - Add to `.env`: `OPENAI_API_KEY="sk-..."`
   - Set `AI_PROVIDER="openai"`

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Usage

### Creating an Account

1. Click **Sign Up** in the navigation
2. Enter email, username, and password
3. You'll receive **10 free tokens** to start

### Getting a Reading

1. Navigate to the **Tarot** page
2. Click **Get Reading** (costs 1 token)
3. View your 3-card reading with AI interpretation
4. Ask follow-up questions in the chat

### Managing Tokens

- Each reading costs **1 token**
- Check remaining tokens in the navigation bar
- Future: Token purchase system planned

---

## 🏗️ Project Structure

```
tarosight/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── login/                # Authentication endpoints
│   │   ├── register/
│   │   ├── tarot/                # Tarot reading endpoints
│   │   └── user/                 # User management
│   ├── login/                    # Login page
│   ├── tarot/                    # Tarot reading page
│   └── layout.tsx                # Root layout
├── src/
│   ├── infrastructure/           # External integrations
│   │   ├── ai/                   # AI provider clients
│   │   │   ├── ai.client.ts      # Unified AI factory
│   │   │   ├── ollama.client.ts  # Ollama integration
│   │   │   └── openai.client.ts  # OpenAI integration
│   │   ├── config/               # Configuration
│   │   └── database/             # Prisma client
│   ├── modules/                  # Feature domains
│   │   ├── auth/                 # Authentication logic
│   │   ├── tarot/                # Tarot business logic
│   │   └── user/                 # User management
│   └── shared/                   # Shared utilities
│       ├── errors/               # Custom error classes
│       ├── middleware/           # Auth & error handlers
│       ├── security/             # Password hashing
│       └── utils/                # Common utilities
├── components/                   # React components
│   └── ui/                       # shadcn/ui components
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Seed script
│   └── migrations/               # Database migrations
├── docs/                         # Documentation
│   └── AI_PROVIDER_SETUP.md      # AI setup guide
└── public/                       # Static assets
    └── tarot_decks/              # Tarot card images
```

---

## 🔄 AI Provider Configuration

TaroSight supports switching between AI providers via environment variables:

### Ollama (Local)
✅ Free and unlimited  
✅ Data stays local  
✅ Works offline  

```bash
AI_PROVIDER="ollama"
OLLAMA_API_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.2"
```

### OpenAI (Cloud)
✅ More powerful models  
✅ Better response quality  
✅ No local setup  

```bash
AI_PROVIDER="openai"
OPENAI_API_KEY="sk-your-key"
OPENAI_MODEL="gpt-4o-mini"
```

For detailed setup instructions, see [docs/AI_PROVIDER_SETUP.md](docs/AI_PROVIDER_SETUP.md)

---

## 🗄️ Database Schema

### User
- Email, username, password (hashed)
- Token balance for readings
- Profile image support

### Reading
- User relationship
- AI-generated interpretation
- Card selection (3-card spread)
- Timestamp

---

## 🧪 Development

### Available Scripts

```bash
npm run dev       # Start development server (Turbopack)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

### Database Management

```bash
npx prisma studio           # Open Prisma Studio GUI
npx prisma migrate dev      # Create and apply migration
npx prisma migrate reset    # Reset database
npx prisma db seed          # Seed database
npx prisma generate         # Generate Prisma Client
```

### Default Seed User

After running `npx prisma db seed`:
- **Email**: admin@example.com
- **Username**: admin
- **Password**: password
- **Tokens**: 100

---

## 🔐 Security Features

- ✅ **Password Hashing** - bcrypt with 12 salt rounds
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **HTTP-only Cookies** - Protection against XSS
- ✅ **Protected Routes** - Middleware-based authentication
- ✅ **Input Validation** - Server-side validation
- ✅ **Error Handling** - No sensitive data leakage

---

## 🎨 UI Components

Built with **shadcn/ui** and **Tailwind CSS**:
- Button, Card, Input components
- Dark theme with mystical purple accents
- Responsive navigation
- Loading states
- Error messages

---

## 🐛 Troubleshooting

### Database Connection Errors
```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env
# Ensure database exists
createdb tarosight
```

### Ollama Connection Errors
```bash
# Check Ollama is running
ollama list

# Start Ollama
ollama serve

# Verify model is pulled
ollama pull llama3.2
```

### OpenAI API Errors
- Verify API key is correct and starts with `sk-`
- Check your OpenAI account has credits
- Review rate limits on your plan

### JWT Errors
- Ensure `JWT_SECRET` is at least 32 characters
- Generate secure key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 🚧 Roadmap

- [ ] Token purchase system
- [ ] Reading history page
- [ ] Multiple spread types (Celtic Cross, etc.)
- [ ] Tarot card database with meanings
- [ ] Social sharing of readings
- [ ] Mobile app (React Native)
- [ ] More AI providers (Anthropic Claude, etc.)
- [ ] Personalized readings based on history

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing framework
- **Prisma Team** - Excellent ORM
- **shadcn** - Beautiful UI components
- **Ollama** - Local AI made easy
- **OpenAI** - Powerful AI models
- **Tarot Community** - Spiritual inspiration

---

## 📧 Contact

**Marian Rusoiu** - [@MarianRusoiu99](https://github.com/MarianRusoiu99)

**Project Link**: [https://github.com/MarianRusoiu99/tarosight](https://github.com/MarianRusoiu99/tarosight)

---

<div align="center">
  <p>Made with 🔮 and ❤️</p>
  <p><i>The cards reveal what the AI interprets...</i></p>
</div>
