const got = require('got')
const fs = require('fs')
const os = require('os')
const apikey = 'a1983029639e7fde3294dd610bf9decc'

module.exports = {

 weather : async (temperatureFormat, query) => {
     return await got.get(
        'http://api.openweathermap.org/data/2.5/weather?' + query + '&appid=' + apikey + '&units=' + temperatureFormat, {
        responseType: 'json'
    }).then((data) =>{
      return data.body.main.temp
    })
    .catch((err) =>{
      console.log('This city can not be found');
      return 'error'
    });
    // return body.main.temp
},
 location: async () =>{
    
     const { body } = await got.get(
        ' http://ip-api.com/json/', {
        responseType: 'json'
    });
    return body.city
 },
 readFiles: async(file) =>{
    return JSON.parse( fs.readFileSync(os.homedir()+'/'+ file,'utf8') )
 },
 writeFiles: async(file,data) =>{
    if( fs.existsSync( os.homedir() + '/' + file) )
        fs.unlinkSync(os.homedir() + '/' + file)
    let rs = fs.writeFileSync (os.homedir() + '/' + file, JSON.stringify( data ),{ flag: 'wx' }, function (err,data) {
        if (err) {
          return console.log(err);
        }
        console.log(data);
      });
      
    return true
 }
}