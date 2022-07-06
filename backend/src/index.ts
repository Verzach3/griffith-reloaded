import Queue from "bee-queue";
import chalk from "chalk";
import { receivedMessage } from "./interfaces/receivedMessage";
import { messageProcessor } from "./messageProcessor";
const sendQueue = new Queue("send-queue");
const receiveQueue = new Queue("receive-queue");
globalThis.globalSendQueue = sendQueue;

const worker = receiveQueue.process(
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
