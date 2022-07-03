export interface sendedMessage {
  to: string;
  message: string;
  type: "text" | "image" | "video" | "audio" | "sticker";
  hasMedia: boolean;
  mediaPath: string;
}