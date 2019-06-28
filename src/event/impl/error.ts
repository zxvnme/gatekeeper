import {IEvent} from "../event";
import {Globals} from "../../globals";

export default class ErrorEvent implements IEvent {
    constructor() {
        this.name = "error"
    }

    name: string;

    override(client, error): void {
        Globals.loggerInstance.fatal(error);
    }
}