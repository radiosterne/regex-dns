import { Answer } from "./Answer";
import { Header } from "./Header";
import { Question, QuestionType } from "./Question";

export class Query {
	private constructor(
		private readonly header: Header,
		private readonly question: Question
	) {}

	getAnswerBuffer(ip: number) {
		const answer = new Answer(this.header, this.question, ip);
		return answer.serialize();
	}

	getHost() {
		return this.question.dnsName.name;
	}

	static tryDeserialize(msg: Buffer) {
		const header = Header.deserialize(msg);
		if (!header.isResponse && header.questionCount === 1) {
			const question = Question.deserialize(msg, Header.serializedSize);
			if (question.questionType === QuestionType.A) {
				return new Query(header, question);
			}
		}

		return undefined;
	}
}
