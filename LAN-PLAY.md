# Play Unsubscribe 2087 with someone in the house

One computer runs the game. Everyone else just opens a link. You do not need a website, a password from us, or to pay for a server.

## The first time

1. Unzip this folder somewhere you can find it. The Desktop is fine.
2. Double-click the launcher for your computer:
   - Windows: `Play-Unsubscribe-2087.bat`
   - Mac: `Play-Unsubscribe-2087.command`
   - Linux: `Play-Unsubscribe-2087.sh`
3. If it says Node.js is missing, install it, then double-click the launcher again.
   - Windows and Mac: open <https://nodejs.org>, download the version marked LTS, and run the installer. Leave the options as they are. On Windows, that includes "Add to PATH".
   - Linux: install Node.js 18 or newer from your software store, or from <https://nodejs.org>. On Ubuntu, `sudo apt install nodejs` is often too old. If the launcher says the version is too old, use the installer from that site.
4. A window stays open. That window is the game. Leave it open while anyone is playing. Closing it stops the game for everybody.
5. On this computer, open a browser to the "On this computer" link, usually `http://localhost:8087`.
6. On the other person's computer or phone, open the link that looks like `http://192.168.x.x:8087`. They must be on the same Wi-Fi or cable. Mobile data will not work.

Each person makes their own account: a name and a password. An email is optional. You do not need an invite code.

One person opens the menu, chooses Party, and taps **Make the game**. The other opens Party and taps **Join** on that game.

## If the computer asks about a firewall

This happens the first time, right as the window opens. The game is asking to be reachable by the other computers in the house. It is not asking to be on the public internet.

- **Windows.** A window titled "Windows Security Alert" or "Windows Defender Firewall" appears. Tick **Private networks**. Leave **Public networks** unticked. Click **Allow access**.
- **Mac.** A window asks if it should allow incoming connections for `node`. Click **Allow**. If you later find a Firewall switch in System Settings → Network → Firewall, leave it on, and keep Node allowed.
- **Linux.** If you turned on a firewall yourself (`ufw`, firewalld), allow port 8087 on the local network. A normal home install has nothing extra to click.

If the other person cannot open the link: you are on different Wi-Fi networks, a guest network, or the firewall was blocked. Same Wi-Fi, private network allowed, window still open.

## If a Mac says the launcher cannot be opened

macOS does this with files downloaded from the internet. Right-click `Play-Unsubscribe-2087.command`, choose **Open**, then **Open** again. You only do this once.

## What this does not do

- **Voice.** Browsers will not turn the microphone on for an address like `http://192.168.x.x`. Typing in the chat still works. So does playing together.
- **The internet.** Someone who is not on your Wi-Fi cannot make an account, even if they guess the address.
- **Sending bug reports onward.** If the game breaks, the report stays in the `saves` folder on the computer that is running the launcher. Nothing is sent to GitHub unless you set that up yourself, which this package does not do.

## Stopping and starting again

Close the launcher window, or press Ctrl+C in it. Next time, double-click the launcher again. Accounts and characters are in the `saves` folder next to the launcher. Do not delete that folder if you want to keep them.

To play on a different port, set `PORT` before starting. The printed links use whatever port the game actually got.
