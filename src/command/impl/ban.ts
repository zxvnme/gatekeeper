import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Globals} from "../../globals";

export default class BanCommand implements ICommand {

    constructor() {
        this.description = "Bans user from a server.";
        this.syntax = "ban";
        this.args = "[memberToBan: mention] [daysToDelete: number] [reason: string]";
    }

    description: string;
    syntax: string;
    args: string;

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        try {
            if (!Checks.permissionCheck(message, "BAN_MEMBERS")) return;

            if (!Checks.argsCheck(message, this, args)) return;

            const memberToBan = await message.mentions.members.first();
            const daysToDelete: number = await parseInt(args[2]);
            await args.splice(0, 3);
            await memberToBan.ban({
                days: daysToDelete,
                reason: `${args.join(" ")} (command invoked by: ${message.author.tag})`
            });

            await Globals.databaseConnection.query("SELECT * from guildconfiguration", async (error, response, meta) => {
                for (const guildConfiguration of response) {
                    if ((message.guild.id == guildConfiguration.guildid) && guildConfiguration.logschannelid != "none") {

                        const embed = new Discord.RichEmbed()
                            .setColor(0xff7675)
                            .setAuthor(memberToBan.user.tag, memberToBan.user.avatarURL)
                            .setTitle(`Member ban detected.`)
                            .setDescription(`<@${memberToBan.id}> has been banned.\n
                            Deleted user messages from ${daysToDelete} days`)
                            .addField("Invoker:", `<@${message.author.id}>`)
                            .addField("Reason", args.join(" "))
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