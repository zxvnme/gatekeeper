import * as Discord from "discord.js"

export class Checks {
    public static permissionCheck(discordMessageInstance: Discord.Message, permission: Discord.PermissionResolvable) : boolean {
        if(!discordMessageInstance.member.hasPermission(permission)) {
            const embed = new Discord.RichEmbed()
                .setColor(0xff7675)
                .setDescription("❌ You dont have permissions for that");
            discordMessageInstance.channel.send(embed).then(sent => {
                setTimeout(() => {
                    // @ts-ignore
                    sent.delete();
                }, 5000);
            });
            return false;
        }
        return true;
    }
}