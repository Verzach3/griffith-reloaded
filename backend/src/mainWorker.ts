import { Queue, Worker } from "bullmq"
import { receivedMessage } from "./interfaces/receivedMessage"
import { messageProcessor } from "./messageProcessor";

const sendQueue = new Queue("send-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  }
})

globalThis.globalSendQueue = sendQueue;

const worker = new Worker("receive-queue", async (job) => {
  console.log("Received job", job.data);
  const data = job.data as receivedMessage
  messageProcessor(data)

}, {
  connection: {
    host: "localhost",
    port: 6379,
}, concurrency: 4})

console.log("Worker started")
