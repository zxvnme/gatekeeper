import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Globals} from "../../globals";

export default class UserinfoCommand implements ICommand {

    constructor() {
        this.description = "Gets info about user.";
        this.syntax = "userinfo";
        this.args = "[user?: mention]";
    }

    description: string;
    syntax: string;
    args: string;

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        try {
            const user: Discord.User = (args[1]) ? message.mentions.members.first().user : message.author;
            let userRoles: string[] = [];

            for (const role of message.guild.members.get(user.id).roles.array())
                await userRoles.push(role.name);

            const embed = new Discord.RichEmbed()
                .setColor(0x36393f)
                .setAuthor(user.tag, user.avatarURL)
                .setDescription(`Info about <@${user.id}>`)
                .setThumbnail(user.avatarURL)
                .addField("Account info:",
                          `Username: \`${user.username}\`
                                 Discriminator: \`${user.discriminator}\`
                                 Identifier: \`${user.id}\`
                                 Account type: \`${(user.bot) ? `Bot` : `User`}\`
                                 Created at: \`${user.createdAt.toUTCString()}\``, false)
                .addField("Guild info:",
                          `Permissions bit field: \`${message.guild.members.get(user.id).permissions.bitfield.toString()}\`
                                 Joined at: \`${message.guild.members.get(user.id).joinedAt.toUTCString()}\`
                                 Roles: \`${userRoles.join("`, `")}\``, false)
                .setFooter("🔑 Gatekeeper moderation")
                .setTimestamp(new Date());

            await message.channel.send(embed);
        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}