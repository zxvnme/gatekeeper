import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";
import {Globals} from "../../globals";

export default class LogsCommand implements ICommand {

    constructor() {
        this.description = "Toggle Gatekeeper chat logs.";
        this.syntax = "logs";
        this.args = "[logsChannelId: snowflake/string(none)]";
    }

    description: string;
    syntax: string;
    args: string;

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        try {
            if (!Checks.permissionCheck(message, "ADMINISTRATOR")) return;

            if (!Checks.argsCheck(message, this, args)) return;

            if (args[1] == "off") {
                await Globals.databaseConnection.query(`UPDATE guildconfiguration SET logschannelid='none' WHERE guildid=${message.guild.id}`, async (error, response) => {
                    if (response.affectedRows > 0) {
                        await Announcements.success(message, `Successfully disabled logs.`);
                    }
                });
            } else {
                const logsChannel = message.guild.channels.get(args[1]).id;
                await Globals.databaseConnection.query(`UPDATE guildconfiguration SET logschannelid=${logsChannel} WHERE guildid=${message.guild.id}`, async (error, response) => {
                    if (response.affectedRows > 0) {
                        await Announcements.success(message, `Successfully set logs channel to:`, `<#${logsChannel}>`);
                    }
                });
            }
        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}