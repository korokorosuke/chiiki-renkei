export interface Database {
    open(options?: object): Promise<object>
    close(): void
    get(): object|undefined
}