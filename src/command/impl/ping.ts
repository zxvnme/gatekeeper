import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Announcements} from "../../utils/announcements";

export default class PingCommand implements ICommand {

    constructor() {
        this.description = "Pong!";
        this.syntax = "ping";
        this.args = "none";
    }

    description: string;
    syntax: string;
    args: string;

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        await Announcements.info(message, "Pong!", `Average heartbeat ping of the websocket is: ${Math.round(clientInstance.ping)}ms`, false);
    }
}