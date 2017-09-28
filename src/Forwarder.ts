import { AddressInfo, createSocket, Socket } from "dgram";

export class Forwarder {
	constructor(
		private readonly forwardTo: string[],
		private readonly returnSocket: Socket) {
		this.socket = createSocket("udp4");
		this.socket.bind(49153);
		this.socket.on("message", this.onMessage.bind(this));
		this.queue = {};
		this.counter = 0;
	}

	forward(msg: Buffer, rinfo: AddressInfo) {
		this.counter += 1;
		if (this.counter === Number.MAX_SAFE_INTEGER) {
			this.counter = 0;
		}

		const id = msg.readUInt16LE(0);
		this.queue[this.counter] = { id, addressInfo: rinfo };
		msg.writeUInt16LE(this.counter, 0);
		this.socket.send(msg, 53, this.forwardTo[Math.floor(Math.random() * this.forwardTo.length)]);
	}

	onMessage(msg: Buffer, rinfo: AddressInfo) {
		const id = msg.readUInt16LE(0);
		const returnInfo = this.queue[id];
		if (returnInfo !== undefined) {
			this.queue[id] = undefined;
			msg.writeUInt16LE(returnInfo.id, 0);
			this.returnSocket.send(msg, returnInfo.addressInfo.port, returnInfo.addressInfo.address);
		}
	}

	private readonly socket: Socket;

	private queue: { [key: number]: { id: number, addressInfo: AddressInfo } | undefined };

	private counter: number;

	private port: number;

}
