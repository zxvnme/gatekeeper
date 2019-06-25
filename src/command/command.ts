import * as Discord from "discord.js"
import * as signale from "signale";

export interface ICommand {
    description: string,
    syntax: string,
    action(clientInstance: Discord.Client, loggerInstance: signale, message: Discord.Message, args: string[]): void
}