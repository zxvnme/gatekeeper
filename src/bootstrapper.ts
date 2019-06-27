import * as Discord from "discord.js"
import * as fs from "fs";
import * as Path from "path";

import {ICommand} from "./command/command";
import {Globals} from "./globals";

export interface IConfig {
    token: string;
    databaseHost: string;
    databaseUser: string;
    databasePassword: string;
    defaultPrefix: string;
}

interface IBootstrapper {
    commands: ICommand[]
    clientInstance: Discord.Client

    start(clientInstance: Discord.Client, config: IConfig): void
}

export class Bootstrapper implements IBootstrapper {
    commands: ICommand[];
    clientInstance: Discord.Client;

    private registerCommands() {
        try {
            Globals.loggerInstance.pending("Running registerCommands();");
            fs.readdir(Path.resolve(__dirname, "command", "impl"), (error, files) => {
                for (const command of files) {
                    const requiredCommand = require(Path.resolve(__dirname, "command", "impl", command)).default;
                    const commandClass = new requiredCommand() as ICommand;
                    this.commands.push(commandClass);
                    Globals.loggerInstance.success(`${command} loaded.`);
                }
                Globals.loggerInstance.complete("registerCommands(); completed.")
            });
        } catch (error) {
            Globals.loggerInstance.fatal(error);
        }
    }

    private detectOrCreateDatabase() {
        try {
            Globals.loggerInstance.pending("Detecting or creating database gatekeeper if not detected.");
            Globals.databaseConnection.query("CREATE DATABASE IF NOT EXISTS gatekeeper", (error, response) => {
                if (response.affectedRows > 0) {
                    Globals.loggerInstance.complete("Database creation successful.");
                } else {
                    Globals.loggerInstance.complete("Database detection successful.");
                }
                Globals.databaseConnection.query("USE gatekeeper");
                Globals.loggerInstance.info("Using database gateekeeper.");
                Globals.loggerInstance.pending("Creating or detecting table guildconfiguration with guildid and filter variables if not detected.");
                Globals.databaseConnection.query("CREATE TABLE IF NOT EXISTS `guildconfiguration` (`guildid` TEXT NULL DEFAULT NULL, `filter` INT(1) NULL DEFAULT NULL)", (error, response) => {
                    if (response.affectedRows > 0) {
                        Globals.loggerInstance.complete("Table creation sucessful.")
                    } else {
                        Globals.loggerInstance.complete("Table detection sucessful.")
                    }
                });

            })
        } catch (error) {
            Globals.loggerInstance.fatal(error);
        }
    }

    public start(clientInstance: Discord.Client, config: IConfig): void {
        this.clientInstance = clientInstance;
        this.commands = [];

        this.detectOrCreateDatabase();

        this.registerCommands();

        clientInstance.on("ready", () => {
            Globals.loggerInstance.success(`I am ready! (${clientInstance.user.tag})`);
        });

        clientInstance.on("message", message => {
            if (!message.content.startsWith(config.defaultPrefix)) return;

            let args = message.content.substring(config.defaultPrefix.length).split(" ");

            for (let command of this.commands) {
                if (command.syntax == args[0]) {
                    command.action(clientInstance, message, args);
                }
            }
        });

        clientInstance.on("error", error => {
            Globals.loggerInstance.fatal(error);
        });

        clientInstance.on("guildCreate", guild => {

            Globals.databaseConnection.query("INSERT INTO guildconfiguration(guildid, filter) value (?, ?)", [guild.id, 0]);

            const embed = new Discord.RichEmbed()
                .setThumbnail(clientInstance.user.avatarURL)
                .setColor(0xf1c40f)
                .setAuthor("Gatekeeper welcome message.")
                .setDescription("Hey! Psst! Im Gatekeeper - an advanced Discord **moderation** bot.")
                .addField("Why does i received this message?!", `Because it seems that you are owner of ${guild.name}`, true)
                .addField("Where can I see list of commands or smth?", "Commands documentation and feature list " +
                    "can be found at https://github.com/zxvnme/Gatekeeper/blob/master/README.md", true)
                .setFooter("Created by zxvnme#2598 under MIT License. https://github.com/zxvnme");

            guild.members.get(guild.ownerID).send(embed);
        });

        process.on("unhandledRejection", error => {
            Globals.loggerInstance.fatal(error);
        });

        clientInstance.login(config.token)
    }
}