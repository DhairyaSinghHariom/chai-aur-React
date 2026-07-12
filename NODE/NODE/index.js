// Event Module
const EventEmitter = require('events');

const event = new EventEmitter();

event.on('greet', () => {
    console.log('Hello, World!');
});

event.emit('greet');

// File System Module
const fs = require('fs');

fs.readFile('Data.txt', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(data);
});
// Synchronous 

console.log("start");
setTimeout(() => {
    console.log("This is a timeout");
}, 2000);
;


setTimeout(() => {
    console.log(1 + "This is a timeout");
}, 3000);

setTimeout(() => {
    console.log(2 +"This is a timeout");
}, 4000);

setTimeout(() => {
    console.log(3 + "This is a timeout");
}, 5000);

setTimeout(() => {
    console.log( 4 + "This is a timeout");
}, 1000);
console.log("end");


// Asynchronous 
//   Method call
// Call backs , Promises , Async /Await

