#!/bin/bash

# Read Params from .env & setup in x=y format
parameters=`node -e "console.log(Object.keys(require('dotenv').config().parsed).map(key => key.replaceAll('_','') + \"=\" + process.env[key]).join(\" --parameters \"))"`
# Call cdk deploy with those params
npx cdk deploy --parameters $parameters