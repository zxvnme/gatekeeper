import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";
import {Globals} from "../../globals";

export default class FilterCommand implements ICommand {

    constructor() {
        this.description = "Toggles bad words filter on the server.";
        this.syntax = "filter";
        this.args = "[filterState: number(0-1)]";
    }

    description: string;
    syntax: string;
    args: string;

    action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): void {
        if (!Checks.permissionCheck(message, "ADMINISTRATOR")) return;

        if (!Checks.argsCheck(message, this, args)) return;

        const filterState: number = parseInt(args[1]);

        if ((filterState > 1 || filterState < 0) || isNaN(filterState)) {
            Announcements.error(message, "The value must be number between 0 (for false) and 1 (for true)", undefined, true);
            return;
        }

        Globals.databaseConnection.query(`UPDATE guildconfiguration SET filter=${filterState} WHERE guildid=${message.guild.id}`);

        Announcements.success(message, `Successfully ${(filterState == 1) ? "enabled" : "disabled"} bad words filter on this server.`);
    }
}