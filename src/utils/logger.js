import log4js from 'log4js';

log4js.configure({
    appenders:{
        logConsola: {type: 'console'},
        logError: {type: 'file', filename: 'error.log'},
        logWarn: {type: 'file', filename: 'warn.log'},
        loggerWarn: {type: 'logLevelFilter', appender: 'logWarn', level: 'warn'},
        loggerError: {type: 'logLevelFilter', appender: 'logError', level: 'error'}
        
    },
    categories:{
        default:{
            appenders: ["loggerError", "logConsola"], level: "all"
        },
        custom:{
            appenders: ["loggerWarn", "logConsola"], level: "all"
        }
    }
});

export const logger = log4js.getLogger('custom');
export const loggerError = log4js.getLogger();