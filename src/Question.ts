import { DnsName } from "./DnsName";

export enum QuestionType {
	Unused,
	A
}

export enum QuestionClass {
}

export class Question {
	constructor(
		public readonly dnsName: DnsName,
		public readonly questionType: QuestionType,
		public readonly questionClass: QuestionClass,
	) {}

	static deserialize(buffer: Buffer, position: number) {
		const dnsName = DnsName.deserialize(buffer, position);
		const currentPosition = position + dnsName.serializedLength + 1;
		const questionType = buffer.readUInt16BE(currentPosition);
		const questionClass = buffer.readUInt16BE(currentPosition + 2);

		return new Question(dnsName, questionType, questionClass);
	}

	serialize() {
		const nameSerialized = this.dnsName.serialize();
		
		const buffer = new Buffer(nameSerialized.length + 4);
		nameSerialized.copy(buffer, 0, 0, nameSerialized.length);
		buffer.writeUInt16BE(this.questionType, nameSerialized.length);
		buffer.writeUInt16BE(this.questionClass, nameSerialized.length + 2);

		return buffer;
	}
}
