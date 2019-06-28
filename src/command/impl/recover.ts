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

            await Globals.databaseConnection.query(`SELECT * FROM lastmessages WHERE channelid='${message.channel.id}'`, async (error, response) => {
                var temp: string[] = [];
                for(let i = 0; i < response.length; i++) {
                    if (response[i].channelid == message.channel.id && response[i].guildid == message.guild.id)
                        temp.push(`[${message.guild.members.get(response[i].authorid).user.tag}] - ${response[i].message}`);
                }
                await Announcements.info(message, "Last messages. (up to 20)", `\`\`\`${temp.join("\n")}\`\`\``);
            });

        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}