import { receivedMessage } from "../interfaces/receivedMessage";
import ytdl from "ytdl-core";
import reply from "../util/reply";
import { createWriteStream } from "node:fs";
import ff from "fluent-ffmpeg";
import { nanoid } from "nanoid";
export async function ytdlh(message: receivedMessage) {
  const filename = nanoid();
  if (message.args.length === 0) {
    reply(message, "No pusiste un link ni argumentos");
    return;
  }

  if (ytdl.validateURL(message.args[0])) {
    reply(message, "Link valido, descargando video...");
    const info = await ytdl.getInfo(message.args[0]);
      const format = ytdl.chooseFormat(
        info.formats.filter((f) => f.qualityLabel === "360p"),
        { quality: "highestvideo" }
      );
      await new Promise((resolve, reject) => {
        ytdl
          .downloadFromInfo(info, { format: format })
          .pipe(createWriteStream(`../media/${filename}.mp4`))
          .on("error", reject)
          .on("finish", resolve);
      });
      reply(message, "Video descargado, enviando...");
      reply(message, "", "video", `../media/${filename}.mp4`);
      console.log(`Sended video to ${message.from} file: ${filename}`);
      return;
  } else if (ytdl.validateURL(message.args[1])) {
    if (message.args[0] !== "audio" && message.args[0] !== "video") {
      reply(message, "Link valido, pero argumento invalido");
    }
    if (message.args[0] === "audio") {
      reply(message, "Link valido, descargando audio...");
      const info = await ytdl.getInfo(message.args[1]);
      const format = ytdl.chooseFormat(
        info.formats.filter((f) => f.qualityLabel === "360p"),
        { quality: "highestaudio" }
      );
      await new Promise((resolve, reject) => {
        ytdl
          .downloadFromInfo(info, { format: format })
          .pipe(createWriteStream(`../media/${filename}.mp4`))
          .on("error", reject)
          .on("finish", resolve);
      });
      await new Promise((resolve, reject) => {
        ff(`../media/${filename}.mp4`)
          .on("error", reject)
          .on("end", () => resolve(true))
          .addOutputOptions(["-b:a", "192K", "-vn"])
          .toFormat("mp3")
          .save(`../media/${filename}.mp3`);
      });

      reply(message, "Audio descargado, enviando...");
      reply(message, "", "audio", `../media/${filename}.mp3`);
      console.log(`Sended audio to ${message.from} file: ${filename}`);
      return;
    }
    if (message.args[0] === "video") {
      reply(message, "Link valido, descargando video...");
      const info = await ytdl.getInfo(message.args[1]);
      const format = ytdl.chooseFormat(
        info.formats.filter((f) => f.qualityLabel === "360p"),
        { quality: "highestvideo" }
      );
      await new Promise((resolve, reject) => {
        ytdl
          .downloadFromInfo(info, { format: format })
          .pipe(createWriteStream(`../media/${filename}.mp4`))
          .on("error", reject)
          .on("finish", resolve);
      });
      reply(message, "Video descargado, enviando...");
      reply(message, "", "video", `../media/${filename}.mp4`);
      console.log(`Sended video to ${message.from} file: ${filename}`);
      return;
    }
  }
}
