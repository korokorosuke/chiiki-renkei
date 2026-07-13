export const version = "0.0.10";

//https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch

interface Body{
	[propName: string]: string|number|boolean|Record<string|number, unknown>;
}

interface RequestParam{
	method?: string,
	body?: string|Body|object|Map<string,number|string>,
	token?: string
}

/**
 * set parameter
 *
 * @param {RequestParam}
 * @return {RequestInit}
 */
export function getParameter({method="GET", body, token}: RequestParam={}): RequestInit{
	const params: RequestInit = {
		method: method,
	};
	if(body){
		if(typeof body === "string"){
			params.body = body;
		}else if(body instanceof Map){
			params.body = JSON.stringify(Object.fromEntries(body));
		}else{
			params.body = JSON.stringify(body);
		}
		const h = new Headers();
		h.set("Content-Type", "application/json");
		params.headers = h;
	}
	if(token){
		addToken(params, token);
	}
	return params;
}

/**
 * set token to parameter
 *
 * @param {RequestInit} params
 * @param {string} token
 * @return {RequestInit}
 */
export function addToken(params: RequestInit, token: string): RequestInit{
	if(params.headers){
		const h = new Headers(params.headers);
		h.set("Authorization", "Bearer " + token);
		params.headers = h;
	}else{
		const h = new Headers();
		h.set("Authorization", "Bearer " + token);
		params.headers = h;
	}
	return params;
}

/**
 * set basic authentication to parameter
 *
 * @param {RequestInit} params
 * @param {string} user or base64(user:password)
 * @param {string} [password]
 * @return {RequestInit}
 */
export function addBasic(params: RequestInit, user: string, password?: string): RequestInit{
	let basic;
	if(password == undefined){
		basic = user;
	}else{
		basic = btoa(`${user}:${password}`);
	}
	if(params.headers){
		const h = new Headers(params.headers);
		h.set("Authorization", "Basic " + basic);
		params.headers = h;
	}else{
		const h = new Headers();
		h.set("Authorization", "Basic " + basic);
		params.headers = h;
	}
	return params;
}

/**
 * fetch
 *
 * @param {string} url
 * @param {RequestInit} params
 * @return {Promise<any>}
 */
export async function getData(url: string, params: RequestInit): Promise<string|Record<string|number, unknown>|Blob|undefined>{
	const res = await fetch(url, params);
	if(res && res.ok){
		if(res.headers){
			let type = res.headers.get("content-type");
			if(type){
				type = type.toLowerCase();
				if(type.includes("json")){
					return res.json();
				}else if(type.includes("text")){
					return res.text();
				}
			}
		}
		return res.blob();
	}else{
		return undefined;
	}
}

/**
 * fetch
 *
 * @param {string} url
 * @param {RequestInit} params
 * @return {Promise<T>}
 */
export async function getJson<T>(url: string, params: RequestInit): Promise<T>{
	const res = await fetch(url, params);
	if(res){
		return (await res.json()) as T;
	}else{
		return Promise.reject(res);
	}
}

/**
 * fetch get method
 *
 * @param {string} url
 * @param {string|Body|Map<string,number|string>} [body]
 * @return {Promise<Response>}
 */
export function get(url: string, body?: string|Body|Map<string,number|string>): Promise<Response>{
	if(body){
		if(body instanceof Map){
			url += "?" +
				Array.from(body, kv => `${kv[0]}=${kv[1]}`).join("&");
		}else if(typeof body === "object"){
			url += "?" + Object.entries(body).map(kv => `${kv[0]}=${kv[1]}`).join("&");
		}else{
			url += "?" + body.toString();
		}
	}
	const params = getParameter();
	return fetch(url, params);
}

/**
 * fetch post method
 *
 * @param {string} url
 * @param {string|Body|Map<string,number|string>} [body]
 * @return {Promise<Response>}
 */
export function post(url: string, body?: string|Body|Map<string,number|string>): Promise<Response>{
	const params = getParameter({method: "POST", body: body});
	return fetch(url, params);
}

/**
 * fetch put method
 *
 * @param {string} url
 * @param {string|Body|Map<string,number|string>} [body]
 * @return {Promise<Response>}
 */
export function put(url: string, body?: string|Body|Map<string,number|string>): Promise<Response>{
	const params = getParameter({method: "PUT", body: body});
	return fetch(url, params);
}

/**
 * fetch delete method
 *
 * @param {string} url
 * @param {string|Body|Map<string,number|string>} [body]
 * @return {Promise<Response>}
 */
export function del(url: string, body?: string|Body|Map<string,number|string>): Promise<Response>{
	const params = getParameter({method: "DELETE", body: body});
	return fetch(url, params);
}