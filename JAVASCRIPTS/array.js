let marks = [23, 45, 67, 89, 12,100];
console.log(marks);
console.log(marks.length);

// for loop

let fruits = ["apple", "banana", "mango", "grapes"];
for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}

// for of
for (let fruit of fruits) {
    console.log(fruit);
}

let cities = ["Delhi", "Mumbai", "Bangalore", "Chennai"];
console.log(cities);


for (let city of cities) {
    console.log(city.toUpperCase());
}


students = [43, 56, 78, 90, 12];

let sum = 0;

for (let student of students) {
    sum += student;
}
let average = sum / students.length;
console.log(average);
