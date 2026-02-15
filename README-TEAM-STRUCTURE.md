# Team Management Guide

## Overview
The website displays the configured default year's team. Since recruitment happens around August to December, you need to manually set which year should be displayed by default.

## Setting Default Year

**To change which year displays by default:**
1. Open `public/js/main.js`
2. Find this line near the top: (line 349)
   ```javascript
   const DEFAULT_TEAM_YEAR = 'fy26';
   ```
3. Change `'fy26'` to your desired year (e.g., `'fy27'`)
4. Save the file and restart your server

**Example:** To show FY 2026-27 teams by default:
```javascript
const DEFAULT_TEAM_YEAR = 'fy27';
```

## File Structure

```
data/
  teams_example.json      # Template to copy for new years
  fy26/
    teams.json            # FY 2025-26 team data  
  fy27/
    teams.json            # FY 2026-27 team data (when created)
  
public/images/
  presidents/
    fy26/
      president-name.png  # President image
      vp-name.png         # VP image
    fy27/
      president-name.png  # Next year president
      vp-name.png         # Next year VP
  teams/
    fy26/
      tech/               # Tech team images
      event/              # Event team images
      design/             # Design team images
      documentation/      # Documentation team images
      editing/            # Editing team images
      social-media/       # Social media team images
      sponsorship/        # Sponsorship team images
    fy27/                 # Next year team images (when created)
```

## Adding New Year Teams

### Step 1: Create Year Folder
- Create folder: `data/fy27/`
- Create folder: `public/images/teams/fy27/`
- Create folder: `public/images/presidents/fy27/`

### Step 2: Copy Template
- Copy `data/teams_example.json`
- Rename to `teams.json`
- Put in your year folder: `data/fy27/teams.json`

### Step 3: Update Team Data
Open `data/fy27/teams.json` and replace:

**Description:**
```json
"description": "Your team description here"
```

**Presidents:**
```json
"president": {
  "name": "Actual President Name",
  "role": "President", 
  "image": "/images/presidents/fy27/president-name.png",
  "linkedin": "https://linkedin.com/in/actual-username"
}
```

**Team Structure:**
Each team has three levels:
- **Head**: 1 person who leads the team
- **Sub Heads**: 0 or more assistant leaders
- **Volunteers**: Regular team members

```json
"tech": {
  "name": "Tech Team",
  "head": {
    "name": "Tech Head Actual Name",
    "role": "Technical Head",
    "image": "/images/teams/fy27/tech/head-name.png",
    "linkedin": "https://linkedin.com/in/username"
  },
  "subHeads": [
    {
      "name": "Sub Head Name",
      "role": "Tech Sub Head",
      "image": "/images/teams/fy27/tech/subhead-name.png", 
      "linkedin": "https://linkedin.com/in/username"
    }
  ],
  "volunteers": [
    {
      "name": "Volunteer Name",
      "role": "Tech Volunteer",
      "image": "/images/teams/fy27/tech/volunteer-name.png",
      "linkedin": "https://linkedin.com/in/username"
    }
  ]
}
```

### Step 4: Add Images
**President Images:**
- Add president photo to: `public/images/presidents/fy27/president-name.png`
- Add VP photo to: `public/images/presidents/fy27/vp-name.png`

**Team Images:**
- Create subfolders for each team under `public/images/teams/fy27/`
- Add member photos (400x400 pixels recommended)
- Name files with lowercase and hyphens: `john-doe.png`

### Step 5: Update Image Paths
In your JSON file, make sure image paths match your actual file names:
```json
"image": "/images/teams/fy27/tech/actual-filename.png"
```

### Step 6: Test
- Restart your web server
- Check the year dropdown - new year should appear
- Test all team sections

## Teams Available

You can update these teams:
- **Core Team** (shows presidents + all team heads automatically)
- **Tech Team** 
- **Event Team**
- **Design Team**
- **Documentation Team**
- **Editing Team** 
- **Social Media Team**
- **Sponsorship Team**

## What Changes Automatically

- **Year Detection**: Website automatically detects current academic year
- **Dropdown**: New years appear automatically when folders are created
- **Core Team**: Automatically shows presidents + all team heads

## Common Updates

**Adding New Member:**
1. Add their image to correct team folder
2. Add their details to JSON file in appropriate section (head/subHeads/volunteers)

**Removing Member:**
1. Delete their entry from JSON file
2. Remove their image file

**Changing Positions:**
1. Move their entry between head/subHeads/volunteers sections
2. Update their "role" field

**New Team:**
Add new team section to JSON:
```json
"new-team": {
  "name": "New Team Name",
  "head": { ... },
  "subHeads": [ ... ],
  "volunteers": [ ... ]
}
```

## File Naming

**Image Files:**
- Use lowercase letters
- Replace spaces with hyphens
- Example: `john-doe.png` not `John Doe.png`

**Team Folders:**
- Use same names as in JSON
- Examples: `tech`, `event`, `social-media`

## Troubleshooting

**Year not showing:** Check folder name format `fy27`
**Images not loading:** Check image paths match actual file locations  
**Team not displaying:** Restart web server after changes
**Wrong year selected:** Check if current year data folder exists

That's it! The website handles everything else automatically.
