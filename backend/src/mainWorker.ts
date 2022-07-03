import { Queue, Worker } from "bullmq"
import { receiveMessage } from "./interfaces/receiveMessage"

const sendQueue = new Queue("send-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  }
})

const worker = new Worker("receive-queue", async (job) => {
  const data = job.data as receiveMessage
  console.log(job.data)
}, {
  connection: {
    host: "localhost",
    port: 6379,
}})
