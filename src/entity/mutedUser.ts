import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class MutedUser {

    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    guildName: string;

    @Column()
    guildID: string;

    @Column()
    userID: string;

    @Column()
    muteRoleID: string;

    @Column()
    dateFrom: string;

    @Column()
    dateTo: string;
}
