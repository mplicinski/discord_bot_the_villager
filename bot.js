const Discord = require("discord.js");
const botSettings = require("./botsettings.json")

const bot = new Discord.Client();
const token = botSettings.token
const prefix = botSettings.prefix

bot.login(token);

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

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
})

//ping method
bot.on('message', msg => {
    if (msg.content.toLowerCase().startsWith('ping')) {
        msg.reply("Pong!")
    }
});

//pong method
bot.on('message', msg => {
    if (msg.content.toLowerCase().startsWith('pong')) {
        msg.reply("Ping!")
    }
});

//cute love reaction <3 
bot.on('message', msg => {
    if (msg.content.toLowerCase().includes('love')) {
        msg.react('❤️')
    }
});

bot.on("message", async msg => {
    if(msg.author.bot) return;
    if(msg.channel.type == 'dm') return;

    let msgArray = msg.content.split(" ");
    let cmd = msgArray[0];
    let args = msgArray.slice(1);

    if(!cmd.startsWith(prefix)) return;
    if (cmd === `${prefix}userinfo`) {
        let embed = new Discord.MessageEmbed()
            .setAuthor(msg.author.username)
            .setDescription(`${msg.author.username} is a super cool person!`)
            .setColor("#9B59B6")
            .addField("Full Username", `${msg.author.username}#${msg.author.discriminator}`)
            .addField("ID", msg.author.id)
            .addField("Created At", msg.author.createdAt);

        msg.channel.send(embed);

        return
    }
})



//game sesssion message trigger
bot.on('message', msg => {
    if (msg.content.toLowerCase().startsWith("!gamesession")) {

        gameName = '';
        maxPlayers = 0;
        date = Date()

        const channel = msg.channel
        channel.send("Creating Games Session")
        

        var promptText = `${gameName} Game Sesssion created. Add reaction to join!`
        msg.reply(promptText).then(botMsg => {
            gameSessions[botMsg.id] = new GameSession(botMsg, 4);
        })
    }
});

bot.on('messageReactionAdd', async (reaction, user) => {
    
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



