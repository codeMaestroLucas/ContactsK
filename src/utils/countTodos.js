const fs = require('fs');
const path = require('path');

const folders = [ 'ByClick', 'ByFilter', 'ByPage', 'ByNewPage' ];

console.log("-".repeat(25))


function formatedPrint(name, total) {
    const padding = 15 - name.length;
    const emptySpaces = " ".repeat(padding > 0 ? padding : 0);
    console.log(`- \x1b[33m${name}\x1b[0m:${emptySpaces}\x1b[1m${total}\x1b[0m`);
}

let totalObjects = 0;
folders.forEach(folder => {
    const filePath = path.join('src', 'sites', folder, 'todo.json');
    
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const todos = JSON.parse(data);
        
        // Each todo has 2 empty objects
        const total = Array.isArray(todos) ? todos.length - 2 : 0;
        totalObjects += total;
        
        formatedPrint(folder, total);
    } catch (err) {
        console.error(`Error reading or parsing ${filePath}:`, err.message);
    }
});

const fileUcateg = path.join('src', 'sites', 'uncategorized.json');

try {
    const data = fs.readFileSync(fileUcateg, 'utf8');
    const todos = JSON.parse(data);

    // Each todo has 2 empty objects
    const total = Array.isArray(todos) ? todos.length - 2 : 0;
    totalObjects += total;

    formatedPrint('Uncategorized', total);
    
} catch (err) {
    console.error(`Error reading or parsing ${fileUcateg}:`, err.message);
}

console.log("-".repeat(25))
console.log(" ".repeat(22 - `${totalObjects}`.length) + `\x1b[1;32m${totalObjects}\x1b[0m`);