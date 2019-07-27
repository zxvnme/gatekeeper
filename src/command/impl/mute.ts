import * as Discord from "discord.js";
import * as moment from "moment";

import {getRepository} from "typeorm";

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";
import {Globals} from "../../globals";
import {GuildConfiguration} from "../../entity/guildConfiguration";
import {MutedUser} from "../../entity/mutedUser";

export default class MuteCommand implements ICommand {

    constructor() {
        this.description = "Mutes an user.";
        this.syntax = "mute";
        this.args = "[memberToMute: mention] [time?: number(minutes)]";
    }

    description: string;
    syntax: string;
    args: string;

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        try {
            if (!Checks.permissionCheck(message, "MANAGE_MESSAGES")) return;

            if (!args[1]) {
                await Announcements.error(message, "Invalid usage", `Proper: **${this.syntax} ${this.args}**`, false);
                return;
            }

            const guildConfigurationsRepository = getRepository(GuildConfiguration);
            const memberToMute = await message.mentions.members.first();

            if (!Checks.ableToManage(message, memberToMute)) return;

            let muteRole: Discord.Role = await message.guild.roles.find(role => role.name == "Muted");

            if (!muteRole) {
                await message.guild.createRole({
                    name: "Muted",
                    color: 0x0000,
                    permissions: []
                }).then(async role => {
                    muteRole = role;
                });

                await message.guild.channels.forEach(async channel => {
                    await message.guild.channels.get(channel.id).overwritePermissions(muteRole.id, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });
            }

            await memberToMute.addRole(muteRole);

            if (args[2]) {
                const now: Date = new Date();

                const mutedUsersRepository = getRepository(MutedUser);

                const mutedUser = new MutedUser();
                mutedUser.guildName = message.guild.name;
                mutedUser.guildID = message.guild.id;
                mutedUser.userID = memberToMute.id;
                mutedUser.muteRoleID = muteRole.id;
                mutedUser.dateFrom = now.toString();
                mutedUser.dateTo = moment(now).add(parseInt(args[2]), "m").toString();

                mutedUsersRepository.save(mutedUser).then(muted => {
                   setTimeout(async () => {
                       await mutedUsersRepository.remove(muted);
                       await memberToMute.removeRole(muteRole.id);

                       guildConfigurationsRepository.find({where: {guildID: message.guild.id}}).then(configuration => {
                           for (const guildConfiguration of configuration) {
                               if ((guildConfiguration.guildID == message.guild.id) && guildConfiguration.logsChannelID != "none") {

                                   const embed = new Discord.RichEmbed()
                                       .setColor(0x161616)
                                       .setAuthor(memberToMute.user.tag, memberToMute.user.avatarURL)
                                       .setTitle(`Member unmute detected.`)
                                       .addField("Mute time elapsed.", `auto unmute.`)
                                       .setFooter("🔑 Gatekeeper moderation")
                                       .setTimestamp(new Date());

                                   // @ts-ignore
                                   clientInstance.channels.get(guildConfiguration.logsChannelID).send(embed);
                               }
                           }
                       });

                   }, parseInt(args[2]) * 1000 * 60);
                });
            }


            guildConfigurationsRepository.find({where: {guildID: message.guild.id}}).then(configuration => {
                for (const guildConfiguration of configuration) {
                    if ((guildConfiguration.guildID == message.guild.id) && guildConfiguration.logsChannelID != "none") {

                        const embed = new Discord.RichEmbed()
                            .setColor(0x000)
                            .setAuthor(memberToMute.user.tag, memberToMute.user.avatarURL)
                            .setTitle(`Member ${(args[2] ? "temporary mute" : "mute")} detected.`)
                            .setDescription(`Mute will stay ${(args[2]) ? "for " + args[2] + "min" : "forever"} if not unmuted earlier.`)
                            .addField("Invoker:", `<@${message.author.id}>`)
                            .setFooter("🔑 Gatekeeper moderation")
                            .setTimestamp(new Date());

                        // @ts-ignore
                        clientInstance.channels.get(guildConfiguration.logsChannelID).send(embed);
                    }
                }
            }).then(() => {
                Announcements.success(message, `Successfully muted`, `<@${memberToMute.user.id}>.`);
            });
        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}