const log4js = require('log4js');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'error' }
    }
});

const logger = log4js.getLogger('lukasBot');
exports.logger = logger;