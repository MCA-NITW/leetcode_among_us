# Leetcode Among Us

Welcome to the Leetcode Among Us - a web application dedicated to fostering a competitive environment among MCA students. This platform enables users to track their Leetcode statistics, view leaderboards within their batch, and gain recognition for outstanding performance. Whether you're looking to improve your coding skills or compete with your peers, Leetcode Among Us provides the tools and insights you need to excel.

## Project Overview

Leetcode Among Us is designed to encourage students by making their progress visible through a series of metrics and rankings. It features:

- **Personal Leetcode Statistics:** Allows students to monitor their own problem-solving progress with detailed analytics.
- **Batch Leaderboards:** Students can see where they stand among their peers in a dynamic leaderboard that updates with each submission.
- **Recognition and Rewards:** Top performers are highlighted and acknowledged, promoting a spirit of healthy competition.
- **Batch-wise Comparison:** Users can compare statistics across different MCA batches, enabling a broader perspective of performance.

This project is built with a focus on community and improvement, aiming to motivate students to achieve excellence in their coding endeavors.

## File Structure

The "Leetcode Among Us" project is organized into a clear and modular file structure, promoting ease of navigation and development. Here's an outline of the main directories and files:

```bash
LEETCODE_AMONG_US
├── client # Client-side code
│ ├── build # Compiled and ready to serve application files
│ ├── public # Public files like favicon and index.html
│ ├── src # Source files for React application
│ │ ├── api # API related functions and GraphQL queries
│ │ │ ├── GraphQLQueries.js
│ │ │ └── UserData.js
│ │ ├── assets # Static assets like JSON data
│ │ │ ├── leetcoders.js
│ │ │ └── leetcoders.json
│ │ ├── components # Reusable React components
│ │ │ ├── Loader
│ │ │ │ ├── Loader.css
│ │ │ │ └── Loader.js
│ │ │ ├── Nav
│ │ │ │ ├── NavBar.css
│ │ │ │ ├── NavBar.js
│ │ │ │ └── Dropdown.js
│ │ │ ├── LeaderBoard
│ │ │ │ ├── LeaderBoard.css
│ │ │ │ └── LeaderBoard.js
│ │ │ │  └── RankTable
│ │ │ │    ├── RankTable.css
│ │ │ │    └── RankTable.js
│ │ │ └── Dropdown.js
│ │ ├── pages # React components for pages
│ │ │ ├── Home
│ │ │   ├── Home.css
│ │ │   └── Home.js
│ │ ├── utils # Utility functions
│ │ │ └── dataProcessing.js
│ │ ├── App.css
│ │ ├── App.js # Main React application component
│ │ ├── index.css
│ │ └── index.js # Entry point for React application
│ ├── package.json # NPM dependencies and scripts
│ └── package-lock.json # Locked versions of dependencies
├── .gitignore # Specifies intentionally untracked files to ignore
├── package.json # NPM dependencies and scripts for server
├── package-lock.json # Locked versions of dependencies for server
├── README.md # README file with project information
├── SECURITY.md # Security policies and procedures
└── server.js # Server-side Node.js code
```

### Client

The `client` directory contains all the frontend code written in React. It's structured to separate the concerns of the application's user interface (UI).

- `public`: Contains the static files served by the React application, such as the favicon and the `index.html` file.
- `src`: The main folder for React source files, including components, pages, and utilities.
  - `api`: Holds the files related to API calls and GraphQL queries.
  - `assets`: Includes static data files, such as JSON files.
  - `components`: Reusable React components are placed here, each in its own subdirectory with its associated styling.
  - `pages`: Components representing entire pages in the application.
  - `utils`: Utility functions that can be shared across components and pages.

### Server

- `server.mjs`: The entry point for the server-side code. It contains the setup for the Node.js server, including routes and middleware.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (Preferably version 20.5.0)
- npm (Comes with Node.js)

These software applications are essential to run the "Leetcode Among Us" application locally. If you need to install Node.js, visit the [official Node.js website](https://nodejs.org/) and download the version specified above.

## Installation

To get the "Leetcode Among Us" app up and running on your local machine, follow these steps:

### Steps

1. Creating your branch:

   I. For Organization Members:

   - **Branch Creation:**
     As an organization member, when working on a new feature or task, you should create a new branch from the "develop" branch. The branch name should be in the format `feature-` where `<description>` represents a short description of the task or feature you are working on. For example, if you are adding a login feature, the branch name could be `feature-login`.
   - **Code Implementation:**
     Implement the necessary changes and new features on your created branch. Make sure to adhere to the organization's coding standards and best practices.
   - **Code Testing:**
     Thoroughly test your changes on the branch to ensure that they work as expected and do not introduce any bugs or issues.
   - **Code Review:**
     If required by the organization's development process, request a code review from your peers to ensure code quality and adherence to project guidelines.
   - **Pull Request Creation:**
     Once you are confident that your code is complete and tested, create a pull request to merge your changes from the `feature-*` branch into the `develop` branch. Clearly explain the purpose and scope of the changes in the pull request description.

   II. For Outside Collaborators:

   - **Clone the Repository:**
     As an outside collaborator, you first need to clone the repository containing the project. This will give you a local copy of the codebase to work with.
   - **Create a New Branch:**
     After cloning, create a new branch from the `develop` branch to work on your specific task or feature. The branch name should also follow the format `feature-` where `<description>` describes the purpose of your changes.
   - **Implement Changes:**
     Proceed with implementing the necessary code changes or new features on your branch. Ensure your modifications align with the project's guidelines and meet the intended functionality.
   - **Test Your Changes:**
     Thoroughly test the code changes you made to verify that they work as expected and do not introduce any errors.
   - **Create a Pull Request:**
     Once your changes are ready, create a pull request to propose merging your branch into the `develop` branch. Provide a clear and detailed explanation of the changes you made, the reasoning behind them, and any relevant context that might help with the review process.
   - **Address Feedback:**
     Be responsive to any feedback or comments provided during the pull request review. Make necessary adjustments and improvements based on the feedback before your changes can be merged into the main project.

2. Change into the project directory:

   ```bash
   cd leetcode_among_us
   ```

3. Install project dependencies:

   ```bash
   npm install
   npm run build
   ```

   This command will install the necessary dependencies for both the frontend and backend.

4. Start the development server:

   I. For frontend and backend both

   ```bash
   npm run dev
   ```

   This command will start the development server for both the frontend and backend.

   II. For backend only

   ```bash
   npm start
   ```

   This command will start the development server for backend.

   III. For frontend only

   ```bash
    npm frontend-start
   ```

   This command will start the development server for frontend.

5. Open the application in your browser:

   ```bash
   http://localhost:3001/
   ```

   The application should now be running in your browser.
