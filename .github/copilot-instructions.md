# Copilot Instructions for Naftalis Solutions

## Project Overview
A React + Vite web application for "Naftali's Solutions" - a tech services company offering appointment scheduling, WhatsApp integration, and custom dashboards to small businesses. The app features bilingual support (EN/HE with RTL), React Router navigation, and Radix UI components styled with Tailwind CSS.

## Core Architecture

### React App Structure (`src/App.jsx`)
- **Layout**: Header → main content area → Footer  
- **Key Context**: `LanguageProvider` wraps entire app (manages language state, translations, RTL/LTR, localStorage)
- **Routes**: 7 pages defined in `Routes` component (Solutions, About, Services, Contact, Quote, Quote Thank You)
- **Global Components**: `Toaster` for notifications, `ScrollToTop` hook restores scroll position on navigation

### Language & i18n (`src/context/LanguageContext.jsx`, `src/lib/translations.js`)
- Single global context stores: `language`, `toggleLanguage()`, `translations` object
- Persists to localStorage and sets `document.documentElement.lang` and `dir` (rtl/ltr)
- Bilingual data structure: `translations[language][path]` (e.g., `translations.en.header.brand`)
- **Import pattern**: Always consume via `useContext(LanguageContext)` and access `translations[key]` objects

### Styling & Component Patterns
- **CSS**: Tailwind + PostCSS (`tailwind.config.js`, `postcss.config.js`)
- **UI Library**: Radix UI primitives (dialog, tabs, dropdown, checkbox, slider, etc.) with custom wrapper components in `src/components/ui/`
- **Animation**: Framer Motion (`motion.*` components, initial/animate/transition props)
- **Icons**: Lucide React (e.g., `<Rocket />`, `<Menu />`, `<DollarSign />`)
- **Utilities**: `cn()` function in `src/lib/utils.js` merges Tailwind classes using `clsx` + `tailwind-merge`
- **Toast Notifications**: Import `toast` from `@/components/ui/use-toast`, call as `toast({ title, description, variant })`

### Vite Configuration & Development Features
- **Dev Command**: `npm run dev` - serves on `http://localhost:3000` with IPv6 support (`--host ::`)
- **Build Command**: `npm run build` - runs LLM metadata extraction script, then Vite build
- **Plugins** (in `plugins/` directory):
  - `vite-plugin-iframe-route-restoration.js`: Restores last route when embedded in iframes (dev only)
  - `vite-plugin-edit-mode.js`: Injects visual editor styles & scripts in dev mode
  - `vite-plugin-react-inline-editor.js`: Provides inline React component editing (dev only)
- **Error Handling**: Dev-only error handlers for Vite errors, runtime errors, and console errors communicate up to parent iframe via postMessage

### API Integration (`src/api/EcommerceApi.js`)
- **URL & Store**: Hardcoded Hostinger ecommerce API endpoint and store ID
- **Key Functions**: 
  - `formatCurrency(priceInCents, currencyInfo)` - formats prices with symbol/code
  - `extractVariants()` - normalizes product variants with pricing & inventory
  - `extractImages()`, `extractCollections()`, `extractProductOptions()` - normalize API responses
- **Pattern**: Each extract function safely handles missing data with fallbacks (|| operators)

### Build Tools (`tools/generate-llms.js`)
- Extracts metadata from routes and pages: path, element name, Helmet title/description
- Generates llms.txt for LLM context (runs on build, non-fatal failure)
- Uses regex to parse React source: `<Route path="..." element={...} />` and `<Helmet>...</Helmet>`

## Key Developer Workflows

### Local Development
```bash
npm install
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build with metadata generation
npm run preview      # Preview built output locally
```

### Adding a New Page
1. Create `.jsx` file in `src/pages/`
2. Import in `src/App.jsx` and add `<Route path="/path" element={<Component />} />`
3. Add translations to all language keys in `src/lib/translations.js` under appropriate section
4. Use `useContext(LanguageContext)` to access `translations` object
5. Wrap navigable links in `<NavLink>` (React Router) for active state styling

### Creating UI Components
1. Use Radix UI primitives from `@radix-ui/react-*` packages
2. Wrap in custom component in `src/components/ui/` with Tailwind styling
3. Export from component file; import as `import { ComponentName } from '@/components/ui/component-name'`
4. Use `cn()` utility to merge conditional Tailwind classes

### Form Patterns (from `ExpenseForm.jsx`)
- Controlled inputs with `useState` and `handleChange`
- Validate on submit before calling `onAddExpense()`
- Use `toast()` for user feedback (success and destructive variants)
- Wrap form in `motion.form` for entry animations

### Toast Notifications
```jsx
import { toast } from '@/components/ui/use-toast';

toast({
  title: "Success",
  description: "Operation completed",
  variant: "destructive"  // optional: error style
});
```

## Project-Specific Conventions

### Import Aliases
- `@/` resolves to `src/` directory (configured in Vite)
- Always use `@/components`, `@/lib`, `@/context`, `@/api`, etc. for imports

### Directory Purpose
- `src/components/`: Reusable React components; `ui/` subdirectory for Radix-wrapped primitives
- `src/pages/`: Full-page route components
- `src/context/`: React context providers (LanguageContext)
- `src/api/`: External API integration logic
- `src/lib/`: Utilities (cn function, translations data)
- `plugins/`: Custom Vite plugins (iframe restoration, visual editing, etc.)
- `tools/`: Build-time scripts (metadata extraction)

### Translation Pattern
```jsx
const { language, toggleLanguage, translations } = useContext(LanguageContext);
// Access via: translations.sectionName.key = value
<h1>{translations.header.brand}</h1>
<button onClick={toggleLanguage}>{language === 'en' ? 'HE' : 'EN'}</button>
```

### RTL/LTR Handling
- Document direction auto-set by LanguageContext
- Apply `dir={language === 'he' ? 'rtl' : 'ltr'}` to containers needing explicit direction
- Flexbox with `justify-between` reverses in RTL automatically

## Common Issues & Solutions

### Component Not Rendering
- Verify route path matches in `App.jsx` and `translations.js`
- Check import paths use `@/` alias
- Ensure component is default export or properly destructured

### Toast Not Showing
- Import from correct path: `@/components/ui/use-toast` (not use-toast.js)
- Call as function: `toast({...})`, not `<Toast />`
- Toast component wrapped in page/app via `<Toaster />`

### Language Changes Not Persisting
- LanguageContext auto-saves to localStorage - check browser localStorage is enabled
- Component must be wrapped in `<LanguageProvider>` (it's at App level)

### Build Fails
- Check `tools/generate-llms.js` - it has `|| true` to continue on failure
- Vite build output goes to `dist/`; preview serves from there

## Testing & Debugging
- Dev mode includes error boundary scripts that post to parent iframe (for embedded contexts)
- Console errors logged and communicated via postMessage to parent window
- Vite error overlay provides component stack traces in development

## External Dependencies to Know
- **React Router v6**: NavLink, Routes, Route, useLocation, useNavigate
- **Radix UI v1**: Unstyled, accessible primitives (Dialog, Dropdown, Tabs, etc.)
- **Framer Motion v10**: `motion.*` component wrappers for animations
- **Tailwind CSS v3**: Utility-first styling; combined with `tailwindcss-animate`
- **Email.js**: Email sending from browser (dependency present, usage TBD)
- **Hostinger Ecommerce API**: Products, variants, pricing integration (see EcommerceApi.js)
