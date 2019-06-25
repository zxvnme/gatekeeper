import {ICommand} from "../command";

import * as Discord from "discord.js"

export default class KickCommand implements ICommand {

    constructor() {
        this.description = "Kicks user from a server.";
        this.syntax = "kick";
    }

    description: string;
    syntax: string;

    action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): void {
        if (!message.member.hasPermission("KICK_MEMBERS")) return;

        const memberToKick = message.mentions.members.first();
        args.splice(0, 2);
        memberToKick.kick(`${args.join(" ")} (command invoked by: ${message.author.tag})`);
    }
}