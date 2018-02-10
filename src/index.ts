#!/usr/bin/env node
import Vorpal = require('vorpal');
import * as parser from 'yargs';
import {plugin as lua} from './lua';
import {plugin as game} from './game';
import {HttpDriver} from 'empty-epsilon-js';

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
const vorpal = new Vorpal();

vorpal
    .history('eetools')
    .localStorage('eetools')
    .use(lua, {eeDriver})
    .use(game, {eeDriver})
    .delimiter(`eetools:${host}:${port}$`)
    .show();
