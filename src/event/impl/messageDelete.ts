import * as Discord from "discord.js"

import {getRepository} from "typeorm";

import {IEvent} from "../event";
import {GuildConfiguration} from "../../entity/guildConfiguration";

export default class MessageDeleteEvent implements IEvent {
    constructor() {
        this.name = "messageDelete"
    }

    name: string;

    async override(client, message): Promise<void> {
        if (message.author == client.user) return;
        if (message.author.bot) return;

        const guildConfigurationsRepository = getRepository(GuildConfiguration);

        guildConfigurationsRepository.find({where: {guildID: message.guild.id}}).then(configuration => {
            for (const guildConfiguration of configuration) {
                if ((guildConfiguration.guildID == message.guild.id) && guildConfiguration.logsChannelID != "none") {

                    const embed = new Discord.RichEmbed()
                        .setColor(0xff7675)
                        .setAuthor(message.author.tag, message.author.avatarURL)
                        .setTitle("Message deletion detected.")
                        .setDescription(`Action performed in <#${message.channel.id}>`)
                        .addField("Message:", `\`${message.content}\``, true)
                        .setFooter("🔑 Gatekeeper moderation")
                        .setTimestamp(new Date());

                    client.channels.get(guildConfiguration.logsChannelID).send(embed);
                }
            }
        });
    }
}