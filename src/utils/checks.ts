import * as Discord from "discord.js"
import {ICommand} from "../command/command";

export class Checks {
    public static permissionCheck(discordMessageInstance: Discord.Message, permission: Discord.PermissionResolvable): boolean {
        if (!discordMessageInstance.member.hasPermission(permission)) {
            const embed = new Discord.RichEmbed()
                .setColor(0xff7675)
                .setTitle("❌ You dont have permissions for that");
            discordMessageInstance.channel.send(embed).then(sent => {
                setTimeout(() => {
                    // @ts-ignore
                    sent.delete();
                }, 5000);
            });
            return false;
        }
        return true;
    }

    public static argsCheck(discordMessageInstance: Discord.Message, commandInstance: ICommand, args: string[]): boolean {
        const splitArgs = commandInstance.args.split(" ");
        if (args.length < splitArgs.length) {
            const embed = new Discord.RichEmbed()
                .setColor(0xff7675)
                .setAuthor("❌ Invalid usage")
                .setDescription(`Proper: **${commandInstance.syntax} ${commandInstance.args}**`);
            discordMessageInstance.channel.send(embed);
            return false;
        }
        return true;
    }
}