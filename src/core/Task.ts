export interface Task {
  execute(): void;
  shouldExecute(): boolean;
}
