#!/usr/bin/env node
import Vorpal = require('vorpal');
import safeStringify = require('json-stringify-safe');
import * as parser from 'yargs';
import {CommandInstance} from "vorpal";
import {HttpDriver} from 'empty-epsilon-js';
import {isArray, isObject, isString} from 'lodash';
import chalk from 'chalk';

const argv = parser
    .usage('Usage: <host> <port>')
    .demandCommand(2)
    .argv;

const hostMatcher = /^[\w\.]+$/;
const portMatcher = /^\d+$/;

const host = argv._[0];
const port = argv._[1];

if (!host) {
    console.error('must supply host name');
    process.exit(1);
}
if (!port) {
    console.error('must supply port');
    process.exit(1);
}
if (!hostMatcher.test(host)) {
    console.error(`illegal host ${host}`);
    process.exit(1);
}
if (!portMatcher.test(port)) {
    console.error(`illegal port ${port}`);
    process.exit(1);
}


const address = `http://${host}:${port}`;
const eeDriver = new HttpDriver(address);

function lua(vorpal: Vorpal) {
    vorpal
        .mode('lua', 'LUA console mode.')
        // .delimiter('repl:')
        .init(async function (this: CommandInstance) {
            this.log('Entering LUA Mode. To exit, type \'exit\'');
            return 'Entering direct ךוש console Mode. To exit, type \'exit\'.';
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

const vorpal = new Vorpal();

vorpal
    .use(lua)
    .delimiter(`eetools:${host}:${port}$`)
    .show();
