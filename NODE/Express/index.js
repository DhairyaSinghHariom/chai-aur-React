//] Mini Server form Express


const express = require('express');
const app = express();

console.log('Hello World! This is the Express server.');

app.get('/Student', (req, res) => {
    res.send('This is the Express server!');
});

const port = 3000 || process.env.port;

app.listen(port, () => {        
  console.log(`Server is running on port ${port}`);
});


// const express = require('express');
// const app = express();

// console.log('Hello World! This is the Express server.');

// app.get('/Student', (req, res) => {
//     res.send('This is the Student server!');
// });

// app.get('/', (req, res) => {
//     res.send('This is My Default server!');
// });

// app.get('/About', (req, res) => {
//     res.send('This is My About server!');
// });

// app.get('/Contact', (req, res) => {
//     res.send('This is My Contact server!');
// });

// const port = 3000 || process.env.port;

// app.listen(port, () => {        
//   console.log(`Server is running on port ${port}`);
// });


import express from "express";

const app = express();
app.use(express.json());

let users = [];

// POST API
app.post("/users", (req, res) => {
    const user = {
        id: users.length + 1,
        name: req.body.name
    };

    users.push(user);

    res.json({
        data: user,
        message: "User added successfully"
    });
});

// GET API
app.get("/", (req, res) => {
    res.json({ message: "Server is running 🚀" });
});

app.get("/users/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({ data: user });
});

// Start server
app.listen(3000, () => {
    console.log("Server started on port 3000");
});

const add =(a, b) => {
    return a + b;
};
let sum = add(5, 10);
console.log(add(sum));
