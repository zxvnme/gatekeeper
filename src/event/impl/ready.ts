import * as moment from "moment";

import {IEvent} from "../event";
import {Globals} from "../../globals";
import * as Discord from "discord.js";

export default class ReadyEvent implements IEvent {
    constructor() {
        this.name = "ready"
    }

    name: string;

    async override(client): Promise<void> {
        await Globals.loggerInstance.success(`I am ready! ${client.user.tag}`);

        await Globals.databaseConnection.query(`SELECT * FROM mutedusers`, async (error, response) => {
            for (const mute of response) {
                if (Date.parse(new Date().toString()) >= Date.parse(mute.dateto)) {
                    await client.guilds.get(mute.guildid).members.get(mute.userid).removeRole(client.guilds.get(mute.guildid).roles.get(mute.muteroleid));
                    await Globals.databaseConnection.query(`DELETE FROM mutedusers WHERE userid='${mute.userid}' LIMIT 1`);

                    await Globals.databaseConnection.query("SELECT * from guildconfiguration", async (error, response, meta) => {
                        for (const guildConfiguration of response) {
                            if ((mute.guildid == guildConfiguration.guildid) && guildConfiguration.logschannelid != "none") {

                                const embed = new Discord.RichEmbed()
                                    .setColor(0x161616)
                                    .setAuthor(client.guilds.get(mute.guildid).members.get(mute.userid).user.tag, client.guilds.get(mute.guildid).members.get(mute.userid).user.avatarURL)
                                    .setTitle(`Member unmute detected.`)
                                    .addField("Mute time elapsed.", `automatic unmute`)
                                    .setFooter("🔑 Gatekeeper moderation")
                                    .setTimestamp(new Date());

                                // @ts-ignore
                                await client.channels.get(guildConfiguration.logschannelid).send(embed);
                            }
                        }
                    });
                }
            }
            //const memberToMute = client.guilds.get(response.guildid,)
            //
        });
    }
}