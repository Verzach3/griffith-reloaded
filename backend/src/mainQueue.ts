import { Queue } from "bullmq"


const myQueue = new Queue("send-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  }
});

async function addjobs() {
  await myQueue.add("my job", { hola: "mundo 2 22"});
}

// await addjobs();