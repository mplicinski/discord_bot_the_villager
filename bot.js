const Discord = require("discord.js");
const botSettings = require("./botsettings.json");
const fs = require("fs");

const bot = new Discord.Client();
const token = botSettings.token;
const prefix = botSettings.prefix;

bot.login(token);
bot.commands = new Discord.Collection();
//bot.mutes = require("./mutes.json"); //will add this back in if I want to do timed mutes

//loading all bot commands in the cmds directory
fs.readdir("./cmds/", (err, files) => {
    if(err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0) {
        console.log("No commands to load");
    }

    console.log(`Loading ${jsfiles.length} commands`);
    jsfiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i + 1}: ${f} loaded`);
        bot.commands.set(props.help.name, props);
    });
});


bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    console.log(bot.commands);
})

//overly complicated but entertainig ping method
bot.on('message', message => {
    if (message.content.toLowerCase().startsWith('ping') ||
    message.content.toLowerCase().startsWith('pong')) {
        words = message.content.toLowerCase().split(' ');
        reply = "";
        words.forEach(word => {
            if(word.startsWith("ping")) {
                reply = reply.concat("Pong! ");
            } else if (word.startsWith("pong")) {
                reply = reply.concat("Ping! ");
            }
        })
        message.reply(reply); 
    }
});

//cute love reaction <3 
bot.on('message', message => {
    if (message.content.toLowerCase().includes('love')) {
        message.react('❤️');
    }
});

//command caller
bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type == 'dm') return;

    let msgArray = message.content.split(" ");
    let command = msgArray[0];
    let args = msgArray.slice(1);

    if(!command.startsWith(prefix)) return;

    let cmd = bot.commands.get(command.slice(prefix.length));
    if (cmd) cmd.run(bot ,message, args);
})










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

//game sesssion message trigger
bot.on('message', message => {
    if (message.content.toLowerCase().startsWith("!gamesession")) {

        gameName = '';
        maxPlayers = 0;
        date = Date();

        const channel = message.channel;
        channel.send("Creating Games Session");
        

        var promptText = `${gameName} Game Sesssion created. Add reaction to join!`;
        message.reply(promptText).then(botMessage => {
            gameSessions[botMessage.id] = new GameSession(botMessage, 4);
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
        gameSession.addPlayer(user);
    }
});



