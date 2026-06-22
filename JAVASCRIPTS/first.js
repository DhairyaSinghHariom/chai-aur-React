const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter the score (0 - 100): ", (input) => {
    let score = Number(input);
    let grade;

    if (score >= 90 && score <= 100) {
        grade = "A";
    } else if (score >= 70) {
        grade = "B";
    } else if (score >= 60) {
        grade = "C";
    } else if (score >= 0) {
        grade = "D";
    } else {
        grade = "Invalid Score";
    }

    console.log("According to your score, your grade is:", grade);
    rl.close();
});