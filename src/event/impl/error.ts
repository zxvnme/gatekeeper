import {IEvent} from "../event";
import {Globals} from "../../globals";

export default class ErrorEvent implements IEvent {
    constructor() {
        this.name = "error"
    }

    name: string;

    async override(client, error): Promise<void> {
        Globals.loggerInstance.fatal(error);
    }
}