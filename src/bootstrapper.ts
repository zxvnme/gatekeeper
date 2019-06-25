import * as Discord from "discord.js"
import * as signale from "signale";
import * as fs from "fs";

import {ICommand} from "./command/command";

export interface IConfig {
    token: string;
    defaultPrefix: string;
}

interface IBootstrapper {
    commands: ICommand[]
    clientInstance: Discord.Client
    loggerInstance: signale

    start(clientInstance: Discord.Client, loggerInstance: signale, config: IConfig): void
}

export class Bootstrapper implements IBootstrapper {
    commands: ICommand[];
    clientInstance: Discord.Client;
    loggerInstance: signale;

    private registerCommands() {
        this.loggerInstance.pending("Running registerCommands();");
        const commands = fs.readdirSync(`${__dirname}/command/impl/`);
        commands.forEach((command) => {
            try {
                const requiredCommand = require(`${__dirname}/command/impl/${command}`).default;
                const commandClass = new requiredCommand() as ICommand;
                this.commands.push(commandClass);

                this.loggerInstance.success(`${command} loaded.`);
            } catch (error) {
                this.loggerInstance.fatal(error);
            }
        });
        this.loggerInstance.complete("registerCommands(); completed.")
    }

    public start(clientInstance: Discord.Client, loggerInstance: signale, config: IConfig): void {
        this.clientInstance = clientInstance;
        this.loggerInstance = loggerInstance;
        this.commands = [];

        this.registerCommands();

        clientInstance.on("error", (error) => {
            this.loggerInstance.fatal(error);
        });

        process.on("unhandledRejection", (error) => {
            this.loggerInstance.fatal(error);
        });

        clientInstance.on("ready", () => {
            this.loggerInstance.success(`I am ready! (${clientInstance.user.tag})`);
        });

        clientInstance.on("message", (message) => {
            if (!message.content.startsWith(config.defaultPrefix)) return;

            let args = message.content.substring(config.defaultPrefix.length).split(" ");

            for (let command of this.commands) {
                if (command.syntax == args[0]) {
                    command.action(clientInstance, loggerInstance, message, args);
                }
            }
        });

        clientInstance.login(config.token)
    }
}