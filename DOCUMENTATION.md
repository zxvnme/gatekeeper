## Gatekeeper command documentation

There are list of all Gatekeeper command.  
`?` in arguments means that this argument is optional.

|  Command |                            Arguments                           |
|:--------:|:--------------------------------------------------------------:|
| lock     |                                  [lockedChannelID?: snowflake] |
| unlock   |                                [unlockedChannelID?: snowflake] |
| kick     |                       [memberToKick: mention] [reason: string] |
| ban      | [memberToBan: mention] [daysToDelete: number] [reason: string] |
| clear    |                                     [messagesToDelete: number] |
| filter   |                                     [filterState: number(0-1)] |
| slowmode |                                        [slowmodeValue: number] |
| logs     |                        [logsChannelId: snowflake/string(none)] |
| pardon   |                                        [bannedUserTag: string] |
| mute     |               [memberToMute: mention] [time?: number(minutes)] |
| unmute   |                                      [memberToUnmute: mention] |
| ping     |                                                           none |