
import * as fs from "fs";
import * as Path from "path";

import {ICommand} from "./command/command";
import {Globals} from "./globals";
import {IEvent} from "./event/event";

export interface IConfig {
    token: string;
    databaseHost: string;
    databaseUser: string;
    databasePassword: string;
    defaultPrefix: string;
}

export class Bootstrapper {

    private registerCommands() {
        try {
            Globals.loggerInstance.pending("Running registerCommands();");
            fs.readdir(Path.resolve(__dirname, "command", "impl"), (error, files) => {
                for (const command of files) {
                    const requiredCommand = require(Path.resolve(__dirname, "command", "impl", command)).default;
                    const commandClass = new requiredCommand() as ICommand;
                    Globals.commands.push(commandClass);
                    Globals.loggerInstance.success(`${command} loaded.`);
                }
                Globals.loggerInstance.complete("registerCommands(); completed.")
            });
        } catch (error) {
            Globals.loggerInstance.fatal(error);
        }
    }


    private registerEvents() {
        try {
            Globals.loggerInstance.pending("Running registerEvents();");
            fs.readdir(Path.resolve(__dirname, "event", "impl"), (error, files) => {
                for (const event of files) {
                    const requiredEvent = require(Path.resolve(__dirname, "event", "impl", event)).default;
                    const eventClass = new requiredEvent() as IEvent;
                    Globals.clientInstance.on(eventClass.name, eventClass.override.bind(null, Globals.clientInstance));
                    Globals.loggerInstance.success(`${event} loaded.`);
                }
                Globals.loggerInstance.complete("registerEvents(); completed.")
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
                Globals.loggerInstance.pending("Creating or detecting table guildconfiguration with guildid, logschannelid and filter variables if not detected.");
                Globals.databaseConnection.query("CREATE TABLE IF NOT EXISTS `guildconfiguration` (`guildid` TEXT NULL DEFAULT NULL, `logschannelid` TEXT NULL DEFAULT NULL, `filter` INT(1) NULL DEFAULT NULL)", (error, response) => {
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

    public start(): void {
        this.detectOrCreateDatabase();

        this.registerCommands();

        this.registerEvents();

        process.on("unhandledRejection", error => {
            Globals.loggerInstance.fatal(error);
        });

        Globals.clientInstance.login(Globals.config.token)
    }
}