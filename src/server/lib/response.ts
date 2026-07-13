export interface Result{
    ok: boolean
    errors?: string[]
}

export interface FetchResult<T> extends Result{
    ok: boolean
    data?: T
    errors?: string[]
}

/**
 * return json response
 *
 * @param obj - return data
 * @param status - http status no
 * @return json Response
 */
export function json(obj: object, status: number): Response{
    return new Response(JSON.stringify(obj), {
        status: status,
        headers: {
            "content-type": "application/json",
        }
    });
}

/**
 * return json response(success)
 *
 * @param data - return data
 * @return json Response
 */
export function success201<T>(data?: T): Response {
    return json({
        ok: true,
        data: data
    }, 201);
}

/**
 * return json response(success)
 *
 * @param data - return data
 * @return json Response
 */
export function success<T>(data?: T): Response {
    return json({
        ok: true,
        data: data
    }, 200);
}

/**
 * return json response(failure)
 *
 * @param errors - error message list
 * @param status - http status no
 * @return json Response
 */
export function failure(errors: string[], status: number): Response {
    return json({
        ok: false,
        errors: errors
    }, status);
}

/**
 * return ok result
 *
 * @return result
 */
export function ok<T>(data?: T): FetchResult<T> {
    return {
        ok: true,
        data: data
    };
}

/**
 * return ng result
 *
 * @param errors - error message list
 * @return result
 */
export function ng(errors: string[]): Result {
    return {
        ok: false,
        errors: errors
    };
}