export interface receiveMessage {
  from: string;
  command: string;
  args: string[];
  hasMedia: boolean;
  mediaPath: string;
}