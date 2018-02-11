import Vorpal = require("vorpal");
import {EEDriver} from "empty-epsilon-js";
import {resolve} from "path";
import {promisify} from "util";
import {spawn} from "child_process";
import {access, constants} from 'fs';
import {CommandInstance} from "vorpal";
import chalk from 'chalk';

type Log = CommandInstance['log'];

const gameFileLocations = [
    resolve(process.cwd(), 'EmptyEpsilon'),
    resolve(process.cwd(), 'EmptyEpsilon.exe'),
    'C:/program files/EmptyEpsilon/EmptyEpsilon.exe',
    '/Applications/EmptyEpsilon.app/Contents/MacOS/EmptyEpsilon'
];
const accessP = promisify(access);

async function findGameExec(log: Log, ui: Vorpal['ui']): Promise<string | null> {
    log(chalk.white(`looking for game location ...`));
    for (let i = 0; i < gameFileLocations.length; i++) {
        let fileLocation = gameFileLocations[i];
        try {
            ui.redraw(chalk.white(`  -  ${fileLocation}`));
            await new Promise(res => setTimeout(res, 1000));
            await accessP(fileLocation, constants.X_OK);
            return fileLocation;
        } catch (e) {
        }
    }
    return null;
}

export function plugin(vorpal: Vorpal, {eeDriver}: { eeDriver: EEDriver }) {
    vorpal
        .command('start')
        .description('launches the empty epsilon application')
        .action(async function (this: CommandInstance, args) {
            try {
                const gameExecLocation = await findGameExec(this.log.bind(this), vorpal.ui);
                if (gameExecLocation) {
                    this.log(chalk.white(`running ${gameExecLocation} httpserver=8081`));
                    spawn(gameExecLocation, ['httpserver=8081']);
                } else {
                    this.log(chalk.red('found no valid game location'));
                }
            } catch (e) {
                this.log(chalk.red(e.message));
            }
        });
}
