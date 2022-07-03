export interface receivedMessage {
  from: string;
  command: string;
  args: string[];
  hasMedia: boolean;
  mediaPath: string;
}