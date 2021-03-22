require('dotenv').config();
const prefix = process.env.PREFIX;

const { Client } = require('discord.js');
const client = new Client();

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in!`);
});

client.login(process.env.BOT_TOKEN);
