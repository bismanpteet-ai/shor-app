# /shor Control Room — real-time app

Sab data real hai: koi random/fake generator nahi. Bot live Discord se padhta hai.

- **Members / online / roles / channels** — live Discord se
- **Voice channels** — abhi kaun kis VC me hai, real
- **Growth chart** — bot ke live hone se har ghante ek real snapshot save hota hai (isliye pehle 2 ghante khali dikhega, phir line banegi)
- **Top channels** — jab se bot chala hai tab se real message count
- **Moderation queue** — real messages jo filter ne flag kiye (invite links, spam links, flagged words, excessive caps)
- **Announce** — jo bhejoge woh sach me Discord channel me post hoga
- **Invite** — real Discord invite link generate hota hai

## Deploy on Railway (free, sabse simple)

1. https://railway.app pe GitHub se login kar.
2. Is poore `shor-app` folder ko ek GitHub repo me push kar (ya Railway "Deploy from local" option use kar).
3. Railway pe "New Project" → apna repo select kar.
4. Variables tab me yeh 3 add kar (`PORT` mat daal, Railway khud set karta hai):
   - `DISCORD_TOKEN` — apna bot token
   - `GUILD_ID` — apne Discord server ki ID (Discord Settings → Advanced → Developer Mode ON, phir server icon pe right-click → Copy Server ID)
   - `DASHBOARD_PASSCODE` — jo passcode dashboard khole (e.g. `iopas@505`)
5. Deploy hone do. Railway ek public URL dega (jaise `shor-app.up.railway.app`) — wahi tera app hai. Wahi URL khologe to passcode gate dikhega.

## Local test karne ke liye

```
npm install
cp .env.example .env
# .env me apna token aur guild id daal
npm start
```
Phir browser me `http://localhost:3000` khol.

## Zaroori: bot permissions

Bot me yeh 3 intents Discord Developer Portal me ON hone chahiye (Bot tab):
- Presence Intent
- Server Members Intent
- Message Content Intent

Aur server me add karte waqt kam se kam: View Channels, Read Message History, Manage Messages, Connect.
