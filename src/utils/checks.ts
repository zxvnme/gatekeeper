import * as Discord from "discord.js"

import {ICommand} from "../command/command";
import {Announcements} from "./announcements";

export class Checks {
    public static permissionCheck(discordMessageInstance: Discord.Message, permission: Discord.PermissionResolvable): boolean {
        if (!discordMessageInstance.member.hasPermission(permission)) {
            Announcements.error(discordMessageInstance, "You dont have permissions for that", undefined, true);
            return false;
        }

        return true;
    }

    public static ableToManage(discordMessageInstance: Discord.Message, member: Discord.GuildMember): boolean {
        if (discordMessageInstance.author.id === discordMessageInstance.guild.ownerID)
            return true;

        if ((member.highestRole.position >= discordMessageInstance.member.highestRole.position)
            || member.user.id === discordMessageInstance.guild.ownerID
            || !(member.kickable || member.bannable || member.manageable)) {
            Announcements.error(discordMessageInstance, "I can't do that", undefined, true);
            return false;
        }

        return true;
    }

    public static argsCheck(discordMessageInstance: Discord.Message, commandInstance: ICommand, args: string[]): boolean {
        const splitArgs = commandInstance.args.split("[");
        if (args.length < splitArgs.length) {
            Announcements.error(discordMessageInstance, "Invalid usage", `Proper: **${commandInstance.syntax} ${commandInstance.args}**`, false);
            return false;
        }
        return true;
    }
}