import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Globals} from "../../globals";
import {getRepository} from "typeorm";
import {GuildConfiguration} from "../../entity/guildConfiguration";

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

            const guildConfigurationsRepository = getRepository(GuildConfiguration);

            guildConfigurationsRepository.find({where: {guildID: message.guild.id}}).then(configuration => {
                for (const guildConfiguration of configuration) {
                    if ((guildConfiguration.guildID == message.guild.id) && guildConfiguration.logsChannelID != "none") {

                        const embed = new Discord.RichEmbed()
                            .setColor(0x55efc4)
                            .setAuthor(bannedUser.tag, bannedUser.avatarURL)
                            .setTitle(`Member unban detected.`)
                            .setDescription(`<@${bannedUser.id}> has been unbanned.`)
                            .addField("Invoker:", `<@${message.author.id}>`)
                            .setFooter("🔑 Gatekeeper moderation")
                            .setTimestamp(new Date());

                        // @ts-ignore
                        clientInstance.channels.get(guildConfiguration.logsChannelID).send(embed);
                    }
                }
            });
        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}