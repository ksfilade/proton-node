const inquirer = require('inquirer');
const { weather, location, writeFiles } = require('./functions')

let questions = async () => {

    inquirer
        .prompt([
            {
                name: 'cityOrZip',
                message: 'Query by City or Zip?',
                type: "rawlist",
                choices: ["City", "Zip"]
            },
            {
                name: 'celsiusOrFarheid',
                message: 'Celsius or Farheid',
                type: "rawlist",
                choices: ["Celsius", "Farheid"]
            },
            {
                name: 'useLocations',
                message: 'Use geo Location',
                type: "rawlist",
                choices: ["yes", "no"]
            },

        ])
        .then (async (answers) => {
            if (answers.useLocations == 'yes') {
                let city = await location();
                inquirer
                    .prompt([
                        {
                            name: 'value',
                            message: 'Enter City Name?',
                            default: city
                        }]).then(value => {
                            return getWeatherInfo(value, answers)
                        })
            }
            else if (answers.useLocations.toLowerCase() == 'no' && answers.cityOrZip.toLowerCase() == 'city')
                inquirer
                    .prompt([
                        {
                            name: 'value',
                            message: 'Enter City Name'
                        }]).then(value => {
                            return getWeatherInfo(value, answers)
                        })
            else if (answers.useLocations.toLowerCase() == 'no' && answers.cityOrZip.toLowerCase() == 'zip')
                inquirer
                    .prompt([
                        {
                            name: 'value',
                            message: 'Enter Zip'
                        }]).then(value => {
                            return getWeatherInfo(value, answers)
                        })
        })
}
async function getWeatherInfo(value, answers) {

    const temperatureFormat = answers.celsiusOrFarheid.toLowerCase() == 'celsius' ? 'metric' : 'imperial';
    let cityOrZip = (answers.cityOrZip == 'City' ? 'q=' : 'zip=') + value.value
    let temp = await weather(temperatureFormat, cityOrZip)
    console.log('Temperature is ' + temp);
    let config ={
        query: cityOrZip,
        temperatureFormat: temperatureFormat
    }
    writeFiles('/config.json', config)
}

module.exports = questions