import * as Discord from "discord.js"

import {IEvent} from "../event";
import {Globals} from "../../globals";

export default class MessageDeleteEvent implements IEvent {
    constructor() {
        this.name = "messageDelete"
    }

    name: string;

    async override(client, message): Promise<void> {
        if (message.author == client.user) return;
        if (message.author.bot) return;

        await Globals.databaseConnection.query("SELECT * from guildconfiguration", async (error, response, meta) => {
            for (const guildConfiguration of response) {
                if ((message.guild.id == guildConfiguration.guildid) && guildConfiguration.logschannelid != "none") {

                    const embed = new Discord.RichEmbed()
                        .setColor(0xff7675)
                        .setAuthor(message.author.tag, message.author.avatarURL)
                        .setTitle("Message deletion detected.")
                        .setDescription(`Action performed in <#${message.channel.id}>`)
                        .addField("Message:", `\`${message.content}\``, true)
                        .setFooter("Gatekeeper moderation")
                        .setTimestamp(new Date());

                    await client.channels.get(guildConfiguration.logschannelid).send(embed);
                }
            }
        });
    }
}