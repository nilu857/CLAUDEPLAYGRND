# Link Organizer - Quick Start Guide

Your personal second brain for organizing links across all life areas (work, family, personal, etc.)

## 🚀 Setup (One-Time)

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. That's it! You're ready to use it
```

## 💻 Daily Use - Laptop/Desktop

### Option 1: Interactive CLI (Easiest)

```bash
npm run links
```

This launches an interactive menu where you can:
- Add links with guided prompts
- Search and filter
- View by category, person, project
- Export/import
- View dashboard

### Option 2: Quick Commands (Programmatic)

Create quick scripts for common tasks:

```typescript
// quick-add.ts
import { LinkOrganizer } from './lib/LinkOrganizer';
const org = new LinkOrganizer();

// Add a link quickly
org.addLink({
  url: process.argv[2],
  title: process.argv[3],
  type: 'article',
  category: 'General',
  tags: ['to-sort'],
  lifeArea: 'personal',
  status: 'to-review'
});

console.log('Link added!');
```

Run: `npx ts-node quick-add.ts "https://example.com" "Cool Article"`

### Option 3: Direct File Editing

Edit `data/links.json` directly in any text editor. The JSON format is simple and human-readable.

## 📱 Mobile Access Options

### Option A: Cloud Sync + Mobile Editor (Recommended)

1. **Store data in cloud storage:**
   ```bash
   # Move your data to Dropbox/iCloud/Google Drive
   mv data/links.json ~/Dropbox/LinkOrganizer/links.json

   # Create symlink
   ln -s ~/Dropbox/LinkOrganizer/links.json data/links.json
   ```

2. **On mobile:** Use a JSON editor app:
   - iOS: "JSON Editor" or "Working Copy" (Git)
   - Android: "JSON Genie" or "QuickEdit"

3. **Or use any notes app** that syncs (the JSON is readable)

### Option B: Web Interface (I can create this!)

A simple web page where you can:
- Add links via form
- Search and filter
- Works on any device
- No build needed, just open in browser

### Option C: Bookmarklet (Quick Add from Browser)

Save this as a bookmark to add current page:
```javascript
javascript:(function(){
  // Quick add current page
  const title = document.title;
  const url = window.location.href;
  const data = {url, title, type:'article', category:'General', tags:['bookmarked']};
  // Copy to clipboard
  navigator.clipboard.writeText(JSON.stringify(data));
  alert('Link copied! Paste into your organizer.');
})();
```

### Option D: Email to Organizer (Advanced)

Set up email forwarding to automatically add links you email yourself.

## 🎯 Daily Workflows

### Morning Routine
```bash
npm run links
# Select option 8: View statistics
# Check dashboard for:
# - Items due today
# - High priority items
# - Things to review
```

### Adding Links Throughout the Day

**From Laptop:**
```bash
# Quick CLI add
npm run links
# Then select "1. Add new link"
```

**From Mobile:**
- Share URL to your cloud folder
- Or use bookmarklet
- Or email yourself with tags in subject

### Weekly Review
```bash
npm run links:second-brain
# This shows your full dashboard
# Review by life area, project, etc.
```

## 🔧 No Build Needed!

The scripts use `ts-node` which runs TypeScript directly. No build step required!

If you want to build (optional):
```bash
# Compile TypeScript to JavaScript
npx tsc

# Run compiled version
node dist/utils/link-organizer-cli.js
```

## 📊 Common Use Cases

### For Your Daughter's School Stuff
```bash
npm run links
# Add new link with:
# - Life Area: family
# - Person: daughter
# - Category: Education
# - Priority: high (if urgent)
# - Due Date: (if applicable)
```

### For Work Projects
```bash
# Add with:
# - Life Area: work
# - Project: "Q1 Infrastructure"
# - Priority: based on urgency
# - Tags: relevant tech tags
```

### Quick Search
```typescript
// Create search.ts
import { LinkOrganizer } from './lib/LinkOrganizer';
const org = new LinkOrganizer();
const query = process.argv[2];
const results = org.fullTextSearch(query);
console.log(`Found ${results.length} results:`);
results.forEach(r => console.log(`- ${r.title}\n  ${r.url}`));
```

Run: `npx ts-node search.ts "typescript"`

## 🌐 Access from Anywhere

### Using Git (Best for multiple devices)

```bash
# On laptop: commit after adding links
git add data/links.json
git commit -m "Update links"
git push

# On other device: pull latest
git pull
```

### Using Cloud Storage

Store `data/` folder in:
- Dropbox
- Google Drive
- iCloud Drive
- OneDrive

Access from any device with sync enabled.

## 🎨 Customization

### Create Aliases (Linux/Mac)
```bash
# Add to ~/.bashrc or ~/.zshrc
alias links='cd ~/path/to/CLAUDEPLAYGRND && npm run links'
alias links-dash='cd ~/path/to/CLAUDEPLAYGRND && npm run links:second-brain'
alias links-search='cd ~/path/to/CLAUDEPLAYGRND && npx ts-node search.ts'

# Now just type:
links                    # Open CLI
links-dash              # View dashboard
links-search "term"     # Quick search
```

### Windows Shortcuts
Create `.bat` files:

```batch
@echo off
cd C:\path\to\CLAUDEPLAYGRND
npm run links
```

Save as `links.bat` and double-click to run.

## 🚀 Pro Tips

1. **Use Smart Collections** for frequent searches
   - "Daughter's Urgent Items"
   - "Work This Week"
   - "Personal Learning"

2. **Set Due Dates** for time-sensitive content
   - Science fair project deadline
   - Course enrollment dates
   - Work project milestones

3. **Tag Consistently**
   - Use lowercase tags
   - Create tag naming conventions
   - Example: "urgent", "reference", "tutorial"

4. **Regular Exports**
   ```bash
   npm run links
   # Select "10. Export links"
   # Backup weekly to external location
   ```

5. **Use Person Field**
   - "daughter"
   - "me"
   - "spouse"
   - "team-john"

## 📱 Mobile-Friendly Alternative (Coming Next!)

I can create a simple HTML page that:
- Works offline
- Reads/writes to links.json
- Mobile responsive
- No server needed
- Just open in browser

Want me to create this?

## 🔍 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run links` | Interactive CLI |
| `npm run links:example` | See usage examples |
| `npm run links:second-brain` | View full dashboard |
| Edit `data/links.json` | Direct editing |
| `npx ts-node utils/link-organizer-cli.ts` | Run CLI directly |

## 🆘 Troubleshooting

**"Module not found"**
```bash
npm install
```

**"ts-node not found"**
```bash
npm install -g ts-node typescript
# Or use: npx ts-node
```

**Want to reset/start fresh?**
```bash
cp data/links.json data/links.backup.json
echo "[]" > data/links.json
```

## Next Steps

1. ✅ Run `npm run links` to try it out
2. ✅ Add your first real link
3. ✅ Set up cloud sync for mobile access
4. ✅ Create shortcuts/aliases for quick access
5. ✅ Set up a weekly review routine

Let me know if you want:
- A web interface for browser/mobile use
- A mobile app integration
- Email-to-organizer setup
- Custom scripts for your workflow
