import { commandSync } from "execa";
import { nanoid } from "nanoid";

const link = "https://www.instagram.com/p/CfpFqtlv_Xb/";

const filename = nanoid();
const res = commandSync(`you-get ${link} -c instagram-cookies.txt`);
const filenames = res.stdout
  .split("\n")
  .filter((val) => val.includes("Title"))
  .map((val) => val.split(":")[1])
  .map((val) => val.trim())
  .map((val) => val.replace("[", "("))
  .map((val) => val.replace("]", ")"));

console.log(filenames);

const extensions = res.stdout
  .split("\n")
  .filter((val) => val.includes("Type"))
  .map((val) => val.split(":")[1])
  .map((val) => val.trim())
  .map((val) => val.split(" ")[2])
  .map((val) => val.split("/")[1])
  .map((val) => val.replace(")", ""));
console.log(extensions);
