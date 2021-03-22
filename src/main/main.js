require('dotenv').config();
const { Client } = require('discord.js');

// discord client
const client = new Client();

// Emitted when the client becomes ready to start working
client.on('ready', () => {
    console.log(`${client.user.tag} has logged in!`);
});

// login with token
client.login(process.env.BOT_TOKEN);
