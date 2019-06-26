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

    public static argsCheck(discordMessageInstance: Discord.Message, commandInstance: ICommand, args: string[]): boolean {
        const splitArgs = commandInstance.args.split(" ");
        if (args.length < splitArgs.length) {
            Announcements.error(discordMessageInstance, "Invalid usage", `Proper: **${commandInstance.syntax} ${commandInstance.args}**`, false);
            return false;
        }
        return true;
    }
}