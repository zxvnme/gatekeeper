import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";
import {Globals} from "../../globals";

export default class LogsCommand implements ICommand {

    constructor() {
        this.description = "Toggle Gatekeeper chat logs.";
        this.syntax = "logs";
        this.args = "[logsChannelId: string]";
    }

    description: string;
    syntax: string;
    args: string;

    action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): void {
        if (!Checks.permissionCheck(message, "ADMINISTRATOR")) return;

        if (!Checks.argsCheck(message, this, args)) return;

        try {
            if (args[1] == "off") {
                Globals.databaseConnection.query(`UPDATE guildconfiguration SET logschannelid='none' WHERE guildid=${message.guild.id}`, (error, response) => {
                    if (response.affectedRows > 0) {
                        Announcements.success(message, `Successfully disabled logs.`);
                    }
                });
            } else {
                const logsChannel = message.guild.channels.get(args[1]).id;
                Globals.databaseConnection.query(`UPDATE guildconfiguration SET logschannelid=${logsChannel} WHERE guildid=${message.guild.id}`, (error, response) => {
                    if (response.affectedRows > 0) {
                        Announcements.success(message, `Successfully set logs channel to:`, `<#${logsChannel}>`);
                    }
                });
            }
        } catch (error) {
            Globals.loggerInstance.fatal(error);
        }
    }
}