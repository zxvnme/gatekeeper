import * as Discord from "discord.js";

import {IEvent} from "../event";
import {getRepository} from "typeorm";
import {GuildConfiguration} from "../../entity/guildConfiguration";
import {Globals} from "../../globals";

export default class GuildMemberUpdateEvent implements IEvent {
    constructor() {
        this.name = "guildMemberUpdate"
    }

    name: string;

    async override(client, oldMember, newMember): Promise<void> {
        const guildConfigurationsRepository = getRepository(GuildConfiguration);

        guildConfigurationsRepository.find({where: {guildID: newMember.guild.id}}).then(configuration => {
            for (const guildConfiguration of configuration) {
                if ((guildConfiguration.guildID == newMember.guild.id) && guildConfiguration.logsChannelID != "none") {

                    const embed = new Discord.RichEmbed();

                    if (newMember.nickname !== oldMember.nickname) {
                        embed.setColor(0x74b9ff)
                            .setAuthor(oldMember.user.tag, oldMember.user.avatarURL)
                            .setTitle(`User's nickname change detected.`)
                            .addField("Old:", `\`${oldMember.nickname}\``, true)
                            .addField("New:", `\`${newMember.nickname}\``, true)
                            .setFooter("🔑 Gatekeeper moderation")
                            .setTimestamp(new Date());
                    }

                    // @ts-ignore
                    Globals.clientInstance.channels.get(guildConfiguration.logsChannelID).send(embed);
                }
            }
        });
    }
}