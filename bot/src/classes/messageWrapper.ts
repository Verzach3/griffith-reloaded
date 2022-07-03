import {
  downloadContentFromMessage,
  downloadMediaMessage,
  proto,
} from "@adiwajshing/baileys";
import { Transform } from "node:stream";
export class MessageWrapper {
  message: proto.IWebMessageInfo;
  constructor(message: proto.IWebMessageInfo) {
    this.message = message;
  }

  hasMedia(): boolean | string | undefined {
    let hasMedia = false;
    if (this.message.message?.imageMessage) {
      hasMedia = true;
    }
    if (this.message.message?.videoMessage) {
      hasMedia = true;
    }
    return hasMedia;
  }

  getMediaType(): "video" | "image" | undefined {
    if (this.message.message?.imageMessage) {
      return "image";
    }
    if (this.message.message?.videoMessage) {
      return "video";
    }
    return undefined;
  }

  getMediaMessage(): proto.IImageMessage | proto.IVideoMessage | undefined {
    if (this.message.message?.imageMessage) {
      return this.message.message.imageMessage;
    }
    if (this.message.message?.videoMessage) {
      return this.message.message.videoMessage;
    }
    return undefined;
  }

  hasMentionedMedia(): boolean {
    let hasMedia = false;
    if (
      this.message.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.imageMessage
    ) {
      hasMedia = true;
    }
    if (
      this.message.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.videoMessage
    ) {
      hasMedia = true;
    }
    return hasMedia;
  }

  getMentionedMediaType(): "video" | "image" | undefined {
    let type: "video" | "image" | undefined = undefined;
    if (
      this.message.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.imageMessage
    ) {
      type = "image";
    }
    if (
      this.message.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.videoMessage
    ) {
      type = "video";
    }
    return type;
  }

  getMentionedMediaMessage():
    | proto.IImageMessage
    | proto.IVideoMessage
    | undefined {
    if (
      this.message.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.imageMessage
    ) {
      return this.message.message.extendedTextMessage.contextInfo.quotedMessage
        ?.imageMessage;
    }
    if (
      this.message.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.videoMessage
    ) {
      return this.message.message.extendedTextMessage.contextInfo.quotedMessage
        ?.videoMessage;
    }
  }

  getMediaExtension(): "jpeg" | "mp4" | undefined {
    if(this.hasMedia()){
      if (this.getMediaType() === "image") {
        return "jpeg"
      } else {
        return "mp4"
      }
    }
    if (this.hasMentionedMedia()){
      if (this.getMentionedMediaType() === "image") {
        return "jpeg"
      } else {
        return "mp4"
      }
    }
    return undefined;
  }

  getText(): string | undefined {
    if (this.hasMedia()) {
      console.log("returned caption");
      return this.getMediaMessage()?.caption!;
    }
    if (this.message.message?.extendedTextMessage?.text) {
      return this.message.message.extendedTextMessage.text;
    }
    if (this.message.message?.conversation!) {
      return this.message.message.conversation!;
    }
  }
  downloadMedia(): Promise<Buffer | Transform> {
    return downloadMediaMessage(this.message, "buffer", {});
  }

  downloadMentionedMedia(): Promise<Buffer | Transform> | undefined {
    return downloadContentFromMessage(
      this.getMentionedMediaMessage()! as any,
      this.getMentionedMediaType()!
    );
  }

  getChatSender(): string {
    return this.message.key.remoteJid!;
  }

  getSender(): string | undefined {
    if (this.getChatSender().includes("@g.us")) {
      return this.message.key.participant!;
    } else {
      return this.message.key.remoteJid!;
    }
  }

  isGroup(): boolean {
    return this.message.key.remoteJid!.includes("@g.us");
  }
}
