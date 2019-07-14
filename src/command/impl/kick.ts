import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Globals} from "../../globals";
import {getRepository} from "typeorm";
import {GuildConfiguration} from "../../entity/guildConfiguration";

export default class KickCommand implements ICommand {

    constructor() {
        this.description = "Kicks user from a server.";
        this.syntax = "kick";
        this.args = "[memberToKick: mention] [reason: string]";
    }

    description: string;
    syntax: string;
    args: string;

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        try {
            if (!Checks.permissionCheck(message, "KICK_MEMBERS")) return;

            if (!Checks.argsCheck(message, this, args)) return;

            const memberToKick = await message.mentions.members.first();
            await args.splice(0, 2);
            await memberToKick.kick(`${args.join(" ")} (command invoked by: ${message.author.tag})`);

            const guildConfigurationsRepository = getRepository(GuildConfiguration);

            guildConfigurationsRepository.find({where: {guildID: message.guild.id}}).then(configuration => {
                for (const guildConfiguration of configuration) {
                    if ((guildConfiguration.guildID == message.guild.id) && guildConfiguration.logsChannelID != "none") {

                        const embed = new Discord.RichEmbed()
                            .setColor(0xff7675)
                            .setAuthor(memberToKick.user.tag, memberToKick.user.avatarURL)
                            .setTitle(`Member kick detected.`)
                            .setDescription(`<@${memberToKick.id}> has been kicked.`)
                            .addField("Reason:", args.join(" "))
                            .addField("Invoker:", `<@${message.author.id}>`)
                            .setFooter("🔑 Gatekeeper moderation")
                            .setTimestamp(new Date());

                        // @ts-ignore
                        clientInstance.channels.get(guildConfiguration.logsChannelID).send(embed);
                    }
                }
            });
        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}