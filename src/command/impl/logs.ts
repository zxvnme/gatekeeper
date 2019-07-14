import * as Discord from "discord.js"

import {getRepository} from "typeorm";

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";
import {Globals} from "../../globals";
import {GuildConfiguration} from "../../entity/guildConfiguration";

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

            const guildConfigurationsRepository = getRepository(GuildConfiguration);

            if (args[1] == "off") {

                guildConfigurationsRepository.createQueryBuilder().update(GuildConfiguration).set({
                    logsChannelID: "none"
                }).where("guildID = :=guildID", {
                    guildID: message.guild.id
                }).execute().then(() => {
                    Announcements.success(message, `Successfully disabled logs.`);
                });

            } else {
                const logsChannel = message.guild.channels.get(args[1]).id;

                guildConfigurationsRepository.createQueryBuilder().update(GuildConfiguration).set({
                    logsChannelID: logsChannel
                }).where("guildID = :guildID", {
                    guildID: message.guild.id
                }).execute().then(() => {
                    Announcements.success(message, `Successfully set logs channel to:`, `<#${logsChannel}>`);
                });
            }
        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }
}