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

            await message.guild.fetchBans().then(async bans => {
                const bannedUser = await bans.find(bannedUser => bannedUser.tag === args[1]);
                await message.guild.unban(bannedUser.id);
                await bannedUser.send(`You have been unbanned from ${message.guild.name}`);
            })
        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}