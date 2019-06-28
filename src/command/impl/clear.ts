import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";
import {Globals} from "../../globals";

export default class ClearCommand implements ICommand {

    constructor() {
        this.description = "Clears chat by deleting specified amount of messages.";
        this.syntax = "clear";
        this.args = "[messagesToDelete: number]";
    }

    description: string;
    syntax: string;
    args: string;

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        try {
            if (!Checks.permissionCheck(message, "MANAGE_MESSAGES")) return;

            if (!Checks.argsCheck(message, this, args)) return;

            const messagesToDelete: number = await parseInt(args[1]);

            if (messagesToDelete > 100) {
                await Announcements.warning(message, "Bot can only delete up to 100 messages.", undefined, false);
            }

            await message.channel.fetchMessages({limit: 100}).then(async messages => {
                const messagesArray = messages.array();
                messagesArray.length = messagesToDelete + 1;
                messagesArray.map(async msg => {
                    await msg.delete();
                });
            });
        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}