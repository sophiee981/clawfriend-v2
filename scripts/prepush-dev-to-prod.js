#!/usr/bin/env node

/**
 * Prepush script to block push if dev files exist when pushing to main branch
 * Blocks push if these files exist:
 * - public/heartbeat-dev.md
 * - public/skill-dev.md
 */

const fs = require('fs');
const path = require('path');

// Get current git branch
function getCurrentBranch() {
  try {
    const { execSync } = require('child_process');
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    return branch;
  } catch (error) {
    console.error('Error getting git branch:', error.message);
    return null;
  }
}

// Main function
function main() {
  const branch = getCurrentBranch();
  
  // Only check on main branch
  if (branch !== 'main' && branch !== 'master' && branch !== 'production' && branch !== 'prod') {
    return;
  }
  
  // Files that should not exist on main branch
  const devFiles = [
    'public/heartbeat-dev.md',
    'public/skill-dev.md',
  ];
  
  const existingFiles = [];
  
  devFiles.forEach((file) => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      existingFiles.push(file);
    }
  });
  
  if (existingFiles.length > 0) {
    console.error('\n❌ Push blocked: Dev files found on main branch');
    console.error('\nThe following dev files must be deleted before pushing to main:');
    existingFiles.forEach((file) => {
      console.error(`  - ${file}`);
    });
    console.error('\nPlease delete these files and try again.');
    process.exit(1);
  }
}

// Run the script
main();
