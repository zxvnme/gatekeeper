import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";

export default class PardonCommand implements ICommand {

    constructor() {
        this.description = "Sets slow mode for the guild.";
        this.syntax = "slowmode";
        this.args = "[slowmodeValue: number]";
    }

    description: string;
    syntax: string;
    args: string;

    action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): void {
        if (!Checks.permissionCheck(message, "MANAGE_CHANNELS")) return;

        if(!Checks.argsCheck(message, this, args)) return;
        // @ts-ignore
        message.channel.setRateLimitPerUser(parseInt(args[1]));
    }
}