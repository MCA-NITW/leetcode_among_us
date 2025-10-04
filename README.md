# 🚀 LeetCode Among Us

[![Node.js](https://img.shields.io/badge/Node.js-20.5.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![React Icons](https://img.shields.io/badge/React_Icons-5.x-red.svg)](https://react-icons.github.io/react-icons/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

Welcome to **LeetCode Among Us** - a competitive programming platform designed
specifically for MCA students at NIT Warangal! 🎯

This web application creates a thriving competitive environment where students
can track their LeetCode progress, compete with batch-mates, and celebrate
coding achievements together. Whether you're grinding daily problems or
preparing for placements, this platform provides the motivation and insights you
need to excel! 💪

## ✨ Features

🏆 **Personal LeetCode Dashboard**

- Complete profile analytics with country, school, and skills
- Detailed problem-solving statistics across all difficulty levels
- Contest performance tracking with ratings and rankings
- Badge collection and achievement showcase
- Activity calendar and submission timeline

📊 **Advanced Leaderboards**

- Real-time rankings with dynamic filtering
- Multiple view modes: Overview, Problem Stats, Contest Stats, Performance
- Custom sorting by any metric
- Batch-wise comparisons
- 🥇🥈🥉 Colored medal badges for top 3 performers

🎨 **Modern UI/UX**

- Professional React Icons throughout the application
- Clean, responsive design for all devices
- Dark mode support
- Intuitive navigation and user experience
- Fast, optimized performance

📈 **Comprehensive Analytics**

- Language proficiency tracking
- Topic-wise problem distribution
- Acceptance rate analysis
- Recent submission history
- Global and country-wise rankings

🔄 **Live Data Sync**

- Automatic updates from LeetCode GraphQL API
- Real-time statistics refresh
- Optimized data fetching with caching

## 🛠️ Tech Stack

### Frontend

- **React** 18.2.0 - Modern UI library
- **React Router** - Client-side routing
- **React Icons** 5.x - Professional icon library (Font Awesome, Material
  Design, Box Icons, etc.)
- **Custom CSS** - Responsive styling

### Backend

- **Node.js** 20.5.0+ - JavaScript runtime
- **Express** 4.x - Web application framework
- **Concurrently** - Run multiple npm scripts

### APIs & Data

- **LeetCode GraphQL API** - Fetch user statistics
- **Custom Data Processing** - Optimized leaderboard calculations
- **JSON Data Storage** - User information management

### Development Tools

- **Nodemon** - Auto-restart server on changes
- **ESLint** - Code quality and consistency
- **Git** - Version control

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20.5.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **LeetCode Account** - [Create one here](https://leetcode.com) if you don't
  have one

### Installation & Setup

#### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/MCA-NITW/leetcode_among_us.git

# Navigate to project directory
cd leetcode_among_us
```

#### 2. Install Dependencies

```bash
# Install all dependencies (both server and client)
npm install

# Build the client
npm run build
```

#### 3. Start the Application

```bash
# Start both frontend and backend in development mode
npm run dev
```

#### 4. Open Your Browser

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

### Available Scripts

| Command                  | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `npm run dev`            | Starts both frontend and backend in development mode |
| `npm start`              | Starts only the backend server                       |
| `npm run frontend-build` | Builds the React frontend for production             |
| `npm run build`          | Full production build                                |
| `npm run validate-json`  | Validates the LeetCode users JSON file format        |

---

## 🎯 How to Add Your LeetCode Profile

Want to join the leaderboard and track your progress? Follow these detailed
steps!

### Option A: For Your Own Use (Fork Method)

#### Step 1: Fork the Repository

1. Visit the
   [LeetCode Among Us Repository](https://github.com/MCA-NITW/leetcode_among_us)
2. Click the **"Fork"** button in the top-right corner
3. This creates a copy of the repository in your GitHub account

#### Step 2: Clone YOUR Fork

```bash
# Clone your forked repository (replace YOUR-USERNAME with your GitHub username)
git clone https://github.com/YOUR-USERNAME/leetcode_among_us.git

# Navigate to the project
cd leetcode_among_us

# Install dependencies
npm install
```

#### Step 3: Add Your Friends' LeetCode Usernames

Navigate to `client/src/assets/leetcoders_data.json` and add entries for you and
your peers:

```json
[
  {
    "id": "22MCF1R01",
    "name": "Your Name",
    "userName": "your_leetcode_username",
    "batch": "2025",
    "gender": "male"
  },
  {
    "id": "22MCF1R02",
    "name": "Friend One",
    "userName": "friend1_leetcode_username",
    "batch": "2025",
    "gender": "female"
  },
  {
    "id": "22MCF1R03",
    "name": "Friend Two",
    "userName": "friend2_leetcode_username",
    "batch": "2025",
    "gender": "male"
  }
]
```

#### Step 4: Validate Your Changes

```bash
# Run the validation script to check for errors
npm run validate-json
```

This will check for:

- ✅ Valid JSON syntax
- ✅ Required fields (id, name, userName, batch, gender)
- ✅ No duplicate student IDs
- ✅ Proper data formats

#### Step 5: Run Your Custom Version

```bash
# Start the application with your custom data
npm run dev
```

Now visit [http://localhost:3000](http://localhost:3000) to see your
personalized leaderboard!

---

### Option B: Contribute to the Official Repository (Pull Request Method)

If you want to add yourself to the official NIT Warangal leaderboard:

#### Step 1: Fork & Clone

```bash
# Fork the repository first (click Fork button on GitHub)
# Then clone your fork
git clone https://github.com/YOUR-USERNAME/leetcode_among_us.git
cd leetcode_among_us
```

#### Step 2: Create a New Branch

```bash
# Create a feature branch for your changes
git checkout -b add-your-name-leetcode-id
```

#### Step 3: Add Your Entry

Edit `client/src/assets/leetcoders_data.json` and add your entry:

```json
{
  "id": "YOUR_STUDENT_ID",
  "name": "Your Full Name",
  "userName": "your_leetcode_username",
  "batch": "YYYY",
  "gender": "male/female"
}
```

**📋 Field Descriptions:**

| Field      | Description                                        | Example      |
| ---------- | -------------------------------------------------- | ------------ |
| `id`       | Your official student ID                           | "22MCF1R01"  |
| `name`     | Your full name as registered                       | "John Doe"   |
| `userName` | Your **exact** LeetCode username (case-sensitive!) | "john_coder" |
| `batch`    | Your graduation year                               | "2025"       |
| `gender`   | "male" or "female"                                 | "male"       |

#### Step 4: Validate Your JSON

```bash
npm run validate-json
```

#### Step 5: Commit & Push

```bash
# Stage your changes
git add client/src/assets/leetcoders_data.json

# Commit with a descriptive message
git commit -m "Add [Your Name] to LeetCode leaderboard"

# Push to your fork
git push origin add-your-name-leetcode-id
```

#### Step 6: Create Pull Request

1. Go to your fork on GitHub
2. Click **"Compare & pull request"**
3. Add a clear title: `Add [Your Name] - [Student ID]`
4. Describe your changes in the PR description
5. Submit the Pull Request!

---

## 🎨 Customization Guide

### Change the Application for Your College/Group

#### 1. Update Branding

Edit `client/src/pages/Home/Home.js`:

```javascript
// Update title and descriptions
const title = 'Your College Name - LeetCode Tracker'
const description = 'Track LeetCode progress for your college students'
```

#### 2. Modify Student ID Format

If your college uses different ID formats, update the validation in
`validate-json.js`:

```javascript
// Change the ID pattern
const idPattern = /^YOUR_PATTERN$/
```

#### 3. Add Custom Batches

Edit `client/src/assets/leetcoders_data.json` and use your graduation years:

```json
{
  "batch": "2024" // Your graduation year
}
```

#### 4. Customize Colors & Theme

Edit CSS files in respective component folders:

- `client/src/pages/Home/Home.css` - Homepage styling
- `client/src/pages/UserStats/UserStats.css` - User profile styling
- `client/src/pages/LeaderBoard/LeaderBoard.css` - Leaderboard styling

#### 5. Change Icons

Icons are from [React Icons](https://react-icons.github.io/react-icons/). To
change any icon:

```javascript
// Import the icon you want
import { FaNewIcon } from 'react-icons/fa'

// Replace old icon with new one
;<FaNewIcon />
```

---

## 📁 Project Structure

```
LEETCODE_AMONG_US/
├── client/                          # React frontend application
│   ├── public/                      # Static files
│   │   ├── favicon.ico             # App icon
│   │   └── index.html              # HTML template
│   ├── src/
│   │   ├── api/                    # API communication layer
│   │   │   ├── AllQueries.js       # GraphQL queries for LeetCode API
│   │   │   ├── FetchData.js        # Data fetching functions
│   │   │   └── OptimizedFetchData.js  # Optimized data fetching with caching
│   │   ├── assets/                 # Static data files
│   │   │   ├── leetcoders_data.json   # 👈 ADD YOUR LEETCODE ID HERE!
│   │   │   └── TEMPLATE_ENTRY.json    # Template for new entries
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Dropdown.js         # Dropdown selector
│   │   │   ├── CacheManager/       # Cache management component
│   │   │   ├── Loader/             # Loading spinner
│   │   │   │   ├── Loader.js
│   │   │   │   └── Loader.css
│   │   │   └── Nav/                # Navigation bar
│   │   │       ├── NavBar.js
│   │   │       └── NavBar.css
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── pages/                  # Page components
│   │   │   ├── Home/               # Landing page
│   │   │   │   ├── Home.js
│   │   │   │   └── Home.css
│   │   │   ├── LeaderBoard/        # Leaderboard page
│   │   │   │   ├── LeaderBoard.js
│   │   │   │   ├── LeaderBoard.css
│   │   │   │   └── RankTable/      # Leaderboard table component
│   │   │   │       ├── CustomRankTable.js
│   │   │   │       └── CustomRankTable.css
│   │   │   └── UserStats/          # User statistics page
│   │   │       ├── UserStats.js
│   │   │       └── UserStats.css
│   │   ├── utils/                  # Utility functions
│   │   │   ├── leaderboardData.js         # Leaderboard calculations
│   │   │   ├── optimizedLeaderboardData.js # Optimized data processing
│   │   │   └── userStatsData.js           # User statistics processing
│   │   ├── App.js                  # Main React component
│   │   ├── index.js                # Entry point
│   │   └── index.css               # Global styles
│   └── package.json                # Client dependencies
├── server.mjs                       # Express backend server
├── validate-json.js                 # JSON validation script
├── package.json                     # Server dependencies & scripts
├── CONTRIBUTING.md                  # Contribution guidelines
├── SECURITY.md                      # Security policy
└── README.md                        # This file!
```

### 🔑 Key Files to Know

| File/Folder                               | Purpose                                             | When to Edit              |
| ----------------------------------------- | --------------------------------------------------- | ------------------------- |
| `client/src/assets/leetcoders_data.json`  | **User database** - Contains all LeetCode usernames | Add your profile here!    |
| `client/src/pages/Home/Home.js`           | Landing page content                                | Customize welcome message |
| `client/src/pages/UserStats/UserStats.js` | User profile page                                   | Modify stats display      |
| `client/src/pages/LeaderBoard/`           | Leaderboard functionality                           | Customize rankings view   |
| `server.mjs`                              | Backend API server                                  | Modify API endpoints      |
| `validate-json.js`                        | Data validation                                     | Update validation rules   |

---

## 🔧 Development Guidelines

### For Organization Members

1. **Branch Creation**: Create feature branches from `main`

   ```bash
   git checkout -b feature-description
   ```

2. **Development**: Implement changes following coding standards

3. **Testing**: Thoroughly test your changes locally

4. **Pull Request**: Create PR with clear description

### For External Contributors

1. **Fork**: Fork the repository to your account

2. **Clone**: Clone your fork locally

3. **Branch**: Create a feature branch

4. **Develop**: Make your changes

5. **PR**: Submit pull request with detailed explanation

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Variables

Create `.env` file in root directory:

```env
PORT=3001
NODE_ENV=production
```

## 🤔 Frequently Asked Questions (FAQ)

### General Questions

**Q: What is LeetCode Among Us?** A: It's a web application that helps students
track and compare their LeetCode progress with peers, creating a competitive and
motivating environment for coding practice.

**Q: Who can use this application?** A: Anyone! While it's designed for MCA
students at NIT Warangal, you can fork the repository and customize it for your
college, friend group, or coding club.

**Q: Is this application free to use?** A: Yes! It's completely free and
open-source under the ISC License.

### Setup & Installation

**Q: I'm getting installation errors. What should I do?** A: Make sure you have:

- Node.js version 20.5.0 or higher
- Latest npm version
- Try deleting `node_modules` and `package-lock.json`, then run `npm install`
  again

**Q: The application won't start. Help!** A: Check these common issues:

- Port 3000 or 3001 might be in use (close other applications)
- Run `npm install` in both root and `client` folders
- Check if Node.js is properly installed: `node --version`

**Q: How do I update to the latest version?** A:

```bash
git pull origin main
npm install
npm run build
npm run dev
```

### Adding Your Profile

**Q: My LeetCode stats aren't showing up. What's wrong?** A: Check these points:

- Your LeetCode username must be **exactly** correct (case-sensitive!)
- Your LeetCode profile must be **public** (not private)
- Wait a few seconds and refresh the page
- Check browser console for any errors (F12 key)

**Q: How do I find my exact LeetCode username?** A:

1. Go to your LeetCode profile: `leetcode.com/u/your-username`
2. The username in the URL is your **exact** username
3. Copy it exactly as shown (including case)

**Q: Can I add multiple people at once?** A: Yes! Just add multiple JSON entries
in `leetcoders_data.json`, separated by commas.

**Q: What if I don't have a LeetCode account?** A: Create one for free at
[leetcode.com/accounts/signup](https://leetcode.com/accounts/signup). It only
takes a minute!

**Q: Can I update my information later?** A: Yes! Just edit your entry in
`leetcoders_data.json` and submit a new PR (for official repo) or commit
directly (for your fork).

**Q: I made a typo in my username. How do I fix it?** A: Edit
`client/src/assets/leetcoders_data.json`, correct your username, and restart the
application.

### Data & Privacy

**Q: How often does the leaderboard update?** A: The data refreshes every time
you reload the page. LeetCode stats are fetched in real-time from the LeetCode
API.

**Q: Is my data safe?** A: Yes! We only fetch publicly available LeetCode
statistics. No passwords or private data are accessed.

**Q: Where is the data stored?** A: User information (names, IDs, LeetCode
usernames) is stored locally in `leetcoders_data.json`. LeetCode statistics are
fetched from LeetCode's public API.

**Q: Can I delete my data?** A: Yes! Simply remove your entry from
`leetcoders_data.json`.

### Customization

**Q: Can I use this for my college/group?** A: Absolutely! Fork the repository
and customize it:

- Update branding in `Home.js`
- Modify student ID format in `validate-json.js`
- Add your peers' LeetCode usernames
- Deploy to your own server

**Q: How do I change the appearance?** A: Edit the CSS files in component
folders:

- Colors and themes: Edit CSS variables
- Icons: Import different icons from React Icons library
- Layout: Modify component JSX structure

**Q: Can I add more features?** A: Yes! It's open source. You can:

- Add new statistics
- Create custom visualizations
- Implement new filtering options
- Contribute back to the main repository!

### Contributing

**Q: How do I contribute to the project?** A:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a Pull Request with clear description

**Q: I found a bug. Where do I report it?** A: Create an issue on
[GitHub Issues](https://github.com/MCA-NITW/leetcode_among_us/issues) with:

- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

**Q: Can I suggest new features?** A: Absolutely! Open a feature request in
[GitHub Discussions](https://github.com/MCA-NITW/leetcode_among_us/discussions).

---

## 🚀 Deployment

### Local Development

```bash
npm run dev  # Runs on localhost:3000
```

### Production Build

```bash
# Build the frontend
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
NODE_ENV=production
```

### Deployment Platforms

This application can be deployed to:

- **Vercel** - Frontend hosting
- **Heroku** - Full-stack deployment
- **Netlify** - Static site hosting
- **AWS/Azure/GCP** - Cloud platforms
- **Self-hosted** - Your own server

---

## 🔒 Security

- Report security vulnerabilities privately via email to maintainers
- See [SECURITY.md](SECURITY.md) for our security policy
- Keep dependencies updated regularly
- Never commit sensitive data or API keys

---

## 📞 Support & Community

- **Issues**:
  [GitHub Issues](https://github.com/MCA-NITW/leetcode_among_us/issues)
- **Discussions**:
  [GitHub Discussions](https://github.com/MCA-NITW/leetcode_among_us/discussions)
- **Email**: Contact the maintainers
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE)
file for details.

You are free to:

- ✅ Use commercially
- ✅ Modify and distribute
- ✅ Use privately
- ✅ Sublicense

---

## 🙏 Acknowledgments

- **NIT Warangal MCA Department** - For fostering a competitive coding culture
- **LeetCode** - For providing the comprehensive GraphQL API
- **React Icons** - For the beautiful icon library
- **All Contributors** - Who make this project possible
- **You** - For using and improving this platform!

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

## 📈 Roadmap

### Upcoming Features

- [ ] Contest predictions and reminders
- [ ] Weekly/Monthly challenge tracking
- [ ] Team competitions
- [ ] Achievement badges and milestones
- [ ] Social features (comments, discussions)
- [ ] Mobile app
- [ ] Email notifications
- [ ] Advanced analytics and insights

### Want to Help?

Check out [CONTRIBUTING.md](CONTRIBUTING.md) to see how you can contribute to
these features!

---

**Made with ❤️ by MCA students for MCA students**

**Happy Coding! Keep solving problems! 🚀**

---

## 📸 Screenshots

_(Add screenshots of your application here)_

---

_Last Updated: October 2025_

_Version: 2.0.0_
