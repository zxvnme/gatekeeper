import {IEvent} from "../event";
import {Globals} from "../../globals";
import {getRepository} from "typeorm";
import {MutedUser} from "../../entity/mutedUser";
import {GuildConfiguration} from "../../entity/guildConfiguration";
import * as Discord from "discord.js";

export default class ReadyEvent implements IEvent {
    constructor() {
        this.name = "ready"
    }

    name: string;

    async override(client): Promise<void> {
        await Globals.loggerInstance.success(`I am ready! ${client.user.tag}`);

        const mutedUsersRepository = getRepository(MutedUser);
        const guildConfigurationsRepository = getRepository(GuildConfiguration);

        mutedUsersRepository.find().then(async mutedUsers => {
            for (const muted of mutedUsers) {
                if (Date.parse(new Date().toString()) >= Date.parse(muted.dateTo)) {
                    await client.guilds.get(muted.guildID).members.get(muted.userID).removeRole(client.guilds.get(muted.guildID).roles.get(muted.muteRoleID));
                    await mutedUsersRepository.remove(muted);

                    guildConfigurationsRepository.find({where: {guildID: muted.guildID}}).then(configuration => {
                        for (const guildConfiguration of configuration) {
                            if ((guildConfiguration.guildID == muted.guildID) && guildConfiguration.logsChannelID != "none") {

                                const embed = new Discord.RichEmbed()
                                    .setColor(0x161616)
                                    .setAuthor(client.guilds.get(muted.guildID).members.get(muted.userID).user.tag, client.guilds.get(muted.guildID).members.get(muted.userID).user.avatarURL)
                                    .setTitle(`Member unmute detected.`)
                                    .addField("Mute time elapsed.", `automatic unmute`)
                                    .setFooter("🔑 Gatekeeper moderation")
                                    .setTimestamp(new Date());

                                // @ts-ignore
                                client.channels.get(guildConfiguration.logsChannelID).send(embed);
                            }
                        }
                    });
                }
            }
        });
    }
}