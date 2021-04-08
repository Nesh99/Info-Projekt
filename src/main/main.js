require('dotenv').config();
const { Client } = require('discord.js');
const LevelSystem = require('../level-system/level-system')
const Music = require('../music/music')

// discord client
const client = new Client();

// client for the Level-System
const levelSystem = new LevelSystem();
const music = new Music();

// Emitted when the client becomes ready to start working
client.on('ready', () => {
    console.log(`${client.user.tag} has logged in!`);
});

// Handle messages
client.on('message', (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith(process.env.PREFIX)) {
        // command

        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(process.env.PREFIX.length)
            .split(/\s+/);

        switch (CMD_NAME) {
            case 'level':
                levelSystem.handleCommand(message, args);
                break;
            case 'play':
                music.execute(message, args);
                break;
            case 'stop':
                music.stop(message);
                break;
            case 'skip':
                music.skip(message);
                break;
            default:
                message.channel.send('Sorry but I\'m not human enough to understand this!');
                break;
        }

    } else {
        // normal message

        levelSystem.handleMessage(message);
    }

});

// login with token
client.login(process.env.BOT_TOKEN);
