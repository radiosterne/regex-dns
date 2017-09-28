import { ISettings } from "./ISettings";
import { Server } from "./Server";
const settings: ISettings = require("../Settings.json");

const server = new Server(settings);
server.listen();
