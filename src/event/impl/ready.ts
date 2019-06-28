import {IEvent} from "../event";
import {Globals} from "../../globals";

export default class ReadyEvent implements IEvent {
    constructor() {
        this.name = "ready"
    }

    name: string;

    async override(client): Promise<void> {
        await Globals.loggerInstance.success(`I am ready! ${client.user.tag}`);
    }
}