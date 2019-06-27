import {ICommand} from "../command";

import * as Discord from "discord.js"
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";

export default class ClearCommand implements ICommand {

    constructor() {
        this.description = "Clears chat by deleting specified amount of messages.";
        this.syntax = "clear";
        this.args = "[messagesToDelete: number]";
    }

    description: string;
    syntax: string;
    args: string;

    action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): void {
        if (!Checks.permissionCheck(message, "MANAGE_MESSAGES")) return;

        if (!Checks.argsCheck(message, this, args)) return;

        const messagesToDelete: number = parseInt(args[1]);

        if (messagesToDelete > 100) {
            Announcements.warning(message, "Bot can only delete up to 100 messages.", undefined, false);
        }

        message.channel.fetchMessages({limit: 100}).then(messages => {
            const messagesArray = messages.array();
            messagesArray.length = messagesToDelete + 1;
            messagesArray.map(msg => {
                msg.delete();
            });
        });
    }
}