# Friends, letters, and whispers

Read against `server/lib/social.js`, `whisper()` in `server/lib/live.js`, and the Party sheet in `src/p13.js`. Caps were left alone.

## What already matched

A person you have accepted can see class, level, and the game name, and Join walks into that game, including one that has fallen off the newest-sixty lobby, by their account. A pending ask does not show the game. Block answers a whisper with “Nobody by that name.” and does not tell the other side. Unblock is remove, and it clears only your row. Take it back withdraws the ask.

Not taking messages answers “They are not taking messages.” whether they are on or off, and the letter is not stored. An online whisper toasts “whispers.”, lands in the sheet’s last thirty lines, stays out of game chat, and is not a letter. An offline whisper toasts “They are not on. Left in their box.” The box returns `read`, and Mark read clears the new mark. The compose box stops at 240 characters, the same cap as the store.

Mute drops their voice and what they type in the game. It does not drop a whisper.

## What the sheet printed

The friends line said the list holds twenty-five. The store stops friends and asks at twenty-five, and a block still fits on a full list, so the sheet can show more than twenty-five names. The line now says friends and asks stop there, and people you block sit past that.

Letters had a heading and an empty state, and no sentence about what the box is. The store keeps forty letters for thirty days, and only a whisper sent while they are off. A whisper while they are on is said on this page and then forgotten. The box now says that.

The game roster said muting silences their messages. In this sheet, “Not taking messages” is the quiet flag, which does refuse a whisper. Mute is the other control, and a whisper still arrives. The roster line now says voice and what they type in this game.

`CLAUDE.md` and `MULTIPLAYER.md` still said there was no friends list and that the whole social model lived in memory. Friends and the letter box are files in `server/lib/social.js` and survive a restart. Presence and open games do not.
