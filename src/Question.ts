import { DnsName } from "./DnsName";

export enum QuestionType {

}

export enum QuestionClass {
	Unused,
	A
}

export class Question {
	constructor(
		public readonly dnsName: DnsName,
		public readonly questionType: QuestionType,
		public readonly questionClass: QuestionClass,
	) {}

	static deserialize(buffer: Buffer, position: number) {
		const dnsName = DnsName.deserialize(buffer, position);
		const questionType = buffer.readUInt16BE(position + dnsName.name.length);
		const questionClass = buffer.readUInt16BE(position + dnsName.name.length + 2);

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
