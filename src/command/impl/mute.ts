import * as Discord from "discord.js"

import {ICommand} from "../command";
import {Checks} from "../../utils/checks";
import {Announcements} from "../../utils/announcements";

export default class MuteCommand implements ICommand {

    constructor() {
        this.description = "Mutes an user.";
        this.syntax = "mute";
        this.args = "[memberToMute: mention] [time?: number(minutes)]";
    }

    description: string;
    syntax: string;
    args: string;

    async action(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void> {
        if (!Checks.permissionCheck(message, "MANAGE_MESSAGES")) return;

        if (!args[1]) {
            Announcements.error(message, "Invalid usage", `Proper: **${this.syntax} ${this.args}**`, false);
            return;
        }

        const memberToMute = message.mentions.members.first();

        let muteRole: Discord.Role = message.guild.roles.find(role => role.name == "Muted");

        if (!muteRole) {
            await message.guild.createRole({
                name: "Muted",
                color: 0x000000,
                permissions: []
            }).then(async role => {
                muteRole = role;
            });

            await message.guild.channels.forEach(async channel => {
                console.log(channel.id);
                await message.guild.channels.get(channel.id).overwritePermissions(muteRole.id, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        }

        await memberToMute.addRole(muteRole);

        if (args[2]) {
            setTimeout(async () => {
                memberToMute.removeRole(muteRole.id);
            }, parseInt(args[2]) * 1000);
        }
    }
}