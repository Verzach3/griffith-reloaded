import {
  AnyMessageContent,
  delay,
  downloadMediaMessage,
} from "@adiwajshing/baileys";
import { Queue, Worker } from "bullmq";
import chalk from "chalk";
import { mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { nanoid } from "nanoid";
import { MessageWrapper } from "./classes/messageWrapper";
import { receivedMessage } from "./interfaces/receivedMessage";
import { startSock } from "./socket";

try {
  mkdirSync("../media/");
} catch (error) {
  console.log(chalk.yellow(`error creating media directory: ${error}`));
}
const startBot = async () => {
  // create bullmq queue
  const receiveQueue = new Queue("receive-queue", {
    connection: {
      host: "localhost",
      port: 6379,
    },
  });
  const socket = await startSock();

  const sendWorker = new Worker(
    "send-queue",
    async (job) => {
      console.log(chalk.green(`sending message: ${job.data}`));
      if (job.data.type === "text") {
        try {
          await socket.sendMessage(job.data.to, { text: job.data.body });
        } catch (error) {
          console.log(chalk.red(`error sending message: ${error}`));
        }
      }
    },
    {
      connection: {
        host: "localhost",
        port: 6379,
      },
      autorun: false,
    }
  );

  socket.ev.on("connection.update", (update) => {
    if (update.connection === "close") {
      console.log(chalk.red("Connection closed. Stopping worker"));
      sendWorker.pause();
    }
    if (update.connection === "open") {
      if (sendWorker.isRunning() === false) {
        console.log(chalk.green("Connection opened. Starting worker"));
        sendWorker.run();
      } else if (sendWorker.isPaused() === true) {
        console.log(chalk.green("Connection opened. Resuming worker"));
        sendWorker.resume();
      } else if (sendWorker.isRunning()) {
        console.log(chalk.yellow("Connection opened. Worker already running"));
      }
    }
  });

  socket.ev.on("messages.upsert", async (m) => {
    if (m.type !== "notify") return;
    if (!m.messages[0].message) return;
    const message = new MessageWrapper(m.messages[0]);
    console.log(chalk.blue(`received message: ${message.getText()}`));
    console.log(chalk.blue(`has media: ${message.hasMedia()}`));
    console.log(
      chalk.blue(`has media mentioned: ${message.hasMentionedMedia()}`)
    );
    if (message.getText()?.startsWith("!")) {
      let filename = undefined;
      let media = false;
      if (message.hasMedia()) {
        media = true;
        filename = `${nanoid()}.${message.getMediaExtension()}`;
        try {
          console.log(chalk.blue(`downloading media...`));
          const buffer = await message.downloadMedia();
          await writeFile(`../media/${filename}`, buffer);
        } catch (error) {
          console.log(chalk.red(`error downloading media: ${error}`));
        }
      }
      if (message.hasMentionedMedia()) {
        media = true;
        filename = `${nanoid()}.${message.getMediaExtension()}`;
        try {
          console.log(chalk.blue(`downloading media...`));
          const buffer = await message.downloadMentionedMedia();
          await writeFile(`../media/${filename}`, buffer!);
        } catch (error) {
          console.log(chalk.red(`error downloading media: ${error}`));
        }
      }

      let messageTask : receivedMessage = {
        from: message.getChatSender(),
        command: message.getText()!.replace("!", "").split(" ")[0],
        args: message.getText()!.replace("!", "").split(" ").slice(1),
        hasMedia: media,
        mediaPath: filename || "",
      }

      receiveQueue.add(nanoid(),messageTask);

    }
  });

  console.log(chalk.green("Bot ready"));
};

startBot();
