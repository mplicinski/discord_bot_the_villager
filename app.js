const Discord = require("discord.js");
const client = new Discord.Client();
const token = require("./token.js");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

client.on('message', msg => {
    if (msg.content.toLowerCase() == 'ping') {
        msg.reply("Pong!")
    }
});

client.on('message', msg => {
    if (msg.content.toLowerCase().includes('love')) {
        msg.react('❤️')
    }
});

client.login(token);