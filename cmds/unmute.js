const fs = module.require("fs");

module.exports.run = async(bot, message, args) => {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You do have permission to manage messages.");

  let toMute = message.mentions.members.first();
  if(!toMute) {
    return message.reply("You did not specify a user to unmute.");
  }

  if(toMute.id === message.author.id) {
    return message.reply("You cannot unmute yourself.");
  }

  if(!toMute.roles.highest.comparePositionTo(message.member.roles.highest)) {
    return message.reply("You cannot a user who is a higher or the same role as you.");
  }

  let role = message.guild.roles.cache.find(r => r.name === "Village Outcast");

  if (!role || !toMute.roles.cache.has(role.id)) {
    return message.reply(`${toMute.displayName} is not muted.`);
  }

  await toMute.roles.remove(role)
  message.reply(`${toMute.displayName} has been unmuted.`);
}

module.exports.help = {
  name: "unmute"
}