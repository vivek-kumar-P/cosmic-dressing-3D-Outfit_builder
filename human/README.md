# 🎨 3D Outfit Builder - Complete Documentation

A powerful, interactive 3D outfit customization platform built with Next.js, React Three Fiber, and Supabase. This application allows users to visualize, customize, and interact with 3D character models in real-time with a professional asset management system.

![3D Outfit Builder](https://via.placeholder.com/1200x600?text=3D+Outfit+Builder+-+Interactive+3D+Model+Customization)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation Guide](#-installation-guide-for-beginners)
- [Environment Variables](#-environment-variables-setup)
- [Database Setup](#-database-setup)
- [Running Locally](#-running-the-project-locally)
- [Project Structure](#-project-structure)
- [Core Functionality](#-core-functionality)
- [3D Asset Management](#-3d-asset-management)
- [MultiModel System](#-multimodel-system-explained)
- [Sidebar Documentation](#-sidebar-documentation)
- [Important Components](#-important-components-point-breakers)
- [Error Handling Guide](#-error-handling-guide)
- [Troubleshooting](#-troubleshooting-common-errors)
- [Terminal Commands](#-terminal-commands-reference)
- [Contributing](#-contributing)

---

## ✨ Features

### Core Features
- **🎭 3D Model Viewer**: Interactive 3D visualization using React Three Fiber and Three.js
- **📦 Multiple Format Support**: Upload .glb and .gltf model files
- **👥 Dual Model System**: Separate body and clothing models for independent control
- **🎨 Real-time Customization**: Change colors and toggle clothing items instantly
- **🎬 Animation Controls**: Play, pause, and adjust animation speed
- **📂 Asset Library**: Complete CRUD operations for managing all 3D assets
- **🗂️ Category System**: Organize items by type (Character, Shoes, Pants, Shirts, Accessories)
- **☁️ Cloud Storage**: Automatic upload to Vercel Blob with Supabase database integration
- **💾 Persistent Storage**: All models saved with metadata and categories
- **🔄 Real-time Sync**: Database changes reflect immediately in the UI

### UI/UX Features
- **📱 Responsive Design**: Works on mobile, tablet, and desktop
- **🔍 Search Functionality**: Filter assets by name
- **🎨 Color Pickers**: Individual color customization with skin tone presets
- **💡 Lighting Controls**: Adjust ambient and directional lighting
- **📷 Camera Controls**: Rotate, zoom, and pan the 3D view
- **✨ Visual Feedback**: Hover states, selection indicators, smooth transitions
- **📊 Statistics**: Real-time counts for each category

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS v4.1.9** - Utility-first styling
- **React Three Fiber 9.4.0** - React renderer for Three.js
- **Three.js 0.180.0** - 3D graphics library
- **@react-three/drei 10.7.6** - Useful helpers for R3F

### Backend & Storage
- **Supabase** (@supabase/ssr 0.7.0) - PostgreSQL database
- **Vercel Blob** (@vercel/blob 2.0.0) - File storage for 3D models
- **Server Actions** - Next.js server-side functions

### UI Components
- **shadcn/ui** - Pre-built accessible components
- **Radix UI** - Headless UI primitives
- **Lucide React 0.454.0** - Icon library
- **Sonner 1.7.4** - Toast notifications

---

## 📚 Prerequisites

Before installing, make sure you have:

### Required Software
- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js (or use yarn/pnpm)
- **Git**: For cloning the repository ([Download](https://git-scm.com/))

### Required Accounts (Free Tier Available)
- **Supabase Account**: [Sign up at supabase.com](https://supabase.com)
- **Vercel Account**: [Sign up at vercel.com](https://vercel.com)

### Recommended Tools
- **VS Code**: Code editor ([Download](https://code.visualstudio.com/))
- **Blender**: For converting FBX to GLB ([Download](https://www.blender.org/))

---

## 🚀 Installation Guide (For Beginners)

Follow these steps carefully to set up the project on your local machine.

### Step 1: Install Node.js

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the prompts
4. Verify installation by opening terminal/command prompt and typing:
   \`\`\`bash
   node --version
   npm --version
   \`\`\`
   You should see version numbers like `v18.x.x` and `9.x.x`

### Step 2: Clone the Repository

1. Open Terminal (Mac/Linux) or Command Prompt (Windows)
2. Navigate to where you want the project:
   \`\`\`bash
   cd Desktop  # or any folder you prefer
   \`\`\`
3. Clone the repository:
   \`\`\`bash
   git clone <your-repository-url>
   cd 3d-outfit-builder
   \`\`\`

### Step 3: Install Project Dependencies

This will install all required packages listed in package.json:

\`\`\`bash
npm install
\`\`\`

**This may take 2-5 minutes**. You'll see a progress bar and lots of text scrolling.

**Common Issues:**
- If you see `EACCES` permission errors, try: `sudo npm install` (Mac/Linux)
- If you see `EPERM` errors on Windows, run Command Prompt as Administrator

### Step 4: Set Up Environment Variables

1. Create a file named `.env.local` in the root folder
2. Copy the content from the [Environment Variables section](#-environment-variables-setup) below
3. Replace all placeholder values with your actual keys

**Don't skip this step!** The app won't work without these variables.

### Step 5: Set Up Supabase Database

See the detailed [Database Setup](#-database-setup) section below.

### Step 6: Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open your browser and go to: [http://localhost:3000](http://localhost:3000)

🎉 **You should now see the 3D Outfit Builder!**

---

## 🔐 Environment Variables Setup

Create a `.env.local` file in the root directory with these variables:

\`\`\`env
# ============================================
# SUPABASE DATABASE CONFIGURATION
# ============================================
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# ============================================
# POSTGRES DATABASE (From Supabase)
# ============================================
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/database

POSTGRES_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
POSTGRES_PRISMA_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_database_password
POSTGRES_DATABASE=postgres
POSTGRES_HOST=db.YOUR_PROJECT_ID.supabase.co

# ============================================
# VERCEL BLOB STORAGE
# ============================================
# Get this from: https://vercel.com/dashboard/stores

BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXXX

# ============================================
# SITE CONFIGURATION
# ============================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### How to Get Each Key:

#### Supabase Keys:
1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project (if you don't have one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)
5. Go to **Settings** → **Database**
6. Copy the connection strings and fill in the `POSTGRES_*` variables

#### Vercel Blob Token:
1. Go to [vercel.com](https://vercel.com) and sign in
2. Create a new project (or use existing)
3. Go to **Storage** → **Create Database** → **Blob**
4. Copy the `BLOB_READ_WRITE_TOKEN`

---

## 🗄️ Database Setup

The app requires a Supabase database table to store 3D models. Follow these steps:

### Method 1: Using the App (Easiest)

1. Start the development server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. You'll see a **"Setup Database"** button
4. Click it and follow the instructions
5. Copy the SQL script shown
6. Paste it in Supabase SQL Editor (step 6 below)
7. Click "Test Connection" to verify

### Method 2: Manual Setup (Recommended for Understanding)

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the SQL script from `scripts/setup-models-table.sql`:

\`\`\`sql
-- Create the models table
CREATE TABLE IF NOT EXISTS models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  file_size INTEGER,
  is_permanent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_models_category ON models(category);
CREATE INDEX IF NOT EXISTS idx_models_created_at ON models(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_models_is_permanent ON models(is_permanent);

-- Enable Row Level Security (RLS)
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust for production)
CREATE POLICY "Allow all operations" ON models FOR ALL USING (true);
\`\`\`

5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"
7. Verify the table exists by going to **Table Editor** → **models**

### What This Table Stores:

- **id**: Unique identifier for each model
- **name**: Display name (e.g., "Default Body", "Blue Shirt")
- **url**: Vercel Blob URL where the .glb file is stored
- **category**: Type of model (character, shirt, shoes, pants, tshirt, accessories)
- **file_size**: Size of the .glb file in bytes
- **is_permanent**: Prevents deletion of default models
- **created_at**: Timestamp when the model was uploaded

### Seeding Default Models:

After setting up the table, seed it with default models:

1. Click the **"Seed Models"** button in the app
2. This will add 8 default models:
   - Default Body (male character)
   - Woman Default (female character)
   - Various clothing items

---

## 💻 Running the Project Locally

### Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The app will be available at: [http://localhost:3000](http://localhost:3000)

### Build for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

### Run on Different Port

\`\`\`bash
PORT=3001 npm run dev
\`\`\`

---

## 📁 Project Structure

\`\`\`
3d-outfit-builder/
├── app/                                    # Next.js App Router
│   ├── page.tsx                           # Main application page
│   ├── layout.tsx                         # Root layout with fonts
│   └── globals.css                        # Global styles + design tokens
│
├── components/
│   ├── 3d-viewer/                         # 3D Visualization Components
│   │   ├── scene.tsx                      # Main 3D scene container
│   │   ├── model.tsx                      # Single model renderer
│   │   ├── dual-model.tsx                 # Body + clothing dual system
│   │   ├── multi-model.tsx                # Multiple clothing items system
│   │   ├── light-control.tsx              # Lighting adjustment UI
│   │   └── color-picker.tsx               # Color customization UI
│   │
│   ├── outfit-builder/                    # Outfit Builder UI
│   │   ├── category-sidebar.tsx           # Left sidebar with categories
│   │   └── playground-panel.tsx           # Right panel with controls
│   │
│   ├── asset-manager/                     # Asset Management System
│   │   └── asset-library-modal.tsx        # Full CRUD for 3D assets
│   │
│   ├── database-setup-button.tsx          # Database initialization UI
│   └── ui/                                # shadcn/ui components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       └── ... (30+ components)
│
├── hooks/
│   ├── use-mobile.tsx                     # Mobile detection hook
│   └── use-toast.ts                       # Toast notification hook
│
├── lib/
│   ├── actions/                           # Server Actions
│   │   ├── model-actions.ts               # Model CRUD operations
│   │   └── setup-database.ts              # Database setup utilities
│   │
│   ├── model-utils.ts                     # 3D model helper functions
│   ├── supabase.ts                        # Supabase client setup
│   └── utils.ts                           # General utilities (cn, etc.)
│
├── scripts/                               # Database Scripts
│   ├── setup-models-table.sql             # Initial table creation
│   └── add-is-permanent-column.sql        # Migration script
│
├── types/
│   └── index.ts                           # TypeScript type definitions
│
├── public/                                # Static Assets
│   ├── scene.gltf                         # Default 3D model
│   └── scene.bin                          # Model binary data
│
├── .env.local                             # Environment variables (create this)
├── package.json                           # Dependencies
├── tsconfig.json                          # TypeScript config
├── next.config.mjs                        # Next.js config
├── postcss.config.mjs                     # PostCSS config
└── README.md                              # This file
\`\`\`

---

## 🎯 Core Functionality

### 1. 3D Model Rendering

**How it works:**
- Uses **React Three Fiber** (R3F) to render Three.js in React
- Models are loaded using `useGLTF` hook from @react-three/drei
- Automatic normalization to 1.8m height (average human height)
- Models are centered at origin (0,0,0) with feet at ground level

**Code location:** `components/3d-viewer/scene.tsx`

**Key concepts:**
\`\`\`typescript
// Load a 3D model
const { scene, animations } = useGLTF(modelUrl)

// Normalize to 1.8m height
const height = boundingBox.max.y - boundingBox.min.y
const scale = 1.8 / height
scene.scale.setScalar(scale)

// Center at origin
scene.position.set(0, 0, 0)
\`\`\`

### 2. Material & Color System

**How it works:**
- Preserves original materials (textures, normal maps, roughness)
- Only changes the color property
- Supports both textured and non-textured models

**Code location:** `lib/model-utils.ts`

**Key concepts:**
\`\`\`typescript
// Change color without replacing material
material.color.set(newColor)
material.needsUpdate = true

// Skin color with emissive blend for textured models
if (material.map) {
  material.emissive.set(skinColor)
  material.emissiveIntensity = 0.3
}
\`\`\`

### 3. Animation System

**How it works:**
- Detects animations in GLTF file
- Creates AnimationMixer to play animations
- Controls playback speed and play/pause

**Code location:** `components/3d-viewer/dual-model.tsx`

**Key concepts:**
\`\`\`typescript
// Create animation mixer
const mixer = new THREE.AnimationMixer(scene)

// Play animation
const action = mixer.clipAction(animations[0])
action.play()

// Update in render loop
mixer.update(delta)
\`\`\`

### 4. Database Integration

**How it works:**
- Uploads .glb files to Vercel Blob storage
- Stores metadata (name, URL, category) in Supabase
- Real-time sync between database and UI

**Code location:** `lib/actions/model-actions.ts`

**Key concepts:**
\`\`\`typescript
// Upload to Vercel Blob
const blob = await put(filename, file, {
  access: 'public',
  contentType: 'model/gltf-binary'
})

// Save to Supabase
const { data, error } = await supabase
  .from('models')
  .insert({
    name: filename,
    url: blob.url,
    category: category,
    file_size: file.size
  })
\`\`\`

---

## 🗂️ 3D Asset Management

### Asset Library Interface

The Asset Library is a comprehensive management system for all 3D models.

**Access:** Click **"Asset Library"** button in the top navigation bar

**Features:**
- ✅ View all uploaded and default models
- ✅ Search by name
- ✅ Filter by category (All, Characters, Clothing, My Uploads)
- ✅ Create: Upload new models
- ✅ Read: View model details
- ✅ Update: Rename models inline
- ✅ Delete: Remove models (except permanent ones)
- ✅ Load: Click to view in 3D viewer

**How to Upload a Model:**

1. Click **"Upload Model"** in Asset Library
2. Choose a .glb or .gltf file
3. Enter a name and select category
4. Click **"Upload"**
5. Model is automatically uploaded to Vercel Blob
6. Metadata saved to Supabase database
7. Appears immediately in Asset Library and left sidebar

**How to Edit a Model Name:**

1. Click the **pencil icon** on any model card
2. Type new name
3. Press **Enter** or click **checkmark**
4. Changes saved to database
5. Updates reflect immediately in sidebar

**How to Delete a Model:**

1. Click the **trash icon** on any model card
2. Confirm deletion
3. Removed from database and UI
4. **Note:** Default models (Default Body, Woman Default) cannot be deleted

**How to Load a Model:**

1. Click **"Load"** button on any model card
2. Model renders in 3D viewer instantly
3. All customization controls become available

---

## 👥 MultiModel System Explained

The MultiModel system allows rendering multiple 3D models simultaneously (body + multiple clothing items).

### Architecture

\`\`\`
Scene
 └── MultiModel (when body + clothing detected)
      ├── Body Model (just_body.glb or girl_body.glb)
      └── Clothing Models
           ├── Shirt (if shirtColor !== null)
           ├── Shoes (if shoesModelUrl exists)
           └── Pants (if pantsModelUrl exists)
\`\`\`

### How It Works

**Code location:** `components/3d-viewer/multi-model.tsx`

1. **Load body model first**
   \`\`\`typescript
   const bodyGltf = useGLTF(bodyModelUrl)
   \`\`\`

2. **Load clothing models conditionally**
   \`\`\`typescript
   const shirtGltf = shirtColor ? useGLTF(shirtModelUrl) : null
   const shoesGltf = shoesModelUrl ? useGLTF(shoesModelUrl) : null
   \`\`\`

3. **Normalize all models to same height**
   \`\`\`typescript
   normalizeModel(bodyGltf.scene, 1.8) // 1.8m height
   normalizeModel(shirtGltf.scene, 1.8)
   normalizeModel(shoesGltf.scene, 1.8)
   \`\`\`

4. **Position all at origin**
   \`\`\`typescript
   bodyGltf.scene.position.set(0, 0, 0)
   shirtGltf.scene.position.set(0, 0, 0)
   shoesGltf.scene.position.set(0, 0, 0)
   \`\`\`

5. **Apply colors independently**
   \`\`\`typescript
   applyColorToMesh(bodyGltf.scene, skinColor, 'skin')
   applyColorToMesh(shirtGltf.scene, shirtColor, 'shirt')
   applyColorToMesh(shoesGltf.scene, shoesColor, 'shoes')
   \`\`\`

### When MultiModel is Used

The Scene component decides which renderer to use:

\`\`\`typescript
// Check if we have body + any clothing
const hasClothing = shirtColor || shoesModelUrl || pantsModelUrl

if (isDefaultModel && hasClothing) {
  return <MultiModel bodyModelUrl={bodyModelUrl} ... />
} else {
  return <Model modelUrl={modelUrl} />
}
\`\`\`

### Benefits

- ✅ Independent control of each model
- ✅ Show/hide clothing without reloading body
- ✅ Separate color customization
- ✅ Better performance (only render visible items)
- ✅ Easier material management

---

## 🎨 Sidebar Documentation

### Left Sidebar: Category Sidebar

**File:** `components/outfit-builder/category-sidebar.tsx`

**Purpose:** Browse and select 3D models by category

**Features:**
- 🏠 Character selection (Default Body, Woman Default)
- 👕 Shirt toggle with color picker
- 👟 Shoes selection
- 👖 Pants selection
- 👔 T-Shirt selection
- 💎 Accessories
- 🎨 Skin color picker (for characters only)
- 🔍 Search across all items
- 📊 Item counts per category

**How it works:**

1. **Category Selection:**
   \`\`\`typescript
   const categories = [
     { id: 'character', label: 'Character', icon: User },
     { id: 'shoes', label: 'Shoes', icon: ShoppingBag },
     // ... more categories
   ]
   \`\`\`

2. **Item Rendering:**
   - Each category has a list of items
   - Items show thumbnail, name, and click to load
   - Selected item highlighted with border

3. **Color Pickers:**
   - Shirt: Toggle on/off + color picker
   - Shoes: Color picker only
   - Pants: Color picker only
   - Character: Skin tone presets + custom picker

4. **Search:**
   - Filters items across all categories
   - Real-time search as you type
   - Shows item count per category

**State Management:**
\`\`\`typescript
const [selectedCategory, setSelectedCategory] = useState('character')
const [searchQuery, setSearchQuery] = useState('')
const [shirtColor, setShirtColor] = useState<string | null>(null)
\`\`\`

### Right Sidebar: Playground Panel

**File:** `components/outfit-builder/playground-panel.tsx`

**Purpose:** Control animations, lighting, and view

**Features:**
- ▶️ Play/Pause animations
- ⚡ Animation speed control (0.5x - 2x)
- 💡 Ambient light intensity
- 🔦 Directional light intensity
- 📏 Model info (height, scale)
- 🔄 Reset model position

**How it works:**

1. **Animation Controls:**
   \`\`\`typescript
   const [isPlaying, setIsPlaying] = useState(true)
   const [animationSpeed, setAnimationSpeed] = useState(1)
   
   // Pass to Scene component
   <Scene 
     isPlaying={isPlaying}
     animationSpeed={animationSpeed}
   />
   \`\`\`

2. **Lighting Controls:**
   \`\`\`typescript
   const [ambientIntensity, setAmbientIntensity] = useState(0.5)
   const [directionalIntensity, setDirectionalIntensity] = useState(1)
   
   // Applied in Scene component
   <ambientLight intensity={ambientIntensity} />
   <directionalLight intensity={directionalIntensity} />
   \`\`\`

3. **Model Info:**
   - Displays current model height
   - Shows applied scale factor
   - Updates when model changes

**State Management:**
\`\`\`typescript
const [isPlaying, setIsPlaying] = useState(true)
const [animationSpeed, setAnimationSpeed] = useState(1)
const [ambientIntensity, setAmbientIntensity] = useState(0.5)
\`\`\`

---

## 🔥 Important Components (Point Breakers)

### 1. Scene Component (`components/3d-viewer/scene.tsx`)

**Purpose:** Main 3D scene container that decides which renderer to use

**Responsibilities:**
- Determine if MultiModel or single Model should render
- Detect if model is a default body model
- Check if clothing items are present
- Set up Canvas and Camera
- Manage lighting
- Handle model state

**Key Decision Logic:**
\`\`\`typescript
const isDefaultModel = modelUrl?.includes("just_body") || 
                      modelUrl?.includes("girl_body")
const hasClothing = shirtColor || shoesModelUrl || pantsModelUrl

if (isDefaultModel && hasClothing) {
  return <MultiModel {...props} />
} else if (isDefaultModel) {
  return <DualModel {...props} />
} else {
  return <Model {...props} />
}
\`\`\`

### 2. MultiModel Component (`components/3d-viewer/multi-model.tsx`)

**Purpose:** Render body + multiple clothing items simultaneously

**Responsibilities:**
- Load body model
- Load shirt model (if shirt toggle is on)
- Load shoes model (if shoes selected)
- Load pants model (if pants selected)
- Normalize all models to same height
- Position all at origin
- Apply colors independently
- Manage animations
- Handle visibility toggling

**Performance Optimization:**
- Only loads clothing models when needed
- Uses conditional rendering
- Caches transformations

### 3. Model Actions (`lib/actions/model-actions.ts`)

**Purpose:** Server-side CRUD operations for models

**Functions:**
- `getModelsFromDatabase()` - Fetch all models
- `saveModelToDatabase()` - Upload and save new model
- `updateModelName()` - Rename existing model
- `deleteModel()` - Remove model from database and storage
- `seedDefaultModels()` - Initialize default models
- `ensureTableExists()` - Check/create database table

**Example Usage:**
\`\`\`typescript
// Get all models
const models = await getModelsFromDatabase()

// Upload new model
await saveModelToDatabase({
  file: gltfFile,
  name: 'Blue Shirt',
  category: 'shirt'
})

// Rename model
await updateModelName(modelId, 'Red Shirt')

// Delete model
await deleteModel(modelId)
\`\`\`

### 4. Asset Library Modal (`components/asset-manager/asset-library-modal.tsx`)

**Purpose:** Complete UI for managing all 3D assets

**Features:**
- Grid/List view toggle
- Search functionality
- Category filtering
- Upload new models
- Inline name editing
- Delete with confirmation
- Load models into viewer
- Real-time statistics

**State Management:**
\`\`\`typescript
const [models, setModels] = useState<Model[]>([])
const [searchQuery, setSearchQuery] = useState('')
const [selectedCategory, setSelectedCategory] = useState('all')
const [isUploading, setIsUploading] = useState(false)
\`\`\`

### 5. Page Component (`app/page.tsx`)

**Purpose:** Main application page that ties everything together

**Responsibilities:**
- Initialize state for all models
- Handle Default Body / Woman Default clicks
- Manage shirt toggle
- Pass state to Scene and Sidebars
- Handle model uploads
- Coordinate between components

**State Flow:**
\`\`\`
Page (state)
 ├── CategorySidebar (read state, trigger actions)
 ├── Scene (read state, render models)
 └── PlaygroundPanel (read/write controls)
\`\`\`

---

## 🛡️ Error Handling Guide

### 1. 3D Rendering Errors

**Error:** `Cannot read properties of undefined (reading 'scene')`

**Cause:** Model failed to load or URL is invalid

**Solution:**
\`\`\`typescript
// Always check if model exists before rendering
if (!gltf || !gltf.scene) {
  console.error('[v0] Model failed to load')
  return null
}
\`\`\`

**Prevention:**
- Validate URLs before loading
- Add loading states
- Implement error boundaries

---

**Error:** `WebGL context lost`

**Cause:** GPU ran out of memory (too many models loaded)

**Solution:**
- Reduce number of models loaded simultaneously
- Dispose of unused models
- Lower texture quality

\`\`\`typescript
// Dispose unused models
useEffect(() => {
  return () => {
    gltf.scene.traverse((child) => {
      if (child.geometry) child.geometry.dispose()
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose())
        } else {
          child.material.dispose()
        }
      }
    })
  }
}, [gltf])
\`\`\`

---

**Error:** `getFileType is not defined`

**Cause:** Function called before being defined or imported incorrectly

**Solution:**
\`\`\`typescript
// Always define helper functions before using
const getFileType = (url: string) => {
  if (!url) return 'glb'
  return url.split('.').pop()?.toLowerCase() || 'glb'
}
\`\`\`

### 2. Database Errors

**Error:** `SyntaxError: Unexpected token 'I', "Invalid re"... is not valid JSON`

**Cause:** Supabase table doesn't exist

**Solution:**
1. Run the SQL script from `scripts/setup-models-table.sql`
2. Check Supabase dashboard for errors
3. Verify environment variables are correct

\`\`\`typescript
// Add error handling for missing table
try {
  const { data, error } = await supabase.from('models').select('*')
  if (error) {
    if (error.message.includes('relation') || error.message.includes('does not exist')) {
      return { data: [], needsSetup: true }
    }
    throw error
  }
  return { data, needsSetup: false }
} catch (err) {
  console.error('[v0] Database error:', err)
  return { data: [], needsSetup: true }
}
\`\`\`

---

**Error:** `Failed to insert model: duplicate key value`

**Cause:** Trying to insert model with existing ID

**Solution:**
- Use `gen_random_uuid()` for IDs (already in schema)
- Or use `upsert` instead of `insert`

\`\`\`typescript
// Use upsert for safer inserts
const { data, error } = await supabase
  .from('models')
  .upsert({ id, name, url, category })
\`\`\`

---

**Error:** `Too Many Requests`

**Cause:** Hit Supabase rate limit

**Solution:**
- Add rate limiting on client side
- Implement request debouncing
- Cache frequently accessed data

\`\`\`typescript
// Debounce search queries
const debouncedSearch = useMemo(
  () => debounce((query) => fetchModels(query), 300),
  []
)
\`\`\`

### 3. Asset Library Errors

**Error:** `Blob upload failed: Unauthorized`

**Cause:** Invalid or missing `BLOB_READ_WRITE_TOKEN`

**Solution:**
1. Verify token in `.env.local`
2. Check token has read/write permissions
3. Generate new token if expired

\`\`\`typescript
// Check token before upload
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error('Blob token not configured')
}
\`\`\`

---

**Error:** `File too large`

**Cause:** Uploaded file exceeds Vercel Blob limits

**Solution:**
- Compress .glb files using gltf-transform
- Set file size limit in upload component

\`\`\`typescript
// Check file size before upload
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
if (file.size > MAX_FILE_SIZE) {
  throw new Error('File too large. Maximum size is 50MB')
}
\`\`\`

---

**Error:** `Failed to delete model: is_permanent`

**Cause:** Trying to delete a default model

**Solution:**
\`\`\`typescript
// Check if model is permanent before delete
if (model.is_permanent) {
  toast.error('Cannot delete default models')
  return
}

// Delete query
const { error } = await supabase
  .from('models')
  .delete()
  .eq('id', modelId)
  .eq('is_permanent', false) // Extra safety check
\`\`\`

### 4. Upload Model Errors

**Error:** `Failed to parse GLB file`

**Cause:** Invalid or corrupted .glb file

**Solution:**
- Validate file format before upload
- Test file in Blender first
- Use glTF Validator online

\`\`\`typescript
// Validate file extension
const validExtensions = ['.glb', '.gltf']
const ext = fileName.toLowerCase().split('.').pop()
if (!validExtensions.includes(`.${ext}`)) {
  throw new Error('Invalid file format. Use .glb or .gltf')
}
\`\`\`

---

**Error:** `CORS error when loading model`

**Cause:** Model URL doesn't allow cross-origin requests

**Solution:**
- Use Vercel Blob (automatically handles CORS)
- Or add CORS headers to your CDN

\`\`\`typescript
// Vercel Blob automatically sets correct CORS headers
const blob = await put(filename, file, {
  access: 'public', // Allows cross-origin access
  contentType: 'model/gltf-binary'
})
\`\`\`

### 5. Animation Errors

**Error:** `Animation mixer not defined`

**Cause:** Trying to play animation before mixer is created

**Solution:**
\`\`\`typescript
// Always check mixer exists
if (!mixerRef.current) {
  mixerRef.current = new THREE.AnimationMixer(gltf.scene)
}

const action = mixerRef.current.clipAction(animations[0])
action.play()
\`\`\`

---

**Error:** `No animations found`

**Cause:** Model doesn't have embedded animations

**Solution:**
\`\`\`typescript
// Check if animations exist
if (!gltf.animations || gltf.animations.length === 0) {
  console.log('[v0] No animations in this model')
  return // Don't create mixer
}

// Only create mixer if animations exist
const mixer = new THREE.AnimationMixer(gltf.scene)
\`\`\`

---

## 🔧 Troubleshooting Common Errors

### Installation Errors

**Problem:** `npm install` fails with EACCES

**Solution:**
\`\`\`bash
# Mac/Linux
sudo npm install

# Or fix npm permissions (preferred)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
\`\`\`

---

**Problem:** `Module not found: Can't resolve 'three'`

**Solution:**
\`\`\`bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or install specific package
npm install three@0.180.0 @react-three/fiber@9.4.0 @react-three/drei@10.7.6
\`\`\`

---

**Problem:** `Error: Cannot find module '@supabase/ssr'`

**Solution:**
\`\`\`bash
npm install @supabase/ssr@0.7.0
\`\`\`

### Runtime Errors

**Problem:** Models not appearing in 3D space

**Checklist:**
1. ✅ Check browser console for errors
2. ✅ Verify model URL is accessible
3. ✅ Check if `activeModelUrl` is set
4. ✅ Ensure Scene component is rendering
5. ✅ Check WebGL is supported in browser

**Debug:**
\`\`\`typescript
console.log('[v0] Model URL:', modelUrl)
console.log('[v0] Is default model:', isDefaultModel)
console.log('[v0] Has clothing:', hasClothing)
console.log('[v0] Will render:', willRenderMultiModel ? 'MultiModel' : 'Model')
\`\`\`

---

**Problem:** Colors not changing

**Checklist:**
1. ✅ Model has materials
2. ✅ Material type supports color
3. ✅ Color prop is passed correctly
4. ✅ Material.needsUpdate is set to true

**Fix:**
\`\`\`typescript
// Make sure to update material
material.color.set(newColor)
material.needsUpdate = true

// For textured materials, may need emissive
if (material.map) {
  material.emissive.set(newColor)
  material.emissiveIntensity = 0.2
}
\`\`\`

---

**Problem:** Database setup button not working

**Steps:**
1. Check Supabase connection in dashboard
2. Verify environment variables
3. Check browser console for errors
4. Try running SQL manually in Supabase SQL Editor

---

**Problem:** Upload model button does nothing

**Debug:**
\`\`\`typescript
// Add logging to upload handler
const handleUpload = async (file: File) => {
  console.log('[v0] Starting upload:', file.name, file.size)
  
  try {
    const result = await saveModelToDatabase({
      file,
      name: file.name,
      category: 'clothing'
    })
    console.log('[v0] Upload success:', result)
  } catch (err) {
    console.error('[v0] Upload failed:', err)
  }
}
\`\`\`

### Performance Issues

**Problem:** App is slow/laggy

**Solutions:**
1. **Reduce polygon count** in 3D models (use Blender to decimate)
2. **Lower texture resolution** (512x512 instead of 4K)
3. **Limit loaded models** (max 3-4 at once)
4. **Disable shadows** if not needed
5. **Use lower quality materials**

\`\`\`typescript
// Performance settings
<Canvas
  shadows={false} // Disable shadows
  dpr={[1, 1.5]} // Lower device pixel ratio
>
\`\`\`

---

**Problem:** Browser freezing when loading models

**Solution:**
\`\`\`typescript
// Add loading states
const [isLoading, setIsLoading] = useState(false)

const loadModel = async (url: string) => {
  setIsLoading(true)
  try {
    const gltf = await new GLTFLoader().loadAsync(url)
    setModel(gltf)
  } finally {
    setIsLoading(false)
  }
}
\`\`\`

---

## 💻 Terminal Commands Reference

### Essential Commands

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
\`\`\`

### Cleaning & Reset

\`\`\`bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Nuclear option (reset everything)
rm -rf .next node_modules package-lock.json
npm install
npm run dev
\`\`\`

### Database Management

\`\`\`bash
# Install Supabase CLI (one-time)
npm install -g supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push

# Reset database (WARNING: deletes all data!)
supabase db reset
\`\`\`

### Development Helpers

\`\`\`bash
# Run on different port
PORT=3001 npm run dev

# Check package versions
npm list three @react-three/fiber @react-three/drei

# Find outdated packages
npm outdated

# Update specific package
npm install package-name@latest

# Check bundle size
npm run build
# Look for "First Load JS" in output
\`\`\`

### Git Workflow

\`\`\`bash
# Check status
git status

# Create feature branch
git checkout -b feature/asset-library

# Stage and commit
git add .
git commit -m "feat: add asset library modal"

# Push to remote
git push origin feature/asset-library

# Pull latest changes
git pull origin main
\`\`\`

---

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **"Import Project"**
4. Select your repository
5. Add environment variables (all from `.env.local`)
6. Click **"Deploy"**

### Environment Variables in Production

In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add each variable from `.env.local`
3. Make sure to add for **Production**, **Preview**, and **Development**
4. Redeploy after adding variables

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit (`git commit -m 'feat: add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 💬 Support

For issues and questions:
- 📖 Check this README thoroughly
- 🔍 Review browser console logs
- 🗄️ Check Supabase dashboard for database errors
- ☁️ Check Vercel dashboard for storage errors
- 🐛 Open an issue on GitHub with:
  - Error message
  - Steps to reproduce
  - Browser console logs
  - Environment (OS, Node version, browser)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Three.js](https://threejs.org/) - 3D Graphics Library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React Renderer for Three.js
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI Components
- [Supabase](https://supabase.com/) - Backend & Database
- [Vercel](https://vercel.com/) - Hosting & Storage
- [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS

---

**Made with ❤️ for 3D enthusiasts**

**Happy Building! 🎨👕👟**
