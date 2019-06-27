import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";

export default class LockCommand implements ICommand {

    constructor() {
        this.description = "Locks channel.";
        this.syntax = "lock";
        this.args = "[lockedChannelID?: snowflake]";
    }

    description: string;
    syntax: string;
    args: string;

    action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): void {
        if (!Checks.permissionCheck(message, "MANAGE_CHANNELS")) return;

        let lockedChannelID: string;

        if (args[1]) {
            lockedChannelID = message.guild.channels.get(args[1]).id;
        } else {
            lockedChannelID = message.channel.id;
        }

        // @ts-ignore
        message.guild.channels.get(lockedChannelID).overwritePermissions(
            message.guild.defaultRole,
            {"SEND_MESSAGES": false},
        );

        Announcements.success(message, `Successfully locked #${message.guild.channels.get(lockedChannelID).name} channel.`, undefined, true);
    }
}