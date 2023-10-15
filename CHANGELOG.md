# Phase Bot - 2.0.0

A log of all additions, changes, and bug fixes coming in Phase Bot update 2.0.0.
 
### New Additions

The new utils, commands, and modules that were added in this update.\
*Note: Some additions may not be covered due to them being very minor.*

#### Utils
- Added `alertDevs()` utility function.
- Added `clientError()` utility function.
- Added `clientSlashCommand()` utility function.
- Added `clientButtonEvent()` utility function.
- Added `clientModalEvent()` utility function.
- Added `clientEvent()` utility function.
- Added `getRandomArrayElements()` utility function.
- Added `formatNumber()` utility function.
- Added `formatDate()` utility function.
- Added more utility `enums`.
- Added more utility `types`.
- Added more utility `constants`.

#### Commands
- Added `/whois` info command.
- Added `/nuke` moderator command.
- Added `/purge` moderator command.
- Added `/giveaway reroll` module command.
- Added `/level set` module command.
- Added `/partner add` module command.
- Added `/partner advert` module command.
- Added `/partner channel` module command.
- Added `/partner invite` module command.
- Added `/partner list` module command.
- Added `/partner remove` module command.
- Added `/tag add` module command.
- Added `/tag edit` module command.
- Added `/tag get` module command.
- Added `/tag list` module command.
- Added `/tag remove` module command.
- Added `/echo` utility command.
- Added `/embed` utility command.
- Added `/coffee` miscellaneous command.

#### Modules
- Added `Auto Partner` module.
- Added `Tags` module.
 
### New Changes

Changes to existing features in this update.\
*Note: Some changes may not be covered due to them being very minor.*

#### Commands
- Changed the data displayed in the `/ping` info command embed.
- Changed look of the `/cat` fun command embed reply.
- Changed look of the `/dog` fun command embed reply.
- Changed look of the `/duck` fun command embed reply.
- Changed look of the `/rps` fun command reply.
- Changed look of the `/tictactoe` fun command embed & buttons reply.
- Changed look of the `/avatar` info command embed reply.
- Changed look of the `/github` info command embed reply.
- Changed look of the `/membercount` info command embed reply.
- Changed look of the `/youtube` info command embed reply.
- Changed look of the `/announce` moderator command embed reply.
- Changed look of the `/lockdown` moderator command embed reply.
- Changed look of the `/poll` utility command embed reply.
- Changed look of the `/help` miscellaneous command embed reply.
- Changed the `/leaderboard` module command to use the new image generator system.
- Changed the `/rank` module command to use the new image generator system.
- Changed the options of the `/poll` utility command.

#### Modules
- Changed name of `Action Logs` module to `Audit Logs`.
- Changed `Audit Logs` module to use event groups over directing all events to 1 channel.
- Changed `Audit Logs` module to allow toggling of event groups.
- Merged `Invite Tracker` module into `Audit Logs` module (has own event group).
- Changed look of the `Leave Logs` module embeds.
- Changed look of the `Giveaways` module embeds.

#### Handlers
- Changed the `Command Handler` to make it faster.
- Changed the `Event Handler` to make it faster and better handle interactions.
- Changed the `Database Handler` to give it better error handling.
 
### New Bug Fixes

Bugs and issues that were patched in this update.

- `Join to Create` no longer deletes last channel when switching from alternate server.
- `Audit Logs` now work properly across all servers.

### Removals

Modules or commands that were removed in this update.

#### Temporary

- Removed the `/trivia` command. Will return in future update.
- Removed the `/connect-4` command. Will return in future update.