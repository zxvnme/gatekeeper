import * as Discord from "discord.js"
import * as MariaDB from "mariadb/callback"

import {Bootstrapper, IConfig} from "./bootstrapper";
import {Globals} from "./globals";

const discordInstance = new Discord.Client();
const config = require("./../config.json") as IConfig;

Globals.databaseConnection = MariaDB.createConnection({
    host: config.databaseHost,
    user: config.databaseUser,
    password: config.databasePassword
});

Globals.databaseConnection.connect(error => {
    if (error) {
        Globals.loggerInstance.fatal(error);
    }
});

new Bootstrapper().start(discordInstance, config);