import * as Discord from "discord.js"

import {getRepository} from "typeorm";

import {IEvent} from "../event";
import {GuildConfiguration} from "../../entity/guildConfiguration";

export default class GuildMemberAddEvent implements IEvent {
    constructor() {
        this.name = "guildMemberAdd"
    }

    name: string;

    async override(client, member): Promise<void> {
        const guildConfigurationsRepository = getRepository(GuildConfiguration);

        guildConfigurationsRepository.find({where: {guildID: member.guild.id}}).then(configuration => {
            for (const guildConfiguration of configuration) {
                if ((guildConfiguration.guildID == member.guild.id) && guildConfiguration.logsChannelID != "none") {

                    const embed = new Discord.RichEmbed()
                        .setColor(0x55efc4)
                        .setAuthor(member.user.tag, member.user.avatarURL)
                        .setThumbnail(member.user.avatarURL)
                        .setTitle("New member join detected.")
                        .setFooter("🔑 Gatekeeper moderation")
                        .setTimestamp(new Date());

                    client.channels.get(guildConfiguration.logsChannelID).send(embed);
                }
            }
        });
    }
}