import {
  AnyMessageContent,
  delay,
  downloadMediaMessage,
} from "@adiwajshing/baileys";
import { Queue, Worker } from "bullmq";
import chalk from "chalk";
import { mkdirSync, statSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { nanoid } from "nanoid";
import { MessageWrapper } from "./classes/messageWrapper";
import { receivedMessage } from "./interfaces/receivedMessage";
import { sendedMessage } from "./interfaces/sendedMessage";
import { startSock } from "./socket";
import { sleep } from "./util/sleep";

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
      const data: sendedMessage = job.data;
      switch (data.type) {
        case "text":
          await socket.sendMessage(data.to, { text: data.message });
          console.log(chalk.green(`sent message: ${data.message}`));
          break;
        case "sticker":
          await socket.sendMessage(data.to, {
            sticker: await readFile(data.mediaPath),
          });
          console.log(chalk.green(`sent sticker: ${data.mediaPath}`));
          break;
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
          console.log("media downloaded");
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
          console.log("media downloaded");
        } catch (error) {
          console.log(chalk.red(`error downloading media: ${error}`));
        }
      }

      let messageTask: receivedMessage = {
        from: message.getChatSender(),
        command: message.getText()!.replace("!", "").split(" ")[0],
        args: message.getText()!.replace("!", "").split(" ").slice(1),
        hasMedia: media,
        mediaPath: filename || "",
      };

      receiveQueue.add(nanoid(), messageTask, {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      });
      console.log(
        chalk.green(`added job to queue: ${JSON.stringify(messageTask)}`)
      );
    }
  });

  console.log(chalk.green("Bot ready"));
};

startBot();
