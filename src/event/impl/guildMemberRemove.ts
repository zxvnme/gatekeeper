import * as Discord from "discord.js"

import {IEvent} from "../event";
import {Globals} from "../../globals";

export default class GuildMemberRemoveEvent implements IEvent {
    constructor() {
        this.name = "guildMemberRemove"
    }

    name: string;

    override(client, member): void {
        Globals.databaseConnection.query("SELECT * from guildconfiguration", (error, response, meta) => {
            for (const guildConfiguration of response) {
                if ((member.guild.id == guildConfiguration.guildid) && guildConfiguration.logschannelid != "none") {

                    const embed = new Discord.RichEmbed()
                        .setColor(0xff7675)
                        .setAuthor(member.user.tag, member.user.avatarURL)
                        .setTitle("Member leave detected.")
                        .setFooter("Gatekeeper moderation")
                        .setTimestamp(new Date());

                    client.channels.get(guildConfiguration.logschannelid).send(embed);
                }
            }
        });
    }
}