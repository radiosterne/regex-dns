export interface ISettings {
	forwarders: string[];
	maps: { regexp: string, ip: string }[];
	port: number;
}
