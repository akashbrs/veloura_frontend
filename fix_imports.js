import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, 'src');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });

    return arrayOfFiles;
}

const files = getAllFiles(srcDir);
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Match import/export statements
    const importRegex = /(import|export)\s+(?:type\s+)?(?:(?:[^"']+)from\s+)?['"](\.\.?[^'"]+)['"]|(?:import\()[\s]*['"](\.\.?[^'"]+)['"][\s]*\)/g;

    let newContent = content;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
        const fullMatch = match[0];
        const importPath = match[2] || match[3];
        
        if (importPath) {
            const absoluteImportPath = path.resolve(path.dirname(file), importPath);
            
            if (absoluteImportPath.startsWith(srcDir)) {
                let relativeToSrc = path.relative(srcDir, absoluteImportPath);
                relativeToSrc = relativeToSrc.replace(/\\/g, '/');
                
                const newImportPath = `@/${relativeToSrc}`;
                
                const replacedMatch = fullMatch.replace(/(['"])(\.\.?[^'"]+)(['"])/, `$1${newImportPath}$3`);
                
                newContent = newContent.replace(fullMatch, replacedMatch);
                modified = true;
            }
        }
    }

    if (modified) {
        fs.writeFileSync(file, newContent, 'utf8');
        changedFiles++;
    }
});

console.log(`Successfully converted relative imports to absolute imports in ${changedFiles} files.`);
