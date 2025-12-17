const mineflayer = require('mineflayer')
const express = require('express')

/* =====================
   HTTP SERVER (RENDER)
===================== */
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('AFK Bot is running ✅')
})

app.listen(PORT, () => {
  console.log(`🌐 HTTP server running on port ${PORT}`)
})

/* =====================
   MINECRAFT CONFIG
===================== */
const config = {
  host: 'trexrtl.falixsrv.me',
  port: 59574,
  username: 'AFK_Bot',
  auth: 'offline',
  version: '1.21.8', // REQUIRED for Falix (fixes protocol errors)
  reconnectDelay: 5000
}

let bot
let afkInterval
let chatInterval

function startBot () {
  console.log('⏳ Starting bot...')

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    auth: config.auth,
    version: config.version
  })

  bot.once('spawn', () => {
    console.log('✅ Bot spawned successfully')

    /* ===== Anti-AFK Movement ===== */
    afkInterval = setInterval(() => {
      const directions = ['forward', 'back', 'left', 'right']
      const dir = directions[Math.floor(Math.random() * directions.length)]

      bot.setControlState(dir, true)
      setTimeout(() => bot.setControlState(dir, false), 800)

      bot.look(
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * Math.PI / 2,
        true
      )
    }, 20000)

    /* ===== Auto Chat ===== */
    chatInterval = setInterval(() => {
      const messages = [
        'AFK',
        'Still online',
        'AFK bot running',
        'Grinding...'
      ]
      bot.chat(messages[Math.floor(Math.random() * messages.length)])
    }, 120000)
  })

  /* ===== Auto Reconnect ===== */
  bot.on('end', () => {
    console.log('❌ Disconnected, reconnecting...')
    clearInterval(afkInterval)
    clearInterval(chatInterval)
    setTimeout(startBot, config.reconnectDelay)
  })

  bot.on('kicked', reason => {
    console.log('⚠️ Kicked:', reason)
  })

  bot.on('error', err => {
    console.log('⚠️ Error:', err)
  })
}

startBot()
