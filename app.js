import "dotenv/config";
import express from "express";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { VerifyDiscordRequest } from "./utils.js";
import { getRankingResults } from "./clashofclans.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  const townhall = [
    [
      "#QJY9LQ2YP",
      "#QP89V0YR0",
      "#Q9LVPUR8Q",
      "#YVYG09U8J",
      "#Y902RPC29",
      "#2LV8VGCLC",
      "#YGVJJJLUG",
      "#YY2C28Q0R",
      "#LCQLU0UV9",
      "#LL88G2LYL",
      "#L9JLG8LGJ",
      "#2C9R22RLV",
      "#QC8QV20RV",
      "#LR8G92YYG",
    ],
    [
      "#Y8P80VR2P",
      "#YPLYJ2YYJ",
      "#LGRPC9CYG",
      "#LJC0GQJ88",
      "#LJCG0RY8L",
      "#YJVGVYQPP",
      "#PP00GVG88",
      "#90GP8LRG8",
      "#9GLC9Q89C",
      "#YCRJG8GUJ",
      "#LQ9PY8L0C",
      "#LJC0GQJ88",
      "#LVG98G8G",
      "#98UJ8PC29",
      "#9VVGQ8Q9U",
      "#2UJPRLRJV",
      "#L08VR809G",
      "#9JUP2QQYP",
      "#9UJLGJRVV",
    ],
    [
      "#9L282QCUU",
      "#Q8P0220RL",
      "#QJJ80J20L",
      "#9UVQ0R0RP",
      "#88CGRQY92",
      "#L8VJP2P02",
      "#LCLGPGGPY",
      "#QJ909YUY",
      "#8C9UGJ9L8",
      "#2PPRPU2RY",
      "#9JLUGQC8J",
      "#QVGRR0JCP",
      "#2VYULORJG",
      "#VRP90UGG",
      "#PYPP8C2QG",
    ],
    [
      "#20GURC08Q",
      "#9822QVR9U",
      "#LLG0JJVPJ",
      "#2YUQ2JG0J",
      "#PVC8C0RUU",
      "#P8LV0RLYU",
      "#LUQYJRLQP",
      "#LC8UCUVLV",
      "#8Q0CVQP2R",
      "#P92UQJLCY",
      "#Q8J9JGPJR",
      "#9VLCGYC2Q",
    ],
    [
      "#P0GCL0LC8",
      "#P89PQV8J0",
      "#2YG8YRP8C",
      "#9298CYR92",
      "#2J808PPGY",
      "#YJP2LJUCR",
      "#LU28Y80LU",
      "#98GVC98Y2",
      "#PVRVGLU98",
      "#YPP2CU8YY",
      "#PQ202QYRL",
      "#QCGGRQ009",
      "#QPUG2V8G",
      "#2QQ2QR2G0",
      "#P0GCL0LC8",
      "#YR898VJL2",
      "#UV9L2U2G",
      "#PC2GUUV29",
      "#LC2R0Y2YV",
      "#CR2QJCJ2",
    ],
  ];

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // COC command
    if (name === "ranking") {
      let th = Number(data.options[0].value);
      let player_tags = townhall[th - 11];
      if (data.options[1] != null)
        data.options[1].value.split(" ").map((tag) => player_tags.push(tag));
      try {
        const result = await getRankingResults(player_tags);
        // console.log(result)
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `# Player Rankings TH${th}\n\n${result}`,
          },
        });
        // return res.send({
        //   type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        //   data: {
        //     embeds: [
        //       {
        //         title: `Player Rankings (TH${th})`,
        //         color: 3447003,
        //         description: result,
        //       },
        //     ],
        //   },
        // });
      } catch (error) {
        console.error("Error:", error);
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [
              {
                description: "Something went wrong, please try again later!",
                color: 255160122,
              },
            ],
          },
        });
      }
    }

    if (name === "test") {
      return res.send({
        type: 4,
        data: {
          embeds: [
            {
              title: "Hello, Embed!",
              type: "rich",
              color: 3447003,
              description: "blash!",
            },
          ],
        },
      });
    }
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
