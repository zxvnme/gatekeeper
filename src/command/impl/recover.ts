import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Announcements} from "../../utils/announcements";
import {Globals} from "../../globals";
import {Checks} from "../../utils/checks";
import {getRepository} from "typeorm";
import {LastMessage} from "../../entity/lastMessage";

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

            getRepository(LastMessage).find({
                where: {
                    guildID: message.guild.id,
                    channelID: message.channel.id
                }
            }).then(recoveredMessages => {
                let temp: string[] = [];
                for (const recoveredMessage of recoveredMessages)
                    if (recoveredMessage.channelID == message.channel.id && recoveredMessage.guildID == message.guild.id)
                        temp.push(`[${message.guild.members.get(recoveredMessage.authorID).user.tag}] - ${recoveredMessage.messageContent}`);

                Announcements.info(message, `Recovering complete.`, `Last messages for  <#${message.channel.id}> \`\`\`${temp.join("\n")}\`\`\``);
            });

        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}