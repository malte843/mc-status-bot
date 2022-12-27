const {token, appId} = require("config.json");
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");

const commands = [];
//Grab all files from commands directory that end with .js
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

//Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

//Construct an prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token);

//and deploy the commands
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    //The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(appId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error("error");
    console.error(error);
  }
})();
