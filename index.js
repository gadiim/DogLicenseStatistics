let results = [];
let breeds = new Set();
let licenses = new Set();
let licensesByBreed = {};
let dogNames = {};

// Update the header section with a message
function updateOutputHeader(message) {
    const resultsElement = document.getElementById('resultsHeader');
    resultsElement.textContent = `${message}\n`;
};

// Update the data section with a message
function updateOutputData(message) {
    const resultsElement = document.getElementById('resultsData');
    resultsElement.textContent = `${message}\n`;
};

// Fetch the CSV file and parse its content
function readCSVFile() {
    fetch('data/2017.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(csvContent => {
            Papa.parse(csvContent, {
                header: true,
                dynamicTyping: true,
                complete: function (results) {
                    processData(results.data);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching the file:', error);
        });
};

// Process the parsed CSV data
function processData(data) {
    results = data;
    licenses = new Set();
    licensesByBreed = {};
    dogNames = {};

    data.forEach(row => {
        const breed = row.Breed ? row.Breed.trim().toLowerCase() : null;
        const license = row.LicenseType;
        const name = row.DogName;

        if (breed) {
            breeds.add(breed);

            licenses.add(license);

            if (!licensesByBreed[breed]) {
                licensesByBreed[breed] = {};
            }
            if (!licensesByBreed[breed][license]) {
                licensesByBreed[breed][license] = 0;
            }
            licensesByBreed[breed][license]++;
        }

        if (name) {
            if (!dogNames[name]) {
                dogNames[name] = 0;
            }
            dogNames[name]++;
        }
    });

    const schema = Object.keys(results[0]);
    updateOutputHeader(`CSV file read successfully!\nNumber of lines read: ${results.length}\nData schema:\n${schema.join(', ')}\nThe first row:\n${JSON.stringify(results[0], null, 2)}`);
};

// Get and display unique breeds
function getUniqueBreeds() {
    const uniqueBreeds = Array.from(breeds);
    updateOutputData(`Unique breeds:\n${uniqueBreeds.join(', ')}`);
};

// Get and display unique license types
function getUniqueLicenses() {
    const uniqueLicenses = Array.from(licenses);
    updateOutputData(`Unique license types:\n${uniqueLicenses.join(', ')}`);
};

// Get and display the number of licenses by breed
function getLicensesByBreed() {
    updateOutputData(`The number of licenses by breed:\n${JSON.stringify(licensesByBreed, null, 2)}`);
};

// Get and display the top 5 dog names
function getTopDogNames() {
    const topDogNames = Object.entries(dogNames)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => `${name}: ${count}`)
        .join('\n');
    updateOutputData(`Top 5 dog names:\n${topDogNames}`);
};
