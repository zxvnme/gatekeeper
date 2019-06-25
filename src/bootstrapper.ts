import * as Discord from "discord.js"

import {ICommand} from "./command/command";
import PingCommand from "./command/impl/ping";

export interface IConfig {
    token: string;
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
        this.commands.push(new PingCommand());
    }

    public start(clientInstance: Discord.Client, config: IConfig): void {
        this.clientInstance = clientInstance;
        this.commands = [];

        this.registerCommands();

        clientInstance.on("ready", () => {
            console.log(clientInstance.user.tag);
        });

        clientInstance.on("message", (message) => {
            if(!message.content.startsWith(config.defaultPrefix)) return;

            let args = message.content.substring(config.defaultPrefix.length).split(" ");

            for(let command of this.commands) {
                if(command.syntax == args[0]) {
                    command.action(clientInstance, message, args);
                }
            }
        });

        clientInstance.login(config.token)
    }
}