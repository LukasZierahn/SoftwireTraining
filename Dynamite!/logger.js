const log4js = require('log4js');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'trace' }
    }
});

const logger = log4js.getLogger('lukasBot');
exports.logger = logger;
