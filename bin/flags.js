const yargs = require("yargs");
const { weather, readFiles, writeFiles } = require('./functions')
const options = yargs
    .option("c", { alias: "city", describe: "City name", type: "string", demandOption: false })
    .option("z", { alias: "zip", describe: "<Zip Code>,<Country Code>", type: "string", demandOption: false })
    .option("t", { alias: "celsius", describe: "Show in Celsius (Farheit is defualt)", type: "boolean", demandOption: false })
    .option("o", { alias: "outsideFile", describe: "Import outside file with cities", type: "string", demandOption: false })
    .option("l", { alias: "latest", describe: "import latest config", type: "string", demandOption: false })
    .argv

const temperatureFormat = options.celsius ? 'metric' : 'imperial';

module.exports = async () => {

    if (options.outsideFile) {
        let { cities } = await readFiles(options.outsideFile)
        let i = 0;

        cities.map(async (el) => {
            let temp = await weather( temperatureFormat, 'q=' + el)
            console.log('Temperature is ' + temp + ' in ' + el);
            if (i >= 10)
                return true;
        })
        return true
    }
    else if (options.latest != undefined) {
        let latestOptions = await readFiles('/config.json') 
        let temp = await weather( latestOptions.temperatureFormat, latestOptions.query)
        console.log('Temperature is ' + temp);
        return temp
    }

    if (options.city === undefined && options.zip === undefined)
        return false

    let temp = await weather(temperatureFormat, options.city ? 'q=' + options.city : 'zip=' + options.zip)
    if(temp != 'error')
    console.log('Temperature is ' + temp);
    let config = {
        query: options.city ? 'q=' + options.city : 'zip=' + options.zip,
        temperatureFormat: temperatureFormat
    }
    writeFiles('/config.json', config)
    return temp
}
