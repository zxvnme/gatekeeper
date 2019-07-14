import * as Discord from "discord.js"

import {getRepository} from "typeorm";

import {IEvent} from "../event";
import {GuildConfiguration} from "../../entity/guildConfiguration";

export default class MessageUpdateEvent implements IEvent {
    constructor() {
        this.name = "messageUpdate"
    }

    name: string;

    async override(client, messageOld, messageNew): Promise<void> {
        if (messageOld.author === client.user) return;

        const guildConfigurationsRepository = getRepository(GuildConfiguration);

        guildConfigurationsRepository.find({where: {guildID: messageOld.guild.id}}).then(configuration => {
            for (const guildConfiguration of configuration) {
                if ((guildConfiguration.guildID == messageOld.guild.id) && guildConfiguration.logsChannelID != "none") {

                    const embed = new Discord.RichEmbed()
                        .setColor(0x74b9ff)
                        .setAuthor(messageNew.author.tag, messageNew.author.avatarURL)
                        .setTitle("Message update detected.")
                        .setDescription(`Action performed in <#${messageNew.channel.id}>`)
                        .addField("Old:", `\`${messageOld.content}\``, true)
                        .addField("New:", `\`${messageNew.content}\``, true)
                        .setFooter("🔑 Gatekeeper moderation")
                        .setTimestamp(new Date());

                    client.channels.get(guildConfiguration.logsChannelID).send(embed);
                }
            }
        });
    }
}