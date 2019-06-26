import * as Discord from "discord.js"

enum Colors {
    BAD_RED = 0xff7675,
    GOOD_GREEN = 0x55efc4
}

export class Announcements {
    public static error(discordMessageInstance: Discord.Message, title: string, description?: string, deleteAfter?: boolean) {
        const embed = new Discord.RichEmbed().setColor(Colors.BAD_RED).setTitle(`❌ ${title}`);

        if (description) {
            embed.setDescription(description);
        }

        const sentMessage = discordMessageInstance.channel.send(embed);

        if (deleteAfter) {
            sentMessage.then(message => {
                // @ts-ignore
                message.delete(5000);
            });
        }
    }

    public static success(discordMessageInstance: Discord.Message, title: string, description?: string, deleteAfter?: boolean) {
        const embed = new Discord.RichEmbed().setColor(Colors.GOOD_GREEN).setTitle(`✔️ ${title}`);

        if (description) {
            embed.setDescription(description);
        }

        const sentMessage = discordMessageInstance.channel.send(embed);

        if (deleteAfter) {
            sentMessage.then(message => {
                // @ts-ignore
                message.delete(5000);
            });
        }
    }
}