import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Globals} from "../../globals";

export default class UnmuteCommand implements ICommand {

    constructor() {
        this.description = "Unmutes an user.";
        this.syntax = "unmute";
        this.args = "[memberToUnmute: mention]";
    }

    description: string;
    syntax: string;
    args: string;

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        try {
            if (!Checks.permissionCheck(message, "MANAGE_MESSAGES")) return;

            if (!Checks.argsCheck(message, this, args)) return;

            const memberToUnmute = await message.mentions.members.first();
            const muteRole: Discord.Role = await message.guild.roles.find(role => role.name == "Muted");

            await memberToUnmute.removeRole(muteRole);

            await Globals.databaseConnection.query("SELECT * from guildconfiguration", async (error, response, meta) => {
                for (const guildConfiguration of response) {
                    if ((message.guild.id == guildConfiguration.guildid) && guildConfiguration.logschannelid != "none") {

                        const embed = new Discord.RichEmbed()
                            .setColor(0x161616)
                            .setAuthor(memberToUnmute.user.tag, memberToUnmute.user.avatarURL)
                            .setTitle(`Member unmute detected.`)
                            .setFooter("Gatekeeper moderation")
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