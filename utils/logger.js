/**
 * @description：
 * @author: manble@live.com
 */

'use strict';

// "fatal" (60): The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
// "error" (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
// "warn" (40): A note on something that should probably be looked at by an operator eventually.
// "info" (30): Detail on regular operation.
// "debug" (20): Anything else, i.e. too verbose to be included in "info" level.
// "trace" (10): Logging from external libraries used by your app or very detailed application logging.


const bunyan = require('bunyan');
const fs = require('fs');
const utils = require('./utils');

const isProduction = /production/.test(process.env.NODE_ENV);

const streams = isProduction ? [{
      level: 'error',
      type: 'rotating-file',
      path: 'logs/errors.log',
      period: '1d',
      count: 7
   },
   {
      level: 'info',
      type: 'rotating-file',
      path: 'logs/outs.log',
      period: '1ms',
      count: 7
   }
] : [{
      level: 'error',
      stream: process.stderr
   },
   {
      level: 'debug',
      // stream: process.stdout
      type: 'rotating-file',
      path: 'logs/outs.log',
      period: '1d',
      count: 1
   }
];

[`${process.cwd()}/logs/errors.log`, `${process.cwd()}/logs/outs.log`].forEach((file) => {
   !fs.existsSync(file) && utils.writeFile(file, '');
});

let log = null;
let getLog = (() => {
   if (log === null) {
      log = bunyan.createLogger({
         name: 'mint',
         streams
      });
   }
   return null;
})();
log.on('error', (err, stream) => {});

module.exports = {
   fatal: log.fatal.bind(log),
   error: log.error.bind(log),
   warn: log.warn.bind(log),
   info: log.info.bind(log),
   debug: log.debug.bind(log),
   trace: log.trace.bind(log)
};