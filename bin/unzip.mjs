import Zip from 'adm-zip';
import path from 'path';
import process from 'process';
import fs from 'fs-extra';

// TODO: Support multiple zip folders for multiple outputs/publications

// Check if arguments have been based
// Allows for the user to change the zip folder
if (process.argv.length <= 2) {
  console.error(
    'Must provide a path to a zip folder: zipName=<path>/<to>/<filename>'
  );
  process.exit(1);
}

// If the argument we want exists
// Filter it out
const splitArgs = process.argv.filter((arg) => {
  if (arg.includes('zipName')) {
    return arg;
  }
});

// Get the final path
const zipName = splitArgs?.[0]?.split('=')[1];
const zipPath = `${zipName}.zip`;

// If the path doesn't exists
// fail the program
if (!zipPath) {
  console.error(
    'Must provide a path to a zip folder: zipName=<path>/<to>/<filename>'
  );
  process.exit(1);
}

// -- Main function
// Finally extract the zipfile
const outputPath = path.join(process.cwd(), 'tmp');
const zip = new Zip(zipPath);
zip.extractAllTo(outputPath, true);

// Move files to out folder for netlify
const srcPath = path.join(process.cwd(), 'tmp', zipName, 'out');
const outPath = path.join(process.cwd(), 'out');
fs.move(srcPath, outPath, { overwrite: true });
