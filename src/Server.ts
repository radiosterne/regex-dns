import * as dgram from "dgram";

import { ISettings } from "./ISettings";
import { Forwarder } from "./Forwarder";
import { Query } from "./Query";

export class Server {
	constructor(private readonly options: ISettings) {
		this.maps = this.options.maps
			.map((map) => {
				return {
					regexp: new RegExp("^" + map.regexp + "$", "g"),
					ip: Server.ipToInt(map.ip)
				};
			});
	}

	listen(): void {
		this.socket = dgram.createSocket("udp4");
		const forwarder = new Forwarder(this.options.forwarders, this.socket);

		const socket = this.socket;

		this.socket.on("message", (msg, rinfo) => {
			const query = Query.tryDeserialize(msg);

			if (query !== undefined) {
				const host = query.getHost();
				const map = this.maps.find(map => host.match(map.regexp) !== null);
				if (map !== undefined) {
					const answer = query.getAnswerBuffer(map.ip);
					socket.send(answer, rinfo.port, rinfo.address);
					return;
				}
			}

			forwarder.forward(msg, rinfo);
		});

		this.socket.bind(this.options.port);
	}

	private static ipToInt(ip: string) {
		const octets = ip
			.split(".")
			.map(oct => parseInt(oct, 10));

		return (octets[0] * 256 * 256 * 256)
			+ (octets[1] * 256 * 256)
			+ (octets[2] * 256)
			+ octets[3];
	}

	private readonly maps: { regexp: RegExp, ip: number }[];

	private socket?: dgram.Socket;
}
