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
        Announcements.error(message, "test", "test", false);
        Announcements.success(message, "test", "test", false);
        message.channel.send("Pinging...").then(sent => {
            // @ts-ignore
            sent.edit(`Pong! ${Math.round(sent.createdTimestamp - message.createdTimestamp).toString()}ms`);
        });
    }
}