import {ICommand} from "../command";

import * as Discord from "discord.js"
import {Checks} from "../../utils/checks";

export default class BanCommand implements ICommand {

    constructor() {
        this.description = "Bans user from a server.";
        this.syntax = "ban";
        this.args = "[memberToBan: mention] [daysToDelete: number] [reason: string]";
    }

    description: string;
    syntax: string;
    args: string;

    action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): void {
        if (!Checks.permissionCheck(message, "BAN_MEMBERS")) return;

        if(!Checks.argsCheck(message, this, args)) return;

        const memberToBan = message.mentions.members.first();
        const daysToDelete: number = parseInt(args[2]);
        args.splice(0, 3);
        memberToBan.ban({
            days: daysToDelete,
            reason: `${args.join(" ")} (command invoked by: ${message.author.tag})`
        });
    }
}