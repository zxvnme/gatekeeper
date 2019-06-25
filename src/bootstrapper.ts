import * as Discord from "discord.js"
import * as signale from "signale";

import {ICommand} from "./command/command";
import PingCommand from "./command/impl/ping";

export interface IConfig {
    token: string;
    defaultPrefix: string;
}

interface IBootstrapper {
    commands: ICommand[]
    clientInstance: Discord.Client

    start(clientInstance: Discord.Client, loggerInstance: signale, config: IConfig): void
}

export class Bootstrapper implements IBootstrapper {
    commands: ICommand[];
    clientInstance: Discord.Client;

    private registerCommands() {
        this.commands.push(new PingCommand());
    }

    public start(clientInstance: Discord.Client, loggerInstance: signale, config: IConfig): void {
        this.clientInstance = clientInstance;
        this.commands = [];

        this.registerCommands();

        clientInstance.on("error", (error) => {
            loggerInstance.fatal(error);
        });

        process.on("unhandledRejection", (error) => {
            loggerInstance.fatal(error);
        });

        clientInstance.on("ready", () => {
            loggerInstance.success(`I am ready! (${clientInstance.user.tag})`)
        });

        clientInstance.on("message", (message) => {
            if(!message.content.startsWith(config.defaultPrefix)) return;

            let args = message.content.substring(config.defaultPrefix.length).split(" ");

            for(let command of this.commands) {
                if(command.syntax == args[0]) {
                    command.action(clientInstance, loggerInstance, message, args);
                }
            }
        });

        clientInstance.login(config.token)
    }
}