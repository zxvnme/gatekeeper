import {ICommand} from "../command";

import * as Discord from "discord.js"
import {Checks} from "../../utils/checks";

export default class PardonCommand implements ICommand {

    constructor() {
        this.description = "Unbans banned user from server.";
        this.syntax = "pardon";
        this.args = "[bannedUserTag: string]";
    }

    description: string;
    syntax: string;
    args: string;

    action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): void {
        if (!Checks.permissionCheck(message, "BAN_MEMBERS")) return;

        if(!Checks.argsCheck(message, this, args)) return;

        message.guild.fetchBans().then(bans => {
            const bannedUser = bans.find(bannedUser => bannedUser.tag === args[1]);
            message.guild.unban(bannedUser.id);
            bannedUser.send(`You have been unbanned from ${message.guild.name}`);
        })
    }
}