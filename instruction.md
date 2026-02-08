# HWI-IPEC Tech Society Website - Local Setup

## 📁 Project Structure
```
hwi/
├── server.js              # Backend server
├── package.json           # Dependencies
├── data/                  # JSON data files
│   ├── events.json        # Events data
│   └── leadership.json    # Leadership data
└── public/                # Frontend files
    ├── index.html         # Homepage
    ├── event.html         # Event pages
    ├── css/style.css      # Styling
    ├── js/main.js         # JavaScript
    └── images/            # Images
```

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Quick Start
```bash
# Navigate to project directory
cd hwi

# Install dependencies
npm install

# Start the development server
node server.js
```

### Access Website
- **Local URL**: http://localhost:3000
- **Server Port**: 3000

### Making Changes
- **Update Events**: Edit `data/events.json`
- **Update Leadership**: Edit `data/leadership.json`
- **Change Styling**: Modify `public/css/style.css`
- **Add Images**: Place in `public/images/` folder

### Stopping Server
```bash
# Press Ctrl+C in terminal, or run:
taskkill /f /im node.exe
```

## 🔧 Troubleshooting
- **Port in use**: Kill existing processes or change port in server.js
- **Missing images**: Check file paths in JSON files
- **Installation issues**: Delete node_modules and run `npm install` again