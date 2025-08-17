#!/usr/bin/env node

/**
 * Simple validation script for leetcoders_data.json
 * Run this script to validate your JSON format before submitting a PR
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, 'client', 'src', 'assets', 'leetcoders_data.json');

function validateJSON() {
  try {
    // Read the JSON file
    const data = fs.readFileSync(jsonPath, 'utf8');
    const leetcoders = JSON.parse(data);

    console.log('🔍 Validating JSON format...\n');

    // Check if it's an array
    if (!Array.isArray(leetcoders)) {
      console.error('❌ Error: Root should be an array');
      return false;
    }

    let isValid = true;
    const studentIds = new Set();

    // Validate each entry
    leetcoders.forEach((entry, index) => {
      const requiredFields = ['id', 'name', 'userName', 'batch', 'gender'];
      
      console.log(`Checking entry ${index + 1}: ${entry.name || 'Unknown'}`);

      // Check required fields
      requiredFields.forEach(field => {
        if (!entry[field]) {
          console.error(`❌ Entry ${index + 1}: Missing field '${field}'`);
          isValid = false;
        }
      });

      // Check for duplicate IDs
      if (entry.id) {
        if (studentIds.has(entry.id)) {
          console.error(`❌ Entry ${index + 1}: Duplicate student ID '${entry.id}'`);
          isValid = false;
        }
        studentIds.add(entry.id);
      }

      // Validate gender
      if (entry.gender && !['male', 'female'].includes(entry.gender)) {
        console.error(`❌ Entry ${index + 1}: Invalid gender '${entry.gender}'. Use 'male' or 'female'`);
        isValid = false;
      }

      // Validate batch format (should be 4 digits)
      if (entry.batch && !/^\d{4}$/.test(entry.batch)) {
        console.error(`❌ Entry ${index + 1}: Invalid batch format '${entry.batch}'. Use YYYY format (e.g., '2025')`);
        isValid = false;
      }

      console.log(`✅ Entry ${index + 1}: OK\n`);
    });

    if (isValid) {
      console.log('🎉 All entries are valid!');
      console.log(`📊 Total entries: ${leetcoders.length}`);
      return true;
    } else {
      console.log('\n❌ Validation failed. Please fix the errors above.');
      return false;
    }

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ Error: leetcoders_data.json file not found');
    } else if (error instanceof SyntaxError) {
      console.error('❌ Error: Invalid JSON format');
      console.error(error.message);
    } else {
      console.error('❌ Error:', error.message);
    }
    return false;
  }
}

// Run validation
const isValid = validateJSON();
process.exit(isValid ? 0 : 1);
