import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";
import {Globals} from "../../globals";
import {getRepository} from "typeorm";
import {GuildConfiguration} from "../../entity/guildConfiguration";

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

            const guildConfigurationsRepository = getRepository(GuildConfiguration);

            guildConfigurationsRepository.find({where: {guildID: message.guild.id}}).then(configuration => {
                for (const guildConfiguration of configuration) {
                    if ((guildConfiguration.guildID == message.guild.id) && guildConfiguration.logsChannelID != "none") {

                        const embed = new Discord.RichEmbed()
                            .setColor(0x74b9ff)
                            .setTitle(`Channel unlock detected.`)
                            .setDescription(`<#${lockedChannelID}> has been unlocked.`)
                            .addField("Invoker:", `<@${message.author.id}>`)
                            .setFooter("🔑 Gatekeeper moderation")
                            .setTimestamp(new Date());

                        // @ts-ignore
                        clientInstance.channels.get(guildConfiguration.logsChannelID).send(embed);
                    }
                }
            });

            await Announcements.success(message, "Channel unlock", `Successfully unlocked <#${message.guild.channels.get(lockedChannelID).name}> channel.`, true);
        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}