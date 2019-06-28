import {IEvent} from "../event";
import {Globals} from "../../globals";
import {Announcements} from "../../utils/announcements";

export default class MessageEvent implements IEvent {
    constructor() {
        this.name = "message"
    }

    name: string;

    override(client, message): void {
        if (message.author.bot) return;

        Globals.databaseConnection.query("SELECT * from guildconfiguration", (error, response, meta) => {
            for (const guildConfiguration of response) {
                if ((message.guild.id == guildConfiguration.guildid) && guildConfiguration.filter == 1) {
                    if (Globals.filterInstance.isProfane(message.content)) {
                        message.delete();
                        Announcements.warning(message, `${message.author.username}, you've used one of the bad words! Keep your language nice...`, undefined, true)
                    }
                }
            }
        });

        if (!message.content.startsWith(Globals.config.defaultPrefix)) return;

        let args = message.content.substring(Globals.config.defaultPrefix.length).split(" ");

        for (let command of Globals.commands) {
            if (command.syntax == args[0]) {
                command.action(Globals.clientInstance, message, args);
            }
        }
    }
}