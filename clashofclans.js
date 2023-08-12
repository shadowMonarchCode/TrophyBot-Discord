import "dotenv/config";

import { Client, QueueThrottler } from "clashofclans.js";
const client = new Client({
  keys: [process.env.CLASH_API_TOKEN],
  cache: true,
  retryLimit: 3,
  restRequestTimeout: 5000,
  throttler: new QueueThrottler(1000 / 10),
});

export async function getPlayerInfo(tag) {
  const player = await client.getPlayer(tag);
  return {
    name: player.name,
    trophies: player.trophies,
  };
}

export async function getRankingResults(playerTags) {
  const playerInfoPromises = playerTags.map((tag) => getPlayerInfo(tag));
  const playerInfoArray = await Promise.all(playerInfoPromises);
  const sortedPlayers = playerInfoArray.sort((a, b) => b.trophies - a.trophies);

  const maxLength = sortedPlayers.reduce(
    (max, player) => Math.max(max, player.name.length),
    0
  );

  let resultString = "```";
  resultString += "Rank".padEnd(6, " ");
  resultString += "Trophies".padEnd(10, " ");
  resultString += "Player Name".padEnd(16, " ");
  resultString += "\n---------------------------------\n";
  sortedPlayers.forEach((player, index) => {
    const rank = `${index + 1}.`.padEnd(6, " ");
    const trophies = `${player.trophies}`.padEnd(10, " ");
    const playerName = player.name.padEnd(16, " ");
    resultString += `${rank}${trophies}${playerName}\n`;
  });
  resultString += "```";

  return resultString;
}
