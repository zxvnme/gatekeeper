import * as Discord from "discord.js"

import {getRepository} from "typeorm";

import {IEvent} from "../event";
import {Globals} from "../../globals";
import {Announcements} from "../../utils/announcements";
import {LastMessage} from "../../entity/lastMessage";
import {GuildConfiguration} from "../../entity/guildConfiguration";

export default class MessageEvent implements IEvent {
    constructor() {
        this.name = "message"
    }

    name: string;

    async override(client, message): Promise<void> {
        if (message.author.bot) return;

        const lastMessagesRepository = getRepository(LastMessage);
        const guildConfigurationsRepository = getRepository(GuildConfiguration);

        let messageToCache = message.content;
        const lastMessage = new LastMessage();

        lastMessage.guildName = message.guild.name;
        lastMessage.guildID = message.guild.id;
        lastMessage.channelID = message.channel.id;
        lastMessage.messageContent = /`/g.test(messageToCache) ? messageToCache.replace(/`/g, ``) : messageToCache;
        lastMessage.authorID = message.author.id;

        lastMessagesRepository.save(lastMessage).then(() => {
            lastMessagesRepository.find({
                where: {
                    guildID: message.guild.id,
                    channelID: message.channel.id
                }
            }).then(async cachedMessages => {
                if (cachedMessages.length > 20)
                    await lastMessagesRepository.remove(cachedMessages[0]); // Remove first element.
            });
        });

        guildConfigurationsRepository.find({where: {guildID: message.guild.id}}).then(async configuration => {
            for (const guildConfiguration of configuration)
                if (guildConfiguration.profanityChecker === 1)
                    if (Globals.filterInstance.isProfane(message.content)) {
                        await message.delete();
                        await Announcements.warning(message, `${message.author.username}, you've used one of the bad words! Keep your language nice...`, undefined, true)
                    }
        });

        if (!message.content.startsWith(Globals.config.defaultPrefix)) return;

        let args = await message.content.substring(Globals.config.defaultPrefix.length).split(" ");

        if (args[0] == "help") {
            let helpArray: string[] = [];
            for (const command of Globals.commands) {
                helpArray.push(`\`${command.syntax}\` - *${command.description}*`);
            }

            const embed = new Discord.RichEmbed()
                .setColor(0xf1c40f)
                .setAuthor("Gatekeeper help.", client.user.avatarURL)
                .setDescription(helpArray.join("\n"))
                .setFooter("g!usage [command] for its usage!");

            await message.channel.send(embed);
            return;
        }

        if (args[0] == "usage") {
            if (args[1] == "help") {
                await Announcements.info(message, "7 billion neurons user detected.", `It seems that you have 200IQ.\n
                Feel free to contribute to https://github.com/zxvnme/Gatekeeper :)\n
                I am waiting for you - Gatekeeper dev`);
                return;
            }

            let temp: string;
            for (const command of Globals.commands) {
                if (command.syntax == args[1]) {
                    temp = `${command.syntax} ${command.args}`;
                }
            }

            await Announcements.info(message, "Command usage", temp);
            return;
        }

        for (const command of Globals.commands) {
            if (command.syntax == args[0]) {
                await command.action(Globals.clientInstance, message, args);
            }
        }
    }
}