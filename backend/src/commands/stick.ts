import ff from "fluent-ffmpeg";
import { statSync } from "node:fs";
import sharp from "sharp";
import { receivedMessage } from "../interfaces/receivedMessage";
import reply from "../util/reply";
export async function stick(message: receivedMessage) {
  if (message.hasMedia === false) {
    reply(message, "No se envio/menciono ninguna foto/video");
    return;
  }

  let isAnimated = false;
  console.log(statSync("../media/" + message.mediaPath!));
  if (message.mediaPath?.endsWith(".mp4")) {
    await new Promise((resolve, reject) => {
      ff("../media/" + message.mediaPath)
        .on("error", reject)
        .on("end", () => resolve(true))
        .addOutputOptions([
          `-vcodec`,
          `libwebp`,
          `-vf`,
          `scale=512:512:force_original_aspect_ratio=increase,fps=15,crop=512:512`,
        ])
        .toFormat("webp")
        .save("../media/" + message.mediaPath!.replace(".mp4", ".webp"));
      isAnimated = true;
    });
  }
  await sharp(
    isAnimated
      ? "../media/" + message.mediaPath?.replace(".mp4", ".webp")
      : "../media/" + message.mediaPath,
    {
      animated: true,
    }
  )
    .resize({ width: 512, height: 512 })
    .webp({ quality: !isAnimated ? 100 : 80 })
    .toFile("../media/" + message.mediaPath?.split(".")[0] + "-final-.webp");
  if (
    statSync("../media/" + message.mediaPath?.split(".")[0] + "-final-.webp")
      .size > 1000000
  ) {
    reply(
      message,
      "Stiker demasiado grande, intenta con una imagen/video mas pequeña o corto"
    );
    return;
  }
  reply(
    message,
    "Sticker generado",
    "sticker",
    "../media/" + message.mediaPath?.split(".")[0] + "-final-.webp"
  );
}
