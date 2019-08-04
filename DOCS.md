## Gatekeeper command documentation

There are list of all Gatekeeper command.  

#### lock
Locks channel where invoked or channel which ID was provided.
* *optional:* `[lockedChannelID]` (Snowflake)
  * example: **g!lock 583766323121750018**

#### unlock
Unlocks chanel where invoked or channel which ID was provided.
* *optional:* `[unlockedChannelID]` (Snowflake)
  * example: **g!unlock 583766323121750018**
  
#### kick
Kicks member from guild.
* `[memberToKick]` (Mention) **|** `[reason]` (string)
  * example: **g!kick @zxvnme#2598 example reason**
  
#### ban
Bans member from guild.
* `[memberToBan` (Mention) **|** `[daysToDelete]` (number) **|** `[reason]` (string)
  * example: **g!ban @zxvnme#2598 7 example reason**
  
#### clear
Bulk deletes X messages from channel where invoked.
* `[messagesToDelete]` (number)
  * example: **g!clear 10**
  
#### filter
Toggles bad words filter on guild where invoked.
* `[filterState]` (number) [NOTE: acceptable number is between 0 and 1]
  * example: **g!filter 1**
  
#### slowmode
Toggles slowmode for channel where invoked.
* `[slowmodeValue]` (number) [NOTE: value = seconds]
  * example: **g!slowmode 60**
  
#### logs
Toggles chat logger on channel which ID was provided.
* `[logsChannelID]` (string)
  * example: **g!logs 583766323121750018**
  * example: **g!logs none**
  
#### pardon
Unbans member from guild.
* `[bannedUserTag]` (string)
  * example: **g!pardon zxvnme#2598**
  
#### mute
Mutes guild member.
* `[memberToMute]` (Mention) **|** *optional:* `[time]` (number) [NOTE: time = minutes]
  * example: **g!mute @zxvnme#2598 30** // will mute zxvnme for 30 mins
  * example: **g!mute @zxvnme#2598** // will mute zxvnme forever

#### unmute
Removes mute from guild member.
* `[memberToUnmute]` (Mention)
  * example: **g!unmute  @zxvnme#2598**

#### userinfo
Gets info about user.
* *optional:* `[user]` (Mention)
  * example: **g!userinfo  @zxvnme#2598**
  * example: **g!userinfo** // will get info about user who invoked command
  
#### ping
Returns message with average ping of the websocket.

#### recover
Recovers up to 20 messages from channel where invoked no matter if they are deleted or not.