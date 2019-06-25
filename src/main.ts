import * as Discord from "discord.js"
import {Bootstrapper, IConfig} from "./bootstrapper";
import * as signale from "signale";

const gatekeeperLogger = new signale.constructor({scope: "Gatekeeper"});
const discordInstance = new Discord.Client();
const config = require("./../config.json") as IConfig;

new Bootstrapper().start(discordInstance, gatekeeperLogger, config);