import {Queue} from "bullmq";
declare global {
  var globalSendQueue: Queue<any, any, string>;
}

export {};