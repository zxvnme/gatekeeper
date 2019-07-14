import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class GuildConfiguration {

    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    guildID: string;

    @Column()
    logsChannelID: string;

    @Column()
    profanityChecker: number;
}
