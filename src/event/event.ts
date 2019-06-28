export interface IEvent {
    name: string,
    override(...args: any[]): void
}