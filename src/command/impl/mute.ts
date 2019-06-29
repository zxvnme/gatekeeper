import * as Discord from "discord.js";
import * as moment from "moment";

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";
import {Globals} from "../../globals";

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

            const memberToMute = await message.mentions.members.first();

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
                    console.log(channel.id);
                    await message.guild.channels.get(channel.id).overwritePermissions(muteRole.id, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });
            }

            await memberToMute.addRole(muteRole);

            if (args[2]) {
                const now: Date = new Date();
                await Globals.databaseConnection.query(`INSERT INTO mutedusers (guildname, guildid, userid, muteroleid, datefrom, dateto) VALUES ('${message.guild.name}',  '${message.guild.id}', '${memberToMute.id}', '${muteRole.id}', '${now}', '${moment(now).add(parseInt(args[2]), "m").toString()}')`, (error, response) => {
                    setTimeout(async () => {
                        await Globals.databaseConnection.query(`DELETE FROM mutedusers WHERE userid='${memberToMute.id}' LIMIT 1`);
                        await memberToMute.removeRole(muteRole.id);

                        await Globals.databaseConnection.query("SELECT * from guildconfiguration", async (error, response, meta) => {
                            for (const guildConfiguration of response) {
                                if ((message.guild.id == guildConfiguration.guildid) && guildConfiguration.logschannelid != "none") {

                                    const embed = new Discord.RichEmbed()
                                        .setColor(0x161616)
                                        .setAuthor(memberToMute.user.tag, memberToMute.user.avatarURL)
                                        .setTitle(`Member unmute detected.`)
                                        .addField("Mute time elapsed.", `automatic unmute`)
                                        .setFooter("🔑 Gatekeeper moderation")
                                        .setTimestamp(new Date());

                                    // @ts-ignore
                                    await clientInstance.channels.get(guildConfiguration.logschannelid).send(embed);
                                }
                            }
                        });
                    }, parseInt(args[2]) * 1000 * 60);
                });
            }

            await Globals.databaseConnection.query("SELECT * from guildconfiguration", async (error, response, meta) => {
                for (const guildConfiguration of response) {
                    if ((message.guild.id == guildConfiguration.guildid) && guildConfiguration.logschannelid != "none") {

                        const embed = new Discord.RichEmbed()
                            .setColor(0x000)
                            .setAuthor(memberToMute.user.tag, memberToMute.user.avatarURL)
                            .setTitle(`Member ${(args[2] ? "temporary mute" : "mute")} detected.`)
                            .setDescription(`Mute will stay ${(args[2]) ? "for " + args[2] + "min" : "forever"} if not unmuted earlier.`)
                            .addField("Invoker:", `<@${message.author.id}>`)
                            .setFooter("🔑 Gatekeeper moderation")
                            .setTimestamp(new Date());

                        // @ts-ignore
                        await clientInstance.channels.get(guildConfiguration.logschannelid).send(embed);
                    }
                }
            });
        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}