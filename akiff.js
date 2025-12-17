const mineflayer = require('mineflayer')
const express = require('express')

// ===== HTTP SERVER (PING) =====
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('AFK Bot is running ✅')
})

app.listen(PORT, () => {
  console.log(`🌐 HTTP server running on port ${PORT}`)
})

// ===== MINECRAFT BOT CONFIG =====
const config = {
  host: 'rexrtx.falixsrv.me',
  port: 38741,
  username: 'AFK_Bot',
  auth: 'offline',
  reconnectDelay: 5000
}

let bot

function createBot () {
  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    auth: config.auth,
    version: false
  })

  bot.once('spawn', () => {
    console.log('✅ Bot connected')

    // ===== Anti-AFK Movement =====
    setInterval(() => {
      const moves = ['forward', 'back', 'left', 'right']
      const move = moves[Math.floor(Math.random() * moves.length)]

      bot.setControlState(move, true)
      setTimeout(() => bot.setControlState(move, false), 1000)

      bot.look(
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * Math.PI / 2,
        true
      )
    }, 20000)

    // ===== Auto Chat =====
    setInterval(() => {
      const messages = [
        'AFK',
        'Still online',
        'Bot running',
        'Auto AFK'
      ]
      bot.chat(messages[Math.floor(Math.random() * messages.length)])
    }, 120000)
  })

  // ===== AUTO RECONNECT =====
  bot.on('end', () => {
    console.log('❌ Disconnected, reconnecting...')
    setTimeout(createBot, config.reconnectDelay)
  })

  bot.on('kicked', r => console.log('⚠️ Kicked:', r))
  bot.on('error', e => console.log('⚠️ Error:', e))
}

createBot()
