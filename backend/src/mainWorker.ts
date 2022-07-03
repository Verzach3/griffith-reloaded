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
  const data = job.data as receivedMessage
  console.log(job.data)
  messageProcessor(data)

}, {
  connection: {
    host: "localhost",
    port: 6379,
}})

console.log("Worker started")
