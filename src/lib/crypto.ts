import { crypto } from "@std/crypto"

export const version = "0.0.5";

interface keyinfo{
	salt: Uint8Array,
	key: CryptoKey
}

export class Crypto{
	static generateBytes(len: number): Uint8Array<ArrayBuffer> {
		return crypto.getRandomValues(new Uint8Array(len));
	}
	static generateIV(len = 12): Uint8Array<ArrayBuffer> {
		return Crypto.generateBytes(len);
	}

	static encode(text: string): Uint8Array<ArrayBuffer> {
		return new TextEncoder().encode(text);
	}

	static decode(encval: Uint8Array): string {
		return new TextDecoder().decode(encval);
	}

	static async sha1(val: Uint8Array<ArrayBuffer>): Promise<ArrayBuffer> {
		return await crypto.subtle.digest("SHA-1", val);
	}

	static async sha256(val: Uint8Array<ArrayBuffer>): Promise<ArrayBuffer> {
		return await crypto.subtle.digest("SHA-256", val);
	}

	static async createKey(rawkey: Uint8Array<ArrayBuffer> | ArrayBuffer): Promise<CryptoKey> {
		return await crypto.subtle.importKey("raw", rawkey,
			"AES-GCM", false, ["encrypt", "decrypt"]);
	}

	static async createKey2(passphrase: string, salt?: Uint8Array<ArrayBuffer>, count = 10000): Promise<keyinfo> {
		const digest = new TextEncoder().encode(passphrase);
		const key = await crypto.subtle.importKey(
			"raw", digest, {name: "PBKDF2"}, false, ["deriveKey"]);
		if(!salt){
			salt = crypto.getRandomValues(new Uint8Array(16));
		}
		const res = await crypto.subtle.deriveKey(
			{name: "PBKDF2", salt: salt, iterations: count, hash: "SHA-256"},
			key, {name: "AES-GCM", length: 256}, false, ["encrypt", "decrypt"]);
		return {salt: salt, key: res};
	}

	static async encrypt(key: CryptoKey, iv: Uint8Array<ArrayBuffer>, val: Uint8Array<ArrayBuffer>): Promise<ArrayBuffer> {
		return await crypto.subtle.encrypt({name: "AES-GCM", iv: iv}, key, val);
	}

	static async encryptText(key: CryptoKey, iv: Uint8Array<ArrayBuffer>, text: string): Promise<ArrayBuffer> {
		const enc = Crypto.encode(text);
		return await Crypto.encrypt(key, iv, enc);
	}

	static async decrypt(key: CryptoKey, iv: Uint8Array<ArrayBuffer>, encval: ArrayBuffer): Promise<ArrayBuffer> {
		return await crypto.subtle.decrypt({name: "AES-GCM", iv: iv}, key, encval);
	}

	static async decryptText(key: CryptoKey, iv: Uint8Array<ArrayBuffer>, encval: ArrayBuffer): Promise<string> {
		const val = await Crypto.decrypt(key, iv, encval);
		const x = new Uint8Array(val);
		return Crypto.decode(x);
	}

	static async sign(secret: string|Uint8Array<ArrayBuffer>, message: string|Uint8Array<ArrayBuffer>): Promise<ArrayBuffer>{
		let secret_enc;
		if(secret instanceof Uint8Array){
			secret_enc = secret;
		}else{
			secret_enc = Crypto.encode(secret);
		}
		const key = await crypto.subtle.importKey(
			"raw", secret_enc, {name: "HMAC", hash: "SHA-256"},
			false, ["sign", "verify"]);
		let enc;
		if(message instanceof Uint8Array){
			enc = message;
		}else{
			enc = Crypto.encode(message);
		}
		return await crypto.subtle.sign("HMAC", key, enc);
	}

	static async verify(secret: string|Uint8Array<ArrayBuffer>,
			signval: ArrayBuffer, message: string|Uint8Array<ArrayBuffer>): Promise<boolean>{
		let secret_enc;
		if(secret instanceof Uint8Array){
			secret_enc = secret;
		}else{
			secret_enc = Crypto.encode(secret);
		}
		const key = await crypto.subtle.importKey(
			"raw", secret_enc, {name: "HMAC", hash: "SHA-256"},
			false, ["sign", "verify"]);
		let enc;
		if(message instanceof Uint8Array){
			enc = message;
		}else{
			enc = Crypto.encode(message);
		}
		return await crypto.subtle.verify("HMAC", key, signval, enc);
	}
}