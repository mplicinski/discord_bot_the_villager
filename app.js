const Discord = require("discord.js");
const client = new Discord.Client();
const token = require("./token.js");

client.login(token);

var gameSessions = {};
class GameSession {
    constructor(message, maxPlayers) {
        this.message = message;
        this.maxPlayers = maxPlayers;
        this.players = [];
    }

    addPlayer(user) {
        this.players.push(user.id);
        this.annoucePlayerCount(user);
    }

    annoucePlayerCount(user) {
        this.message.channel.send(`${user.username} joined the session!`);
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

//ping method
client.on('message', msg => {
    if (msg.content.toLowerCase() == 'ping') {
        msg.reply("Pong!")
    }
});

//cute love reaction <3 
client.on('message', msg => {
    if (msg.content.toLowerCase().includes('love')) {
        msg.react('❤️')
    }
});

//game sesssion message trigger
client.on('message', msg => {
    if (msg.content.toLowerCase().startsWith("!gamesession")) {
        var promptText = `Game Sesssion created. Add reaction to join!`
        msg.reply(promptText).then(botMsg => {
            gameSessions[botMsg.id] = new GameSession(botMsg, 4);
        })
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    
    //safeguard to make sure we get a stable user reaction
    if (reaction.partial) {
        //wait for stable notification
        try {
            await reaction.fetch();
        } catch (error) {
            console.log('Something when wrong when fetching the reaction', error);
            return;
        }
    }

    var gameSession = gameSessions[reaction.message.id];
    if (gameSession) {
        gameSession.addPlayer(user)
    }
});



