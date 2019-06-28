import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Announcements} from "../../utils/announcements";
import {Globals} from "../../globals";
import {Checks} from "../../utils/checks";

export default class RecoverCommand implements ICommand {
    constructor() {
        this.description = "Recovers last messages and sends them to channel.";
        this.syntax = "recover";
        this.args = "none";
    }

    description: string;
    syntax: string;
    args: string;

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        try {
            if (!Checks.permissionCheck(message, "MANAGE_MESSAGES")) return;

            let temp: string[] = [];
            for (const collectedMessage of Globals.collectedMessages) {
                await temp.push(`\`${collectedMessage.author}\` - ${collectedMessage.content}`);
            }

            await Announcements.info(message, "Last messages. (up to 50)", temp.join("\n"));

        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}