import Vorpal = require('vorpal');
import {CommandInstance} from "vorpal";
import {HttpDriver} from 'empty-epsilon-js';

const vorpal = new Vorpal();

// example --address localhost:8080
const processArgs = vorpal.parse(process.argv, {use: 'minimist'});

const eeDriver = new HttpDriver(processArgs.address);

vorpal
    .command('get <query>', 'read lua values')
    .action(async function (this: CommandInstance, args: {query:string}) {
        this.log('asking...');
        try {
            const answer = await eeDriver.query(args.query);
            this.log(answer);
        } catch (err){
            this.log(':(');
        }
    });

vorpal
    .delimiter('epsilon$')
    .show();
