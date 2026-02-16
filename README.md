# HackSphere IPEC Website Management

## 🚀 Quick Start
```bash
node server.js
# Visit: http://localhost:3000
```

## 🔄 What Updates Automatically
- **Year Detection**: Server automatically scans `data/` folders (e.g., `fy26`, `fy27`)
- **Team Navigation**: All teams in `teams.json` appear in sidebar/mobile tabs
- **Image Loading**: Uses `.webp` format for optimal performance
- **Responsive Design**: Mobile layouts adapt automatically

## ✏️ What You Manage Manually

### 1. Default Year Selection
**File**: `public/js/main.js`
```javascript
const DEFAULT_TEAM_YEAR = 'fy26'; // Change here
```

### 2. Team Data (Year-Specific)
**File**: `data/fyXX/teams.json`
- Presidents for that specific year
- Team heads, sub-heads, volunteers
- LinkedIn profiles and bios

### 3. Home Page Leadership
**File**: `data/leadership.json`
- Current overall society leadership (front page)
- Independent of yearly team data

### 4. Events & Main Content
**Files**: `data/events.json`, page HTML files
- Event details and descriptions
- Static page content updates

## 📁 Adding New Year
1. Create: `data/fy27/` + `public/images/teams/fy27/` + `public/images/presidents/fy27/`
2. Copy: `data/teams_example.json` → `data/fy27/teams.json`
3. Upload: Member photos in `.webp` format
4. **No code changes needed** - year appears automatically

## 🖼️ Image Structure
```
public/images/
├── teams/fy26/
│   ├── tech/
│   ├── design/
│   ├── event/
│   ├── social-media/
│   └── ...
└── presidents/fy26/
```

✅ **Use `.webp` format** for faster loading
