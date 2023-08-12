import "dotenv/config";
import { InstallGlobalCommands } from "./utils.js";

const RANKING_COMMAND = {
  name: "ranking",
  description: "Player rankings according to trophies",
  type: 1,
  options: [
    {
      type: 3,
      name: "th",
      description: "Select the TH you want to get rankings of",
      required: true,
      choice: ["Th11", "Th12", "Th13", "Th14", "Th15"],
    },
    {
      type: 3,
      name: "tag",
      description: "Player tag(s) space seperated",
      required: false,
    },
  ],
};

const ALL_COMMANDS = [RANKING_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
