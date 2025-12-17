const mineflayer = require('mineflayer')

const config = {
  host: 'rexrtx.falixsrv.me',
  port: 25565,
  username: 'AFK_Bot', // change if name is taken
  auth: 'offline',    // CRACKED / OFFLINE MODE
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
    console.log('✅ Connected to rexrtx.falixsrv.me')

    // ===== Anti-AFK Movement =====
    setInterval(() => {
      const moves = ['forward', 'back', 'left', 'right']
      const move = moves[Math.floor(Math.random() * moves.length)]

      bot.setControlState(move, true)
      setTimeout(() => bot.setControlState(move, false), 1000)

      // Look around
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
        'Still here',
        'Online 🙂',
        'AFK bot running'
      ]
      bot.chat(messages[Math.floor(Math.random() * messages.length)])
    }, 120000)
  })

  // ===== Auto Reconnect =====
  bot.on('end', () => {
    console.log('❌ Disconnected, reconnecting...')
    setTimeout(createBot, config.reconnectDelay)
  })

  bot.on('kicked', reason => console.log('⚠️ Kicked:', reason))
  bot.on('error', err => console.log('⚠️ Error:', err))
}

createBot()
