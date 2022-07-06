import {commandSync} from "execa";
import { nanoid } from "nanoid";

const link = "https://vm.tiktok.com/ZMNDUFXRy/?k=1"

const filename = nanoid()
const res = commandSync(`you-get ${link} -O ${filename}`)

console.log(res.stdout.split("\n").filter((val) => val.includes("Title")).map((val) => val.split(":")[1]))