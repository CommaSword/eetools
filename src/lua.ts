import Vorpal = require("vorpal");
import safeStringify = require('json-stringify-safe');
import {EEDriver} from "empty-epsilon-js";
import {CommandInstance} from "vorpal";
import {isArray, isObject, isString} from 'lodash';
import chalk from 'chalk';

export function plugin(vorpal: Vorpal, {eeDriver}: { eeDriver: EEDriver }) {
    vorpal
        .mode('lua', 'LUA console mode.')
        // .delimiter('repl:')
        .init(async function (this: CommandInstance) {
            this.log('Entering LUA Mode. To exit, type \'exit\'');
            return 'Entering direct console Mode. To exit, type \'exit\'.';
        })
        .action(async function (this: CommandInstance, command: string): Promise<any> {
            try {
                const answer = await eeDriver.query(command);
                let log = (isString(answer)) ? chalk.white(answer) : answer;
                if (isObject(log) && !isArray(log)) {
                    try {
                        log = safeStringify(log, null, 2);
                    } catch (e) {
                        console.log(e.stack);
                    }
                }
                this.log(log);
                return answer;
            } catch (e) {
                this.log(e);
                throw e;
            }
        });
}
