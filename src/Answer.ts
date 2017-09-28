import { Question, QuestionClass } from "./Question";
import { Header } from "./Header";

export class Answer {
	constructor(
		private readonly header: Header,
		private readonly question: Question,
		private readonly ip: number
	) {}

	serialize() {
		const answerHeader = this.header.getAnswerHeader();
		const namePointer =
			0b1100000000000000 | Header.serializedSize; // Указатель на начало имени хоста
		const type = 1; // Тип возвращаемой записи — А
		const answerClass = 1; // Класс возвращаемой записи — IN
		const ttl = 60 * 60; // TTL — 1 час
		const dataLength = 4; // IP-адрес — 4 байта

		const answerHeaderSerialized = answerHeader.serialize();
		const questionSerialized = this.question.serialize();

		// 16 — длина ответа
		const buffer = new Buffer(answerHeaderSerialized.length + questionSerialized.length + 16);
		answerHeaderSerialized.copy(buffer, 0, 0, answerHeaderSerialized.length);
		questionSerialized.copy(buffer, answerHeaderSerialized.length, 0, questionSerialized.length);

		let buffersEndPosition = answerHeaderSerialized.length + questionSerialized.length;
		buffer.writeUInt16BE(namePointer, buffersEndPosition);
		buffersEndPosition += 2;

		buffer.writeUInt16BE(type, buffersEndPosition);
		buffersEndPosition += 2;

		buffer.writeUInt16BE(answerClass, buffersEndPosition);
		buffersEndPosition += 2;

		buffer.writeUInt32BE(ttl, buffersEndPosition);
		buffersEndPosition += 4;

		buffer.writeUInt16BE(dataLength, buffersEndPosition);
		buffersEndPosition += 2;

		buffer.writeUInt32BE(this.ip, buffersEndPosition);

		return buffer;
	}
}
