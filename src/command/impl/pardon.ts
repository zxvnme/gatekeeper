import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Globals} from "../../globals";

export default class PardonCommand implements ICommand {

    constructor() {
        this.description = "Unbans banned user from server.";
        this.syntax = "pardon";
        this.args = "[bannedUserTag: string]";
    }

    description: string;
    syntax: string;
    args: string;

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        try {
            if (!Checks.permissionCheck(message, "BAN_MEMBERS")) return;

            if (!Checks.argsCheck(message, this, args)) return;

            let bannedUser;

            await message.guild.fetchBans().then(async bans => {
                bannedUser = await bans.find(bannedUser => bannedUser.tag === args[1]);
                await message.guild.unban(bannedUser.id);
            });

            await Globals.databaseConnection.query("SELECT * from guildconfiguration", async (error, response, meta) => {
                for (const guildConfiguration of response) {
                    if ((message.guild.id == guildConfiguration.guildid) && guildConfiguration.logschannelid != "none") {

                        const embed = new Discord.RichEmbed()
                            .setColor(0x55efc4)
                            .setAuthor(bannedUser.tag, bannedUser.avatarURL)
                            .setTitle(`Member unban detected.`)
                            .setDescription(`<@${bannedUser.id}> has been unbanned.`)
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