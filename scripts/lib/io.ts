import { TextLineStream } from "@std/streams"
export { exists, copy, move, walk } from "@std/fs"
import * as csv from "@std/csv"

export const version = "0.0.6";

/**
 * read file
 *
 * @param {string} path
 * @param [enc="UTF8"]
 * @return {AsyncIterableIterator<string>}
 */
export async function* readFile(path: string, enc="UTF8"): AsyncIterableIterator<string>{
	const file = await Deno.open(path, {read: true});

	const lineStream = file.readable
		.pipeThrough(new TextDecoderStream(enc))
		.pipeThrough<string>(new TextLineStream());

	for await (const line of lineStream) {
		yield line
	}
}

/**
 * read file all
 *
 * @param {string} path
 * @param [enc="UTF8"]
 * @return {Promise<string>}
 */
export async function readAll(path: string, enc="UTF8"): Promise<string>{
	const bytes = await Deno.readFile(path);
	return new TextDecoder(enc).decode(bytes);
}

/**
 * write file UTF8 encoded
 *
 * @param {string} path
 * @param {string[]} ss
 * @param [append=false]
 * @return {Promise<void>}
 */
export function writeFile(path: string, ss: string[], append=false): Promise<void>{
	const s = ss.join("\r\n");
	return writeAll(path, s, append);
}

/**
 * write file all UTF8 encoded
 *
 * @param {string} path
 * @param {string} s
 * @param [append=false]
 * @return {Promise<void>}
 */
export function writeAll(path: string, s: string, append=false): Promise<void>{
	return Deno.writeTextFile(path, s, {append: append});
}

/**
 * read csv file
 *
 * @param {string} path
 * @param [enc="UTF8"]
 * @return {AsyncIterator<string[]>}
 */
export async function* readCSV(path: string, enc="UTF8"): AsyncIterableIterator<string[]>{
	for await(const s of readFile(path, enc)){
		yield csv.parse(s)[0];
	}
}


//export class IO{
//	export function readFile(path, enc){
//		return {
//			[Symbol.asyncIterator](){
//				return {
//					first: true,
//					file: undefined,
//					iterator: undefined,
//					enc: "SJIS",
//					async next(){
//						if(this.first){
//							if(enc){
//								this.enc = enc;
//							}
//							this.file = await Deno.open(path, {read: true});
//							this.iterator = readLines(this.file, {encoding: this.enc});
//							this.first = false;
//						}
//						const result = this.iterator.next();
//						if(result.done){
//							Deno.close(this.file.rid);
//						}
//						return result;
//					}
//				}
//			}
//		};
//	}
