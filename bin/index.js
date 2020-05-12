#!/usr/bin/env node

(async () => {
const questions = require('./prompt')
const flags = require('./flags') 

  let temperature = await flags()
  
  if(!temperature && temperature == 'error'){
   questions()
  }
})();
