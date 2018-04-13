'use strict';
const {router} = require('./authRouter');
const {localStrategy, jwtStrategy} = require('./authStrategies');

module.exports = {router, localStrategy, jwtStrategy};
