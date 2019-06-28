import * as Discord from "discord.js"

import {IEvent} from "../event";
import {Globals} from "../../globals";

export default class GuildCreateEvent implements IEvent {
    constructor() {
        this.name = "guildCreate"
    }

    name: string;

    override(client, guild): void {
        Globals.databaseConnection.query("INSERT INTO guildconfiguration(guildid, logschannelid, filter) value (?, ?, ?)", [guild.id, "none", 0]);

        const embed = new Discord.RichEmbed()
            .setThumbnail(Globals.clientInstance.user.avatarURL)
            .setColor(0xf1c40f)
            .setAuthor("Gatekeeper welcome message.")
            .setDescription("Hey! Psst! Im Gatekeeper - an advanced Discord **moderation** bot.")
            .addField("Why does i received this message?!", `Because it seems that you are owner of ${guild.name}`, true)
            .addField("Where can I see list of commands or smth?", "Commands documentation and feature list " +
                "can be found at https://github.com/zxvnme/Gatekeeper/blob/master/README.md", true)
            .setFooter("Created by zxvnme#2598 under LGPL 2.1 License. https://github.com/zxvnme");

        guild.members.get(guild.ownerID).send(embed);
    }
}