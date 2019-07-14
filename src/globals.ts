import * as signale from "signale";
import * as Filter from "bad-words";
import * as Discord from "discord.js"

import {IConfig} from "./bootstrapper";
import {ICommand} from "./command/command";

export class Globals {
    public static commands: ICommand[] = [];
    public static clientInstance: Discord.Client;
    public static config: IConfig;
    public static filterInstance = new Filter();
    public static loggerInstance: signale = new signale.constructor({scope: "Gatekeeper"});
}