import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";
import {Globals} from "../../globals";

export default class LockCommand implements ICommand {

    constructor() {
        this.description = "Locks channel.";
        this.syntax = "lock";
        this.args = "[lockedChannelID?: snowflake]";
    }

    description: string;
    syntax: string;
    args: string;

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        try {
            if (!Checks.permissionCheck(message, "MANAGE_CHANNELS")) return;

            let lockedChannelID: string;

            if (args[1]) {
                lockedChannelID = message.guild.channels.get(args[1]).id;
            } else {
                lockedChannelID = message.channel.id;
            }

            // @ts-ignore
            await message.guild.channels.get(lockedChannelID).overwritePermissions(
                message.guild.defaultRole,
                {"SEND_MESSAGES": false},
            );

            await Globals.databaseConnection.query("SELECT * from guildconfiguration", async (error, response, meta) => {
                for (const guildConfiguration of response) {
                    if ((message.guild.id == guildConfiguration.guildid) && guildConfiguration.logschannelid != "none") {

                        const embed = new Discord.RichEmbed()
                            .setColor(0xff7675)
                            .setTitle(`Channel lock detected.`)
                            .setDescription(`<#${lockedChannelID}> has been locked.`)
                            .addField("Invoker:", `<@${message.author.id}>`)
                            .setFooter("🔑 Gatekeeper moderation")
                            .setTimestamp(new Date());

                        // @ts-ignore
                        await clientInstance.channels.get(guildConfiguration.logschannelid).send(embed);
                    }
                }
            });

            await Announcements.success(message, "Channel locked.", `Successfully locked <#${lockedChannelID}> channel.`, true);
        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}