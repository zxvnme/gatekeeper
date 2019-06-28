import * as Discord from "discord.js"

import {IEvent} from "../event";
import {Globals} from "../../globals";

export default class GuildMemberAddEvent implements IEvent {
    constructor() {
        this.name = "guildMemberAdd"
    }

    name: string;

    async override(client, member): Promise<void> {
        await Globals.databaseConnection.query("SELECT * from guildconfiguration", async (error, response, meta) => {
            for (const guildConfiguration of response) {
                if ((member.guild.id == guildConfiguration.guildid) && guildConfiguration.logschannelid != "none") {

                    const embed = new Discord.RichEmbed()
                        .setColor(0x55efc4)
                        .setAuthor(member.user.tag, member.user.avatarURL)
                        .setThumbnail(member.user.avatarURL)
                        .setTitle("New member join detected.")
                        .setFooter("🔑 Gatekeeper moderation")
                        .setTimestamp(new Date());

                    await client.channels.get(guildConfiguration.logschannelid).send(embed);
                }
            }
        });
    }
}