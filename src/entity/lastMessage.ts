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

    @Column({charset: `utf8mb4`})
    messageContent: string;

    @Column()
    authorID: string;
}
