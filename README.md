# Ocula Technologies - Who's Who? Quiz

A "guess who" style quiz where users match photos to team member names. Built with React + Vite, hosted on GitHub Pages, with scores stored in Google Sheets.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📁 Setup Checklist

### 1. Add the Ocula Logo

Save the Ocula Technologies logo to:
- `public/ocula-logo.png` - Main logo (displayed on quiz screens)
- `public/ocula-favicon.png` - Favicon (optional, 32x32 or 64x64)

### 2. Add Team Photos

Place photos in `public/images/` named as:
- `person1.jpg`
- `person2.jpg`
- etc.

Then update `src/data/questions.js` with the correct names:

```javascript
export const questions = [
  {
    id: 1,
    imageUrl: '/images/person1.jpg',
    correctAnswer: 'John Smith',
  },
  // Add more...
];
```

### 3. Set Up Google Sheets (for score tracking)

1. Create a new Google Sheet with columns:
   - A: Timestamp
   - B: Player Name
   - C: Score
   - D: Total Questions
   - E: Percentage
   - F: Answers (JSON)

2. Go to **Extensions > Apps Script** and paste:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.playerName,
    data.score,
    data.total,
    data.percentage,
    JSON.stringify(data.answers)
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const password = e.parameter.password;
  
  if (password !== 'YOUR_ADMIN_PASSWORD_HERE') {
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Unauthorized' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1);
  
  const results = rows.map(row => ({
    timestamp: row[0],
    playerName: row[1],
    score: row[2],
    total: row[3],
    percentage: row[4],
    answers: row[5]
  }));
  
  return ContentService
    .createTextOutput(JSON.stringify(results))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Deploy: **Deploy > New Deployment > Web app**
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Copy the deployment URL

4. Update `src/utils/api.js`:
   - Replace `YOUR_DEPLOYED_APPS_SCRIPT_URL` with your URL
   - Replace `YOUR_ADMIN_PASSWORD_HERE` with your password

### 4. Update Repo Name (for GitHub Pages)

In `vite.config.js`, change the base path to your repo name:

```javascript
base: '/your-repo-name/',
```

## 🌐 Deployment

```bash
npm run deploy
```

This builds the app and deploys to GitHub Pages.

## 📍 URLs

After deployment:
- **Quiz:** `https://yourusername.github.io/repo-name/`
- **Admin:** `https://yourusername.github.io/repo-name/#/admin`

## 🎨 Customization

Colors and styles are in `src/index.css`. The theme uses Ocula's brand colors:
- Navy: `#1A1F3D`
- Green: `#7BE495`

## 📝 Project Structure

```
src/
├── components/
│   ├── Quiz.jsx          # Main quiz logic + start screen
│   ├── QuizQuestion.jsx  # Single question display
│   ├── Results.jsx       # Score display
│   └── Admin.jsx         # Leaderboard (password protected)
├── data/
│   └── questions.js      # Quiz questions & answers
├── utils/
│   └── api.js            # Google Sheets API calls
├── App.jsx               # Router
├── main.jsx              # Entry point
└── index.css             # All styles
```

## 🔒 Security Notes

- Admin password is client-side (prevents casual access, not bulletproof)
- Google Sheet itself is the secure data store
- Apps Script doGet has password protection for API
