# 🌟 3D Outfit Builder

A cutting-edge web application that lets users create, customize, and visualize outfits in stunning 3D. Built with Next.js, Three.js, and Supabase.

## 🚀 What You'll Need

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **VS Code** - [Download here](https://code.visualstudio.com/)
- **Supabase Account** - [Sign up free](https://supabase.com/)
- **Git** - [Download here](https://git-scm.com/)

## ⚡ Quick Setup (5 minutes)

### 1. Clone & Install
\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd 3d-outfit-builder

# Install dependencies
npm install
\`\`\`

### 2. Setup Environment Variables
Create a `.env.local` file in your project root:

\`\`\`bash
# Copy the example file
cp .env.example .env.local
\`\`\`

Add your Supabase credentials to `.env.local`:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

**Where to find these:**
- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Select your project → Settings → API
- Copy the values from the "Project URL" and "API Keys" sections

### 3. Setup Database
In your Supabase dashboard, go to SQL Editor and run these scripts **in order**:

1. `scripts/00-complete-database-setup.sql` - Creates all tables
2. `scripts/16-add-missing-tables.sql` - Adds additional tables
3. `scripts/14-add-onboarding-field.sql` - Adds user onboarding
4. `scripts/15-optimize-rls-policies.sql` - Security policies
5. `scripts/17-add-foreign-key-indexes.sql` - Performance indexes
6. `scripts/18-optimize-profiles-indexes.sql` - Profile optimization
7. `scripts/20-fix-storage-rls.sql` - Storage permissions

### 4. Run the Application
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` - You should see the landing page! 🎉

## 🛠️ VS Code Setup

### Essential Extensions
Install these extensions for the best development experience:

1. **ES7+ React/Redux/React-Native snippets** - Code snippets
2. **Tailwind CSS IntelliSense** - CSS class suggestions
3. **TypeScript Importer** - Auto-import management
4. **Prettier** - Code formatting
5. **Auto Rename Tag** - HTML/JSX tag renaming

### Recommended Settings
Add to your VS Code `settings.json`:
\`\`\`json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
\`\`\`

### Using the Terminal
- **Open Terminal**: `Ctrl+`` (backtick) or View → Terminal
- **Run Commands**: Type commands like `npm run dev` and press Enter
- **Stop Server**: Press `Ctrl+C` in the terminal

## 🧪 Test Your Setup

Visit these URLs to verify everything works:

- **🏠 Homepage**: `http://localhost:3000`
- **🔐 Login**: `http://localhost:3000/auth/login`
- **📊 Health Check**: `http://localhost:3000/api/health`
- **🔧 Test Connection**: `http://localhost:3000/test-connection`

## 🐛 Common Issues & Solutions

### ❌ "Module not found" errors
\`\`\`bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

### ❌ Supabase connection errors
1. Check your `.env.local` file has the correct values
2. Verify your Supabase project is active
3. Test connection at `/test-connection`

### ❌ Database errors
1. Make sure you ran ALL SQL scripts in order
2. Check Supabase Dashboard → Database → Tables exist
3. Verify RLS policies are enabled

### ❌ Build/deployment errors
\`\`\`bash
# Clear Next.js cache
rm -rf .next
npm run build
\`\`\`

## 🔍 Debugging Workflow

### 1. Check Browser Console
- Press `F12` → Console tab
- Look for red error messages
- Copy the full error message for help

### 2. Check VS Code Problems
- View → Problems panel
- Fix any TypeScript errors shown

### 3. Check Network Tab
- F12 → Network tab
- Look for failed requests (red status codes)
- Check if API calls are working

### 4. Check Supabase Logs
- Supabase Dashboard → Logs
- Look for database errors or auth issues

## 📁 Project Structure

\`\`\`
3d-outfit-builder/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Authentication components
├── lib/                   # Utility functions
├── scripts/               # Database setup scripts
└── public/               # Static assets
\`\`\`

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Visit [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Import Project" → Select your GitHub repo
4. Add environment variables in Vercel settings
5. Deploy! 🎉

### Environment Variables for Production
Add these in your Vercel dashboard:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
\`\`\`

## 📚 Quick Commands Reference

\`\`\`bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality

# Troubleshooting
rm -rf .next         # Clear Next.js cache
rm -rf node_modules  # Clear dependencies
npm install          # Reinstall dependencies
\`\`\`

## 🆘 Need Help?

### If you're stuck:
1. **Check the troubleshooting section above**
2. **Look at browser console errors** (F12 → Console)
3. **Verify your environment variables** are correct
4. **Make sure all database scripts** were run successfully
5. **Try the test URLs** to isolate the issue

### Still having issues?
- Check if your issue is in the GitHub Issues
- Create a new issue with:
  - What you were trying to do
  - The exact error message
  - Your browser and OS
  - Screenshots if helpful

## 🎯 Features

- **🎨 3D Avatar Customization** - Height, build, skin tone, hair color
- **👕 Virtual Clothing** - Shirts, pants, shoes with color options
- **🎮 Interactive 3D Scene** - Drag to rotate, scroll to zoom
- **💾 Save Outfits** - Create and manage your favorite looks
- **🔐 User Authentication** - Secure login with email verification
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **⚡ Real-time Updates** - Instant visual feedback
- **🛒 Shopping Integration** - Browse and purchase items

## 🏗️ Built With

- **Next.js 14** - React framework with App Router
- **Three.js** - 3D graphics and visualization
- **Supabase** - Database and authentication
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type-safe development
- **shadcn/ui** - Beautiful UI components

---

**Happy coding! 🚀** If you build something cool with this, we'd love to see it!
