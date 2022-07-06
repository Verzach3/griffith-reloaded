import Queue from "bee-queue";
import chalk from "chalk";
import { receivedMessage } from "./interfaces/receivedMessage";
import { messageProcessor } from "./messageProcessor";

console.log("starting backend");
const sendQueue = new Queue("send-queue");
console.log(chalk.green("send-queue started"));
const receiveQueue = new Queue("receive-queue");
console.log(chalk.green("receive-queue started"));
globalThis.globalSendQueue = sendQueue;

const worker = receiveQueue.process(10,
  async (job: Queue.Job<receivedMessage>, done: Queue.DoneCallback<string>) => {


    console.log(chalk.blue("Received job"), job.data);
    try {
      await messageProcessor(job.data);
      done(null, `done: ${job.data.command} from: ${job.data.from}`);
    } catch (error) {
      if (error instanceof Error) {
        console.log(chalk.red(error.message));
        done(error);
      }
    }
  }
);
console.log(chalk.green("receive-queue worker started"));