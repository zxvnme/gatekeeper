import * as Discord from "discord.js"

import {IEvent} from "../event";
import {Globals} from "../../globals";

export default class GuildMemberRemoveEvent implements IEvent {
    constructor() {
        this.name = "guildMemberRemove"
    }

    name: string;

    async override(client, member): Promise<void> {
        await Globals.databaseConnection.query("SELECT * from guildconfiguration", async (error, response, meta) => {
            for (const guildConfiguration of response) {
                if ((member.guild.id == guildConfiguration.guildid) && guildConfiguration.logschannelid != "none") {

                    const embed = new Discord.RichEmbed()
                        .setColor(0xff7675)
                        .setAuthor(member.user.tag, member.user.avatarURL)
                        .setTitle("Member leave detected.")
                        .setFooter("Gatekeeper moderation")
                        .setTimestamp(new Date());

                    await client.channels.get(guildConfiguration.logschannelid).send(embed);
                }
            }
        });
    }
}