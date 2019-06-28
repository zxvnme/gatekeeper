import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";
import {Globals} from "../../globals";

export default class UnlockCommand implements ICommand {

    constructor() {
        this.description = "Unlocks channel.";
        this.syntax = "unlock";
        this.args = "[unlockedChannelID?: snowflake]";
    }

    description: string;
    syntax: string;
    args: string;

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        try {
            if (!Checks.permissionCheck(message, "MANAGE_CHANNELS")) return;

            let lockedChannelID: string;

            if (args[1]) {
                lockedChannelID = await message.guild.channels.get(args[1]).id;
            } else {
                lockedChannelID = await message.channel.id;
            }

            // @ts-ignore
            await message.guild.channels.get(lockedChannelID).overwritePermissions(
                message.guild.defaultRole,
                {"SEND_MESSAGES": true},
            );

            await Announcements.success(message, `Successfully unlocked #${message.guild.channels.get(lockedChannelID).name} channel.`, undefined, true);
        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}