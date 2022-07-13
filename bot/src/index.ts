import chalk from "chalk";
import { mkdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { MessageWrapper } from "./classes/messageWrapper";
import { receivedMessage } from "./interfaces/receivedMessage";
import { sendedMessage } from "./interfaces/sendedMessage";
import { startSock } from "./socket";
import Queue from "bee-queue";
import { nanoid } from "nanoid";
try {
  mkdirSync("../media/");
} catch (error) {
  console.log(chalk.yellow(`error creating media directory: ${error}`));
}
const startBot = async () => {
  // create bullmq queue
  let sendQueue: Queue<any> | undefined = undefined;
  const socket = await startSock();
  const receiveQueue = new Queue("receive-queue");
  const createWorker = () => {
    console.log(chalk.green("worker created"));
    sendQueue?.process(4,
      async (
        job: Queue.Job<sendedMessage>,
        done: Queue.DoneCallback<string>
      ) => {
        console.log(`processing job ${job.id} with data`, job.data, `to ${job.data.to}`);
        const data = job.data;
        switch (data.type) {
          case "text":
            try {
              await socket.sendMessage(data.to, { text: data.message });
              done(null, "message sent");
              console.log(chalk.green("message sent: " + data.message));
            } catch (error) {
              if (error instanceof Error) {
                done(error);
              }
            }
            console.log(chalk.green(`sent message: ${data.message}`));
            break;
          case "sticker":
            try {
              await socket.sendMessage(data.to, {
                sticker: await readFile(data.mediaPath),
              });
              done(null, `sticker sent: ${data.mediaPath}`);
              console.log(chalk.green(`sent sticker: ${data.mediaPath}`));
            } catch (error) {
              if (error instanceof Error) {
                done(error);
              }
            }
            break;
          case "audio":
            try {
              await socket.sendMessage(data.to, {
                audio: await readFile(data.mediaPath), mimetype: "audio/mp4"
              });
              done(null, `audio sent: ${data.mediaPath}`);
              console.log(chalk.green(`sent audio: ${data.mediaPath}`));
            } catch (error) {
              if (error instanceof Error) {
                done(error);
              }
            }

            break;
          case "video":
            try {
              await socket.sendMessage(data.to, {
                video: await readFile(data.mediaPath),
              });
              done(null, `video sent: ${data.mediaPath}`);
              console.log(chalk.green(`sent video: ${data.mediaPath}`));
            } catch (error) {
              if (error instanceof Error) {
                done(error);
              }
            }
            break;
          case "image":
            try {
              await socket.sendMessage(data.to, {
                image: await readFile(data.mediaPath),
              });
              done(null, `image sent: ${data.mediaPath}`);
              console.log(chalk.green(`sent image: ${data.mediaPath}`));
            } catch (error) {
              if (error instanceof Error) {
                done(error);
              }
            }
            break;
          default:
            console.log(chalk.red(`unknown message type: ${data.type}`));
            break;
        }
      }
    );
  };

  socket.ev.on("connection.update", async (update) => {
    if (update.connection === "close") {
      console.log(chalk.red("Connection closed. Stopping worker"));
      try {
        await sendQueue?.close(5000);
        console.log(chalk.green("Worker closed"));
        console.log(chalk.red("Closing Process"));
        process.exit(0);
      } catch (error) {
        console.log(chalk.red(`error closing send queue: ${error}`));
        console.log(chalk.red("Closing Process"));
        process.exit(0);
      }
    }
    if (update.connection === "open") {
      if (sendQueue?.isRunning() === false || sendQueue === undefined) {
        console.log(chalk.green("Connection opened. Starting worker"));
        sendQueue = new Queue("send-queue");
        createWorker();
      } else if (sendQueue.isRunning()) {
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

      const job = await receiveQueue
        .createJob(messageTask)
        .retries(3)
        .timeout(10000)
        .save();

      console.log(
        chalk.green(`added job to queue: ${JSON.stringify(messageTask)}`)
      );

      job.on("succeeded", (result: string) => {
        console.log(chalk.green("Job succeeded: "), result);
      });

      job.on("failed", (error: any) => {
        console.log(chalk.red("Job failed: "), error);
      });
    }
  });

  console.log(chalk.green("Bot ready"));
};

startBot();
