import * as Discord from "discord.js"
import {Bootstrapper, IConfig} from "./bootstrapper";

const discordInstance = new Discord.Client();
const config = require("./../config.json") as IConfig;

new Bootstrapper().start(discordInstance, config);