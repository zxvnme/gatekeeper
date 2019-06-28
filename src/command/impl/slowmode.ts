import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";

export default class SlowmodeCommand implements ICommand {

    constructor() {
        this.description = "Sets slowmode for the guild.";
        this.syntax = "slowmode";
        this.args = "[slowmodeValue: number]";
    }

    description: string;
    syntax: string;
    args: string;

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        if (!Checks.permissionCheck(message, "MANAGE_CHANNELS")) return;

        if (!Checks.argsCheck(message, this, args)) return;

        // @ts-ignore
        await message.channel.setRateLimitPerUser(parseInt(args[1]));

        await Announcements.success(message, `Successfully set slowmode to ${args[1]}s`);
    }
}