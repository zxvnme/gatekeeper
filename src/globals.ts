import * as MariaDB from "mariadb/callback"
import * as signale from "signale";
import * as Filter from "bad-words";

export class Globals {
    public static databaseConnection = MariaDB.Socket;
    public static filterInstance = new Filter();
    public static loggerInstance: signale = new signale.constructor({scope: "Gatekeeper"});
}