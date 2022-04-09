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


function deleteMessages(amount) {
	return new Promise(resolve => {
		if (amount > 10) throw new Error('You can\'t delete more than 10 Messages at a time.');
		setTimeout(() => resolve('Deleted 10 messages.'), 2000);
	});
}

deleteMessages(5).then(value => {
	// `deleteMessages` is complete and has not encountered any errors
	// the resolved value will be the string "Deleted 10 messages"
}).catch(error => {
	// `deleteMessages` encountered an error
	// the error will be an Error Object
});