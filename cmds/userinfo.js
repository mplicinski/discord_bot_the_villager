const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {

  let embed = new Discord.MessageEmbed()
      .setAuthor(message.author.username)
      .setDescription(`${message.author.username} is a super cool person!`)
      .setColor("#9B59B6")
      .addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
      .addField("ID", message.author.id)
      .addField("Created At", message.author.createdAt);

  message.channel.send(embed);

  return;
}

// export to help command list
module.exports.help = {
  name: "userinfo"
}