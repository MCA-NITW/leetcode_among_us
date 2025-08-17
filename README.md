# 🚀 LeetCode Among Us

[![Node.js](https://img.shields.io/badge/Node.js-20.5.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

Welcome to **LeetCode Among Us** - a competitive programming platform designed
specifically for MCA students at NIT Warangal! 🎯

This web application creates a thriving competitive environment where students
can track their LeetCode progress, compete with batch-mates, and celebrate
coding achievements together. Whether you're grinding daily problems or
preparing for placements, this platform provides the motivation and insights you
need to excel! 💪

## ✨ Features

🏆 **Personal LeetCode Dashboard**: Track your problem-solving journey with
detailed analytics and progress insights

📊 **Dynamic Leaderboards**: Real-time rankings within your batch to fuel
healthy competition

🎖️ **Recognition System**: Celebrate top performers and milestone achievements

📈 **Batch Comparisons**: Compare performance across different MCA batches for
broader perspective

🔄 **Live Data Sync**: Automatic updates from LeetCode API for real-time
statistics

🎨 **Modern UI/UX**: Clean, responsive design for seamless user experience

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0, Bootstrap, AG-Grid
- **Backend**: Node.js, Express 4.x
- **APIs**: LeetCode GraphQL API
- **Deployment**: Production-ready build system

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 20.5.0 or higher)
- **npm** (comes with Node.js)
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MCA-NITW/leetcode_among_us.git
   cd leetcode_among_us
   ```

2. **Install dependencies**

   ```bash
   npm install
   npm run build
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Frontend: http://localhost:3000
   Backend:  http://localhost:3001
   ```

### Available Scripts

| Command                  | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `npm run dev`            | Starts both frontend and backend in development mode |
| `npm start`              | Starts only the backend server                       |
| `npm run frontend-build` | Builds the React frontend for production             |
| `npm run build`          | Full production build                                |
| `npm run validate-json`  | Validates the LeetCode users JSON file format        |

## 🤝 Contributing - Add Your LeetCode ID

Want to join the leaderboard? Follow these simple steps to add yourself!

### Step 1: Fork & Clone

```bash
git clone https://github.com/your-username/leetcode_among_us.git
cd leetcode_among_us
```

### Step 2: Add Your Details

Navigate to `client/src/assets/leetcoders_data.json` and add your entry in this
exact format:

```json
{
  "id": "YOUR_STUDENT_ID",
  "name": "Your Full Name",
  "userName": "your_leetcode_username",
  "batch": "YYYY",
  "gender": "male/female"
}
```

### 📋 Example Entry

```json
{
  "id": "22MCF1R01",
  "name": "John Doe",
  "userName": "john_coder",
  "batch": "2025",
  "gender": "male"
}
```

### 📝 Field Descriptions

- **id**: Your official student ID (e.g., 22MCF1R01)
- **name**: Your full name as registered
- **userName**: Your exact LeetCode username (case-sensitive!)
- **batch**: Your graduation year (e.g., "2025", "2026")
- **gender**: "male" or "female"

### Step 3: Validate Your Changes (Optional but Recommended)

Run our validation script to check your JSON format:

```bash
npm run validate-json
```

This will check for:

- ✅ Proper JSON syntax
- ✅ Required fields
- ✅ No duplicate student IDs
- ✅ Valid batch and gender formats

### Step 4: Submit Your Changes

1. **Create a new branch**

   ```bash
   git checkout -b add-my-leetcode-id
   ```

2. **Commit your changes**

   ```bash
   git add .
   git commit -m "Add [Your Name] to LeetCode leaderboard"
   ```

3. **Push and create PR**
   ```bash
   git push origin add-my-leetcode-id
   ```
   Then create a Pull Request on GitHub!

### ⚠️ Important Notes

- **Username Accuracy**: Make sure your LeetCode username is 100% correct
- **JSON Format**: Follow the exact JSON structure to avoid errors
- **No Duplicates**: Check if your ID already exists before adding
- **Alphabetical Order**: Add your entry in alphabetical order by student ID

## 📁 Project Structure

```
LEETCODE_AMONG_US/
├── client/                     # React frontend
│   ├── public/                 # Static files
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── src/
│   │   ├── api/                # API calls & GraphQL queries
│   │   │   ├── AllQueries.js
│   │   │   └── FetchData.js
│   │   ├── assets/             # Static data files
│   │   │   └── leetcoders_data.json  # 👈 Add your LeetCode ID here!
│   │   ├── components/         # Reusable components
│   │   │   ├── Dropdown.js
│   │   │   ├── Loader/
│   │   │   └── Nav/
│   │   ├── pages/              # Page components
│   │   │   ├── Home/
│   │   │   ├── LeaderBoard/
│   │   │   └── UserStats/
│   │   ├── utils/              # Utility functions
│   │   ├── App.js             # Main React component
│   │   └── index.js           # Entry point
│   └── package.json
├── server.mjs                  # Express server
├── package.json               # Server dependencies
└── README.md
```

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

## 🤔 FAQ

**Q: My LeetCode stats aren't showing up** A: Make sure your username in the
JSON file exactly matches your LeetCode profile username (case-sensitive)

**Q: How often does the leaderboard update?** A: The leaderboard updates in
real-time when you refresh the page

**Q: Can I update my information later?** A: Yes! Just submit another PR with
your updated information

**Q: What if I don't have a LeetCode account?** A: Create one at
[leetcode.com](https://leetcode.com) first, then add your username here

## 📞 Support

- **Issues**:
  [GitHub Issues](https://github.com/MCA-NITW/leetcode_among_us/issues)
- **Discussions**:
  [GitHub Discussions](https://github.com/MCA-NITW/leetcode_among_us/discussions)
- **Email**: Contact the maintainers

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file
for details.

## 🙏 Acknowledgments

- NIT Warangal MCA Department
- LeetCode for providing the GraphQL API
- All contributors who make this project possible

---

**Made with ❤️ by MCA students for MCA students**

_Happy Coding! 🚀_
