export enum OpCode {
	Query,
	IQuery,
	Status,
	NotUsed,
	Notify,
	Update
}

export enum ResponseCode {
	NoError,
	FormatError,
	ServerFailure,
	NameError,
	NotImplemented,
	Refused,
	YXDomain,
	YXRRSet,
	NXRRSet,
	NotAuth,
	NotZone
}

export class Header {
	private constructor(
		readonly id: number,
		readonly isResponse: boolean,
		readonly opCode: OpCode,
		readonly answerIsAuthoritative: boolean,
		readonly messageTruncated: boolean,
		readonly recursionDesired: boolean,
		readonly recursionAvailable: boolean,
		readonly responseCode: ResponseCode,
		readonly questionCount: number,
		readonly answerCount: number,
		readonly nameServerCount: number,
		readonly additionalRecordCount: number) { }

	getAnswerHeader() {
		return new Header(
			this.id,
			true,
			this.opCode,
			false,
			false,
			this.recursionDesired,
			false,
			ResponseCode.NoError,
			1,
			1,
			0,
			0
		);
	}

	static deserialize(buffer: Buffer) {
		const id = buffer.readUInt16BE(0);
		const flagsAndCodes = buffer.readUInt16BE(2);
		const isResponse = !!(flagsAndCodes & 0b1000000000000000);
		const opCode: OpCode = ((flagsAndCodes & 0b011110000000000) >> 11);
		const answerIsAuthoritative = !!(flagsAndCodes & 0b0000010000000000);
		const messageTruncated = !!(flagsAndCodes & 0b0000001000000000);
		const recursionDesired = !!(flagsAndCodes & 0b0000000100000000);
		const recursionAvailable = !!(flagsAndCodes & 0b0000000010000000);
		const responseCode: ResponseCode = (flagsAndCodes & 0b0000000000001111);
		const questionCount = buffer.readUInt16BE(4);
		const answerCount = buffer.readUInt16BE(6);
		const nameServerCount = buffer.readUInt16BE(8);
		const additionalRecordCount = buffer.readUInt16BE(10);

		return new Header(
			id,
			isResponse,
			opCode,
			answerIsAuthoritative,
			messageTruncated,
			recursionDesired,
			recursionAvailable,
			responseCode,
			questionCount,
			answerCount,
			nameServerCount,
			additionalRecordCount
		);
	}

	serialize() {
		const buffer = new Buffer(Header.serializedSize);
		buffer.writeUInt16BE(this.id, 0);
		let flagsAndCodes = 0;
		flagsAndCodes = flagsAndCodes | (+this.isResponse) << 15;
		flagsAndCodes = flagsAndCodes | this.opCode << 11;
		flagsAndCodes = flagsAndCodes | (+this.answerIsAuthoritative) << 10;
		flagsAndCodes = flagsAndCodes | (+this.messageTruncated) << 9;
		flagsAndCodes = flagsAndCodes | (+this.recursionDesired) << 8;
		flagsAndCodes = flagsAndCodes | (+this.recursionAvailable) << 7;
		flagsAndCodes = flagsAndCodes | this.responseCode;
		buffer.writeUInt16BE(flagsAndCodes, 2);
		buffer.writeUInt16BE(this.questionCount, 4);
		buffer.writeUInt16BE(this.answerCount, 6);
		buffer.writeUInt16BE(this.nameServerCount, 8);
		buffer.writeUInt16BE(this.additionalRecordCount, 10);
		return buffer;
	}

	static readonly serializedSize = 12;
}
