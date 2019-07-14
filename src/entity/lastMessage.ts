import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class LastMessage {

    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    guildName: string;

    @Column()
    guildID: string;

    @Column()
    channelID: string;

    @Column()
    messageContent: string;

    @Column()
    authorID: string;
}
