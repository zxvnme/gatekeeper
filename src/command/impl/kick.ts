import {ICommand} from "../command";

import * as Discord from "discord.js"
import {Checks} from "../../utils/checks";

export default class KickCommand implements ICommand {

    constructor() {
        this.description = "Kicks user from a server.";
        this.syntax = "kick";
        this.args = "[memberToKick: mention] [reason: string]";
    }

    description: string;
    syntax: string;
    args: string;

    action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): void {
        if (!Checks.permissionCheck(message, "KICK_MEMBERS")) return;

        if(!Checks.argsCheck(message, this, args)) return;

        const memberToKick = message.mentions.members.first();
        args.splice(0, 2);
        memberToKick.kick(`${args.join(" ")} (command invoked by: ${message.author.tag})`);
    }
}