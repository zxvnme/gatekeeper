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

    private async registerCommands(): Promise<any> {
        try {
            await Globals.loggerInstance.pending("Running registerCommands();");
            await fs.readdir(Path.resolve(__dirname, "command", "impl"), async (error, files) => {
                for (const command of files) {
                    const requiredCommand = require(Path.resolve(__dirname, "command", "impl", command)).default;
                    const commandClass = new requiredCommand() as ICommand;
                    await Globals.commands.push(commandClass);
                    await Globals.loggerInstance.success(`Command ${command} loaded.`);
                }
                await Globals.loggerInstance.complete("registerCommands(); completed.")
            });
        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }

    private async registerEvents(): Promise<any> {
        try {
            await Globals.loggerInstance.pending("Running registerEvents();");
            fs.readdir(Path.resolve(__dirname, "event", "impl"), async (error, files) => {
                for (const event of files) {
                    const requiredEvent = require(Path.resolve(__dirname, "event", "impl", event)).default;
                    const eventClass = new requiredEvent() as IEvent;
                    Globals.clientInstance.on(eventClass.name, eventClass.override.bind(null, Globals.clientInstance));
                    await Globals.loggerInstance.success(`Event ${event} loaded.`);
                }
                await Globals.loggerInstance.complete("registerEvents(); completed.")
            });
        } catch (error) {
            await Globals.loggerInstance.fatal(error);
        }
    }

    public async start(): Promise<void> {

        await this.registerCommands();
        await this.registerEvents();

        process.on("unhandledRejection", error => {
            Globals.loggerInstance.fatal(error);
        });

        await Globals.clientInstance.login(Globals.config.token)
    }
}