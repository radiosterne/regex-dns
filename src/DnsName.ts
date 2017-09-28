export class DnsName {
	private constructor(public readonly name: string) {
	}

	static deserialize(buffer: Buffer, position: number) {
		let result = "";
		let currentPosition = position;
		
		let length = buffer[currentPosition];
		while (length !== 0) {
			currentPosition += 1;
			const slice = buffer.slice(currentPosition, currentPosition + length);
			result += slice.toString();
			currentPosition = currentPosition + length;
			length = buffer[currentPosition];

			if (length !== 0) {
				result += ".";
			}
		}

		return new DnsName(result);
	}

	serialize() {
		const buffer = new Buffer(this.name.length + 2);

		const elements = this.name.split(".");

		let position = 0;
		for (const elem of elements) {
			buffer[position] = elem.length;
			position += 1;
			buffer.write(elem, position, elem.length);
			position += elem.length;
		}

		buffer[position] = 0;

		return buffer;
	}
}
