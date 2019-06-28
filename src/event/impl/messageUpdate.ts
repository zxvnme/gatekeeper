import * as Discord from "discord.js"

import {IEvent} from "../event";
import {Globals} from "../../globals";

export default class MessageUpdateEvent implements IEvent {
    constructor() {
        this.name = "messageUpdate"
    }

    name: string;

    override(client, messageOld, messageNew): void {
        if (messageOld.author === client.user) return;

        Globals.databaseConnection.query("SELECT * from guildconfiguration", (error, response, meta) => {
            for (const guildConfiguration of response) {
                if ((messageOld.guild.id == guildConfiguration.guildid) && guildConfiguration.logschannelid != "none") {

                    const embed = new Discord.RichEmbed()
                        .setColor(0x74b9ff)
                        .setAuthor(messageNew.author.tag, messageNew.author.avatarURL)
                        .setTitle("Message update detected.")
                        .setDescription(`Action performed in <#${messageNew.channel.id}>`)
                        .addField("Old:", `\`${messageOld.content}\``, true)
                        .addField("New:", `\`${messageNew.content}\``, true)
                        .setFooter("Gatekeeper moderation")
                        .setTimestamp(new Date());

                    client.channels.get(guildConfiguration.logschannelid).send(embed);
                }
            }
        });
    }
}