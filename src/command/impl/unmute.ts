import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";

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
        if (!Checks.permissionCheck(message, "MANAGE_MESSAGES")) return;

        if (!Checks.argsCheck(message, this, args)) return;

        const memberToUnmute = await message.mentions.members.first();
        const muteRole: Discord.Role = await message.guild.roles.find(role => role.name == "Muted");

        await memberToUnmute.removeRole(muteRole)
    }
}