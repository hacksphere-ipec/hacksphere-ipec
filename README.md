# HackSphere IPEC Website Management

A modern, responsive website for the HackSphere student chapter at Inderprastha Engineering College built with Node.js, featuring dynamic content management and responsive design.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/hacksphere-ipec/hacksphere-ipec.git
cd hacksphere-ipec

# Install dependencies (if any)
npm install

# Start the server
node server.js

# Visit: http://localhost:3000
```

## 📋 Website Structure

### Main Pages
- **`public/index.html`** - Homepage with all sections
- **`public/events.html`** - Complete events archive page
- **`public/404.html`** - Error page

### Dynamic Content Areas
1. **Events Section** - Shows latest events (3 on desktop, 2 on mobile)
2. **Leadership Section** - Society leadership team
3. **Teams Section** - Year-wise team members with role-based organization
4. **Sponsors Section** - Past sponsors and partners with carousel

## 🔄 What Updates Automatically

- **Year Detection**: Server automatically scans `data/` folders (e.g., `fy26`, `fy27`)
- **Team Navigation**: All teams in `teams.json` appear in sidebar/mobile tabs
- **Events Display**: Responsive layout (3 desktop, 2 mobile) with "View All Events" link
- **Image Loading**: Optimized `.webp` format for better performance
- **Responsive Design**: Mobile layouts adapt automatically to screen sizes

## ✏️ Content Management Guide

### 1. Events Management

#### Adding New Events
**File**: `data/events.json`

```json
{
  "id": "event-id",
  "title": "Event Name",
  "date": "March 15, 2026",
  "category": "Workshop",
  "shortDescription": "Brief description for cards",
  "location": "Venue Name",
  "thumbnail": "images/events/event-name/main.webp",
  "images": [
    "images/events/event-name/1.webp",
    "images/events/event-name/2.webp"
  ]
}
```

#### Event Display Logic
- **Homepage**: Shows latest 3 events (desktop) or 2 events (mobile)
- **Events Page**: Shows all events in chronological order
- **Images**: Support multiple images with automatic slider
- **Navigation**: "View All Events" button links to full archive

### 2. Team Management (Year-Based)

#### Current Year Configuration
**File**: `public/js/main.js`
```javascript
const DEFAULT_TEAM_YEAR = 'fy26'; // Change for new academic year
```

#### Team Data Structure
**File**: `data/fyXX/teams.json`
```json
{
  "presidents": [
    {
      "name": "Person Name",
      "role": "President",
      "image": "images/presidents/fy26/name.webp",
      "linkedin": "https://linkedin.com/in/profile",
      "bio": "Brief description"
    }
  ],
  "teams": {
    "tech": {
      "name": "Technical Team",
      "heads": [...],
      "subHeads": [...],
      "volunteers": [...]
    }
  }
}
```

### 3. Leadership Management
**File**: `data/leadership.json`
- Current overall society leadership (displayed on homepage)
- Independent of yearly team data
- Same JSON structure as team members

### 4. Sponsor Management
- **Images**: `public/images/sponsors/sponsor-name.webp`
- **Auto-carousel**: Automatically cycles through sponsors
- **Navigation**: Left/right arrows for manual control

## 📁 Adding New Academic Year

### Step-by-Step Process
1. **Create Directory Structure**:
   ```bash
   mkdir -p data/fy27
   mkdir -p public/images/teams/fy27
   mkdir -p public/images/presidents/fy27
   ```

2. **Copy Template**:
   ```bash
   cp data/teams_example.json data/fy27/teams.json
   ```

3. **Upload Member Photos**:
   - Place team member photos in respective category folders
   - Use `.webp` format for optimal performance
   - Naming: `firstname-lastname.webp` or `name.webp`

4. **Update Team Data**:
   - Edit `data/fy27/teams.json` with new member information
   - Add LinkedIn profiles and bios

5. **Set as Default Year** (when ready):
   ```javascript
   // In public/js/main.js
   const DEFAULT_TEAM_YEAR = 'fy27';
   ```

### Directory Structure for New Year
```
data/fy27/
└── teams.json

public/images/
├── teams/fy27/
│   ├── tech/
│   ├── design/
│   ├── documentation/
│   ├── event/
│   ├── social-media/
│   ├── sponsorship/
│   └── editing/
└── presidents/fy27/
```

## 🖼️ Image Optimization Guide

### Recommended Formats
- **Primary**: `.webp` (modern browsers, smaller file size)
- **Fallback**: `.png` or `.jpg` (if webp not supported)

### Image Guidelines
- **Team Photos**: 400x400px, square aspect ratio
- **Event Images**: 1200x800px, landscape orientation
- **Logos**: SVG preferred, or high-resolution PNG with transparency

### Conversion Tools
```bash
# Using imagemagick
magick input.png output.webp

# Using online tools
# - Squoosh.app
# - CloudConvert.com
```

## 🎨 Responsive Design System

### Breakpoints
- **Desktop**: ≥1024px (3-column grid)
- **Tablet**: 768px-1023px (2-column grid)  
- **Mobile**: <768px (1-column grid)

### Events Layout
- **Desktop**: 3 latest events in grid
- **Mobile**: 2 latest events in single column
- **Archive**: Full responsive grid on events.html

### Navigation
- **Desktop**: Horizontal navigation bar
- **Mobile**: Hamburger menu with overlay

## 🛠️ Development Workflow

### Git Workflow (Required)
```bash
# Start new feature
git checkout development
git pull origin development
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: description of changes"
git push origin feature/feature-name

# Merge to development
git checkout development
git merge feature/feature-name
git push origin development

# Deploy to main (after testing)
git checkout main
git merge development
git push origin main
```

### Commit Convention
- `feat:` - New features
- `fix:` - Bug fixes
- `style:` - CSS/design changes
- `refactor:` - Code improvements
- `docs:` - Documentation updates
- `chore:` - Maintenance tasks

## 🚀 Deployment

### Production Deployment
- **Platform**: Render/Vercel/Netlify
- **Branch**: `main` (production)
- **Build Command**: `node server.js`
- **Environment**: Node.js

### Testing Before Deployment
1. Test locally: `node server.js`
2. Check responsive layouts
3. Verify all data loads correctly
4. Test navigation and links

## 📱 API Endpoints

The server provides these endpoints for dynamic content:

- `/api/events` - All events data
- `/api/leadership` - Leadership team data  
- `/api/teams/:year` - Team data for specific year
- `/api/years` - Available academic years

## 🔧 Configuration Files

### Key Files to Know
- **`server.js`** - Main server file and API endpoints
- **`public/js/main.js`** - Frontend JavaScript and interactions
- **`public/css/style.css`** - All styling and responsive design
- **`data/`** - All content data (JSON files)

### Environment Variables
```bash
PORT=3000  # Server port (default: 3000)
```

## 🆘 Troubleshooting

### Common Issues

1. **Images not loading**:
   - Check file paths in JSON data
   - Ensure images are in `.webp` format
   - Verify directory structure

2. **Team data not updating**:
   - Clear browser cache
   - Check JSON syntax validity
   - Verify year folder exists

3. **Responsive layout issues**:
   - Test with browser dev tools
   - Check CSS media queries
   - Verify viewport meta tag

### Getting Help
- Check browser console for JavaScript errors
- Validate JSON files online
- Review git workflow documentation
- Contact development team

---

## 📄 License
This project is maintained by HackSphere IPEC. For questions or contributions, please contact the development team.

**Last Updated**: February 2026
