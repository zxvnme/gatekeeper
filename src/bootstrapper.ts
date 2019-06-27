import * as Discord from "discord.js"
import * as fs from "fs";
import * as Path from "path";

import {ICommand} from "./command/command";
import loggerInstance from "./logger";

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
        try {
            loggerInstance.pending("Running registerCommands();");
            fs.readdir(Path.resolve(__dirname, "command", "impl"), (error, files) => {
                for (const command of files) {
                    const requiredCommand = require(Path.resolve(__dirname, "command", "impl", command)).default;
                    const commandClass = new requiredCommand() as ICommand;
                    this.commands.push(commandClass);
                    loggerInstance.success(`${command} loaded.`);
                }
                loggerInstance.complete("registerCommands(); completed.")
            });
        } catch (error) {
            loggerInstance.fatal(error);
        }
    }

    public start(clientInstance: Discord.Client, config: IConfig): void {
        this.clientInstance = clientInstance;
        this.commands = [];

        this.registerCommands();

        clientInstance.on("ready", () => {
            loggerInstance.success(`I am ready! (${clientInstance.user.tag})`);

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
            loggerInstance.fatal(error);
        });

        clientInstance.on("guildCreate", guild => {
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
            loggerInstance.fatal(error);
        });

        clientInstance.login(config.token)
    }
}