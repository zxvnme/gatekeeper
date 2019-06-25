import {ICommand} from "../command";

import * as Discord from "discord.js"

export default class PardonCommand implements ICommand {

    constructor() {
        this.description = "Unbans banned user from server.";
        this.syntax = "pardon";
    }

    description: string;
    syntax: string;

    action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): void {
        if (!message.member.hasPermission("ADMINISTRATOR")) return;

        message.guild.fetchBans().then(bans => {
            const bannedUser = bans.find(bannedUser => bannedUser.tag === args[1]);
            message.guild.unban(bannedUser.id);
            bannedUser.send(`You have been unbanned from ${message.guild.name}`);
        })
    }
}