# Contributing Guide - Adding Your LeetCode ID

Welcome to LeetCode Among Us! This guide will help you add your LeetCode ID to join the leaderboard.

## Quick Steps

1. **Fork this repository** to your GitHub account
2. **Clone your fork** locally
3. **Edit the JSON file** at `client/src/assets/leetcoders_data.json`
4. **Add your entry** following the format below
5. **Submit a Pull Request**

## JSON Format

Add your entry to the `leetcoders_data.json` file in this exact format:

```json
{
  "id": "YOUR_STUDENT_ID",
  "name": "Your Full Name",
  "userName": "your_leetcode_username",
  "batch": "YYYY",
  "gender": "male/female"
}
```

## Example

```json
{
  "id": "22MCF1R01",
  "name": "John Doe", 
  "userName": "john_coder",
  "batch": "2025",
  "gender": "male"
}
```

## Field Requirements

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Your official student ID | `"22MCF1R01"` |
| `name` | Your full name | `"John Doe"` |
| `userName` | Your exact LeetCode username (case-sensitive!) | `"john_coder"` |
| `batch` | Your graduation year | `"2025"` |
| `gender` | Your gender | `"male"` or `"female"` |

## Important Notes

- ⚠️ **Username must be exact**: Your LeetCode username is case-sensitive
- 📝 **No duplicates**: Check if your ID already exists
- 📋 **JSON format**: Make sure to follow the exact structure
- 🔤 **Alphabetical order**: Add your entry in order by student ID

## Common Mistakes

❌ **Wrong username case**: `"John_Coder"` vs `"john_coder"`
❌ **Missing quotes**: `name: John Doe` instead of `"name": "John Doe"`
❌ **Missing comma**: Between JSON objects
❌ **Typos in student ID**: Double-check your official ID

## Need Help?

- Check the existing entries in the JSON file for reference
- Open an issue if you need assistance
- Contact the maintainers

Happy coding! 🚀
