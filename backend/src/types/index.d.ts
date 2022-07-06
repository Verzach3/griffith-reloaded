import BeeQueue from "bee-queue";
declare global {
  var globalSendQueue: BeeQueue<any>;
}

export {};