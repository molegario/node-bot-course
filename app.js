// bot code goes HERE
import Discord from 'discord.js';
import dotenv from 'dotenv';
import OpenAI from 'openai';

let openai = null;
dotenv.config();

const Client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.Guilds,
  ],
  partials: [
    Discord.Partials.Message,
    Discord.Partials.Channel,
    Discord.Partials.User,
    Discord.Partials.GuildScheduledEvent,
  ]
});

Client.on('ready', (client) => {
  console.log(`Logged in as ${client.user.tag}`);
  openai = new OpenAI();
});

Client.on('messageCreate', async (message) => {

  console.log("INC message::", message.content);

  if(!message.author.bot && message.content.startsWith('!Hail')) {

    if (!!openai) {

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: 'system', 
            content: `
            You are the character, Austin Powers from the movie of the same name.  
            You are in a conversation with a new attractive member of the group.  
            You are trying to be charming and welcoming and will respond accordingly as Austin Powers.
            You are designed to output in JSON format.
            `
          },
          {
            role: 'user', 
            content: `
            Generate a response on the following message delimited by triple hyphens:
            ---
            ${message.content.replace('^!', '')}
            ---
            Your response should be lengthy and flourished as Austin Powers would say it BUT
            should be with in the character limits of a tweet on Twitter.
            `
          },
        ],
        response_format: { type: "json_object" },
      });

      const postcontent = response.choices[0]?.message?.content;

      if (!!postcontent) {
        message.reply((JSON.parse(postcontent))?.response);
      } else {
        message.reply("Hail, There fellow guildie! Welcome to the discord server!");
      }

    } else {
      message.reply("Hail, There fellow guildie! Welcome to the discord server!");
    }
  }
})
Client.login(process.env.DISCORD_BOT_TOKEN);
