module.exports.run = async(bot, message, args) => {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You do have permission to manage messages.");

  let toMute = message.mentions.members.first();
  if(!toMute) {
    return message.reply("You did not specify a user to mute.");
  }

  if(toMute.id === message.author.id) {
    return message.reply("You cannot mute yourself.");
  }

  isHigherRole = toMute.roles.highest.comparePositionTo(message.member.roles.highest)
  //if(toMute.roles.highest.comparePositionTo(message.member.roles.highest))
  
  if (isHigherRole >= 0){
    return message.reply("You cannot mute a user who is a higher or the same role as you.");
  }

  let role = message.guild.roles.cache.find(r => r.name === "Village Outcast");
  if (!role) {
    try { 
      role = message.guild.roles.create({ 
      data: { 
        name: 'Village Outcast', 
        color: "BLACK", 
        permissions: [] 
      }
     })
      //.then(console.log);

      //this part of the code is broken and I don't know how to fix it
      //It will create the role BUT will not go through each channel and add the role to deny send messages and reactions
      //You have to manually add the role to each channel catagory and deny the role permission to send messages/ reactions
      //maybe I'll fix it if other people want to use the bot but that probably won't happen anwyway
      message.guild.channels.cache.each(async (channel, id) => {
        await channel.overwritePermissions(role, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    } catch (e) {
      console.log(e.stack);
    }
  }

  if(toMute.roles.cache.has(role.id)) {
    return message.reply(`${toMute.displayName} is already muted`);
  }


  await toMute.roles.add(role) 
  return message.reply(`${toMute.displayName} has been muted.`);
}

module.exports.help = {
  name: "mute"
}