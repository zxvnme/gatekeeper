import {ICommand} from "../command";

import * as Discord from "discord.js"

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
        message.channel.send("Pinging...").then(sent => {
            // @ts-ignore
            sent.edit(`Pong! ${Math.round(sent.createdTimestamp - message.createdTimestamp).toString()}ms`);
        });
    }
}