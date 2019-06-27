import {ICommand} from "../command";

import * as Discord from "discord.js"
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

    action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): void {
        Announcements.info(message, "Pong!", `Average heartbeat ping of the websocket is: ${clientInstance.ping}ms`, false);
    }
}