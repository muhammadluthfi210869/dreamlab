import fs from 'fs';
import path from 'path';

const articlesPath = path.join(process.cwd(), 'src', 'data', 'articles.ts');
let content = fs.readFileSync(articlesPath, 'utf-8');

const targetTitle = "This is somewhat embarrassing, isn’t it?";

while (content.includes(targetTitle)) {
    const titleIndex = content.indexOf(targetTitle);
    
    // Find the opening brace of the object containing this title
    let openBraceIndex = -1;
    let braceCount = 0;
    
    // Backtrack to find the start of the object
    for (let i = titleIndex; i >= 0; i--) {
        if (content[i] === '}') braceCount++;
        if (content[i] === '{') {
            if (braceCount === 0) {
                openBraceIndex = i;
                break;
            }
            braceCount--;
        }
    }
    
    // Find the closing brace of the object
    let closeBraceIndex = -1;
    braceCount = 0;
    for (let i = openBraceIndex; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        if (content[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                closeBraceIndex = i;
                break;
            }
        }
    }
    
    if (openBraceIndex !== -1 && closeBraceIndex !== -1) {
        // Include any trailing comma and whitespace
        let end = closeBraceIndex + 1;
        if (content[end] === ',') end++;
        while (content[end] && /\s/.test(content[end])) end++;
        
        content = content.substring(0, openBraceIndex) + content.substring(end);
    } else {
        break; // Safety break
    }
}

fs.writeFileSync(articlesPath, content);
console.log('✅ Articles cleaned with brace-counting logic!');
