export interface IEvent {
    name: string,
    override(...args: any[]): Promise<void>
}