
const fs = require("fs");


// Sync...

// fs.writeFileSync("./Test.txt","Hello World");

// Async...

// fs.writeFile("./Test.txt","Hello World"

//Async
// fs.writeFileSync('test.txt', 'Hello World');

// const result = fs.readFileSync("./contact.txt", "utf-8");
// console.log(result);

// fs.readFile("./contacts.txt", "utf-8", (err, result) => {
//     if (err) {
//         console.log("Error: ",err);
        
//     } else {
//         console.log(result);
        
//     }
// });

fs.appendFileSync("./test.txt",' ${Date.now()}Hey There\n');


// fs.cpSync("./test.txt","./copy.txt");

// fs.unlinkSync("./copy.txt");

console.log(fs.statSync("./test.txt"));

fs.mkdirSync("my-docs/a/b", { recursive: true });

