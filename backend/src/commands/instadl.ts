//This commands uses you-get package to download videos from youtube.

import { command } from "execa";
import { receivedMessage } from "../interfaces/receivedMessage";
import chalk from "chalk";
import reply from "../util/reply";

export async function instadl(message: receivedMessage) {
  if (message.args.length === 0) {
    reply(message, "Error: Argumentos invalidos");
    return;
  }
  const url = message.args[0];
  if (!url.includes("instagram.com")) {
    reply(message, "Error: El link no es valido");
    return;
  }
  let res = null;
  try {
    res = await command(
      `you-get ${url} -o ../media/ -c ../cookies/instagram.txt`
    );
  } catch (error) {
    reply(message, "Error: El video/imagen no se pudo descargar");
    console.error(error);
    return;
  }
  let filenames = null;

  try {
    filenames = res.stdout
      .split("\n")
      .filter((val) => val.includes("Title"))
      .map((val) => val.split(":")[1])
      .map((val) => val.trim())
      // .map((val) => val.replace("[", "("))
      // .map((val) => val.replace("]", ")"));

    console.log(filenames);
  } catch (error) {
    reply(
      message,
      "Error: El video/imagen no se pudo descargar, error de nombre de archivo"
    );
    return;
  }
  let extensions = null;
  let alternativeExtensions = null;
  try {
    alternativeExtensions = res.stdout
      .split("\n")
      .filter((val) => val.includes("Type"))
      .map((val) => val!.split(":")[1])
      .map((val) => val!.trim())
      .map((val) => val!.split(" ")[2])
      .map((val) => val.replace(")", ""))
      .map((val) => val.replace("(", ""));
    console.log(alternativeExtensions);
  } catch (error) {
    console.error(error);
    reply(
      message,
      "Error: El video/imagen no se pudo descargar, error de extension alternativa"
    );
    return;
  }
  console.log();

  try {
    extensions = res.stdout
      .split("\n")
      .filter((val) => val.includes("Type"))
      .map((val) => val!.split(":")[1])
      .map((val) => val!.trim())
      .map((val) => val!.split(" ")[2])
      .map((val) => val!.split("/")[1])
      .map((val) => {
        return val === undefined ? null : val.replace(")", "");
      });
    console.log(extensions);
  } catch (error) {
    console.error(error);
    reply(
      message,
      "Error: El video/imagen no se pudo descargar, error de extension"
    );
    return;
  }

  if (filenames.length === 0) {
  reply(message, "Error: El video/imagen no se pudo descargar");
    return;
  }
  if (filenames.length !== extensions.length) {
    reply(message, "Error: Ocurrio un error extraño, reportalo por favor.");
    return;
  }
  for (let index = 0; index < filenames.length; index++) {
    const filename = filenames[index];
    let extension = extensions[index];
    if (extension === null) {
      extension = alternativeExtensions[index];
    }
    if (extension === "mp4") {
      await reply(message, "", "video", `../media/${filename}.mp4`);
    } else if (extension === "webm") {
      await reply(message, "", "video", `../media/${filename}.webm`);
    } else if (extension === "webp") {
      await reply(message, "", "image", `../media/${filename}.webp`);
    } else if (extension === "jpeg") {
      console.log(chalk.blue("Imagen descargada y enviada"));
      await reply(message, "", "image", `../media/${filename}.jpg`);
    } else {
      await reply(message, "Error: El video/imagen no se pudo descargar");
    }
  }
}
