import * as Discord from "discord.js"

import {ICommand} from "../command";
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

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        if (!Checks.permissionCheck(message, "BAN_MEMBERS")) return;

        if (!Checks.argsCheck(message, this, args)) return;

        const memberToBan = await message.mentions.members.first();
        const daysToDelete: number = await parseInt(args[2]);
        await args.splice(0, 3);
        await memberToBan.ban({
            days: daysToDelete,
            reason: `${args.join(" ")} (command invoked by: ${message.author.tag})`
        });
    }
}