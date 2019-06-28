import * as Discord from "discord.js"

export interface ICommand {
    description: string,
    syntax: string,
    args: string,
    action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void>
}