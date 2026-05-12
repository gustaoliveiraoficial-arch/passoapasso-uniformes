const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync(process.argv[2]);

pdf(dataBuffer).then(function(data) {
    console.log("--- PDF CONTENT ---");
    console.log(data.text);
    console.log("--- END PDF CONTENT ---");
}).catch(e => console.error("Error reading PDF:", e));
