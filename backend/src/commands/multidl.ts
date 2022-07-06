//This commands uses you-get package to download videos from youtube.

import { command } from "execa";
import { receivedMessage } from "../interfaces/receivedMessage";
import chalk from "chalk";
import reply from "../util/reply";
import { statSync } from "fs";

export async function multidl(message: receivedMessage) {
  let url = message.args[0];
  if (message.args.length === 0) {
    reply(message, "Error: Argumentos invalidos");
    return;
  }
  if (message.args.length > 1) {
    url = message.args.join(" ")
  }

  let res = null;
  try {
    res = await command(
      `you-get ${url} -o ../media/ `
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
      .map((val) => val.replace("[", "("))
      .map((val) => val.replace("]", ")"));

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
    try {
      if (statSync(`../media/${filename}.${extension}`).size > 200000000){
        reply(message, `Error: El video/imagen ${filename} no se pudo enviar, el archivo es muy grande`);
        return;
      };
    } catch (error) {
      console.error(error);
      reply(message, `Error: El video/imagen ${filename} no se pudo enviar, el archivo no existe, por favor reportalo`);
      return;
    }
    if (extension === "mp4") {
      await reply(message, "", "video", `../media/${filename}.mp4`);
    } else if (extension === "webm") {
      await reply(message, "", "video", `../media/${filename}.webm`);
    } else if (extension === "webp") {
      await reply(message, "", "image", `../media/${filename}.webp`);
    } else if (extension === "jpeg") {
      await reply(message, "", "image", `../media/${filename}.jpg`);
    } else if (extension === "mp3") {
      await reply(message, "", "audio", `../media/${filename}.mp3`);
    } else {
      await reply(message, `Error: El video/imagen no se pudo descargar, formato ${extension} desconocido`);
    }
  }
}
