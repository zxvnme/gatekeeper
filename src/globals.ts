import * as MariaDB from "mariadb/callback"
import * as signale from "signale";

export class Globals {
    public static databaseConnection = MariaDB.Socket;
    public static loggerInstance: signale = new signale.constructor({scope: "Gatekeeper"});
}
