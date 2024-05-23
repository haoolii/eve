import { Task } from "../Task";

export class TaskSample implements Task {
    
    execute(): void {
        throw new Error("Method not implemented.");
    }
    shouldExecute(): boolean {
        throw new Error("Method not implemented.");
    }

}