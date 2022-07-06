import { command } from "execa";
import { stat } from "fs/promises";
import { nanoid } from "nanoid";
import { receivedMessage } from "../interfaces/receivedMessage";
import chalk from "chalk";
import reply from "../util/reply";

export async function ttkdl(message: receivedMessage){
  if (message.args.length === 0) {
    reply(message, "Error: Argumentos invalidos");
  }
  const url = message.args[0];
  if (!url.includes("tiktok.com")){
    reply(message, "Error: El link no es valido");
  }
  const filename = nanoid();
  const res = await command(`you-get ${url} -O ../media/${filename}`);
  if ((await stat(`../media/${filename}.mp4`)).isFile()) {
  reply(message, "", "video", `../media/${filename}.mp4`);}
  else {
    reply(message, "Error: El video no se pudo descargar");
  }
  console.log(chalk.blue("Tiktok descargado y enviado"))
}