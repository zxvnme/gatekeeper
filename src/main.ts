import "reflect-metadata";
import * as Discord from "discord.js"

import {createConnection} from "typeorm";

import {Bootstrapper, IConfig} from "./bootstrapper";
import {Globals} from "./globals";

const discordInstance = new Discord.Client();
const config = require("./../config.json") as IConfig;

async function main() {

    Globals.config = config;
    Globals.clientInstance = discordInstance;

   createConnection().then(async connection => {
        Globals.loggerInstance.info(`TypeORM connection name: ${connection.name}`);
    }).catch(error => Globals.loggerInstance.fatal(error));

    await new Bootstrapper().start();
}

main().catch(error => Globals.loggerInstance.fatal(error));
