import * as Discord from "discord.js"

import {ICommand} from "../command";
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

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        if (!Checks.permissionCheck(message, "KICK_MEMBERS")) return;

        if(!Checks.argsCheck(message, this, args)) return;

        const memberToKick = await message.mentions.members.first();
        await args.splice(0, 2);
        await memberToKick.kick(`${args.join(" ")} (command invoked by: ${message.author.tag})`);
    }
}