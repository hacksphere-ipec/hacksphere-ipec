# Website Management Guide

Quick guide on how to update and maintain the HackSphere IPEC website.

## 📅 Managing Years

### 1. Set Default Year
To change which year displays by default on the Teams page:
- Open `public/js/main.js`
- Update `const DEFAULT_TEAM_YEAR = 'fy26';` at the top of the file.

### 2. Adding a New Year
1. **Folders**: Create `data/fy27/` and `public/images/teams/fy27/`.
2. **Data**: Copy `data/teams_example.json` to your new folder as `teams.json`.
3. **Images**: Upload member photos to their respective team folders in `public/images/teams/fy27/`.

## 👥 Updating Sections

### 1. Teams & Yearly Presidents
Modify `data/fyXX/teams.json`:
- **Presidents**: Update names and images for that specific year.
- **Teams**: Update Heads, Sub-Heads, and Volunteers for each category.
- **Images**: Use paths like `/images/teams/fyXX/tech/name.png`.

### 2. Main Page Leadership (Front Page)
Modify `data/leadership.json`:
- This section shows the *current overall* leadership on the home page.
- Update `name`, `position`, `bio`, and `photo` paths.

## 🖼️ Image Standards

Always organize images by year to maintain records:
- **Presidents**: `public/images/presidents/fyXX/`
- **Teams**: `public/images/teams/fyXX/`
  - Subfolders: `tech`, `design`, `event`, `documentation`, `editing`, `social-media`, `sponsorship`.

## 🚀 Running Locally
1. Start server: `node server.js`
2. View at: `http://localhost:3000`
