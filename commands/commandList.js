const { mc_rcon_host, mc_rcon_port, mc_rcon_pass } = require("../config.json");
const Rcon = require("rcon");

var conn = new Rcon(mc_rcon_host, mc_rcon_port, mc_rcon_pass);

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Replies with a list of all players on the server"),
  async execute(interaction) {
    conn
      .on("auth", async function () {
        console.log("Authenticated");
        console.log("Sending command: list");
        conn.send("list");
      })
      .on("response", async function (str) {
        conn.disconnect();
        console.log("Response: " + str);
        let rconReply = str.split(":");
        let playerCount = rconReply[0];
        playerCount = playerCount.replace("There are ", "");
        playerCount = playerCount.replace(" players online", "");
        
        let players = rconReply[1];
        players = players.split(",");
        let playerStr = "";
        for (p in players) {
            playerStr = playerStr + "\n" + players[p];
        }

        const replyEmbed = new EmbedBuilder()
            .setColor(0x00AA00)
            .setTitle("Minecraft Server Info")
            .setDescription("IP: " + mc_rcon_host)
            .addFields(
                {name : "Status", value: "Online :green_circle:"},
                {name: "Playercount", value: playerCount},
                {name: "Players", value: playerStr}
            )
            .setTimestamp()
            .setFooter({text: "Info from"});

        reply = await interaction.reply({embeds: [replyEmbed]});
        process.on("uncaughtException", function () {
            //console.error(err);
            //console.log("Node NOT Exiting...");
          });
      })
      .on("error", async function (err) {
        conn.disconnect();
        console.log("Error: " + err);
        const replyEmbed = new EmbedBuilder()
            .setColor(0x00AA00)
            .setTitle("Minecraft Server Info")
            .setDescription("IP: " + mc_rcon_host)
            .addFields(
                {name : "Status", value: "Offline :red_circle:"}
            )
            .setTimestamp()
            .setFooter({text: "Info from"});

        reply = await interaction.reply({embeds: [replyEmbed]});
        process.on("uncaughtException", function () {
          //console.error(err);
          //console.log("Node NOT Exiting...");
        });
      });

    conn.connect();
  },
};
/*
      
      */