import * as Discord from "discord.js"

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
                setTimeout(async () => {
                    await memberToMute.removeRole(muteRole.id);
                }, parseInt(args[2]) * 1000 * 60);
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