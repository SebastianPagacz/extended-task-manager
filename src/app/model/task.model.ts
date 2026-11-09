export type Priority = 'low' | 'medium' | 'high';

export type Status = 'toDo' | 'inProgress' | 'done';

export interface Task{
    readonly id: number, // Co zmienia readonly przy nazwie propa i przy typie propa?
    name: string,
    status: Status,
    priority: Priority,
    dueDate?: Date,
    tags: readonly string[],
}

export function isPriority(value: string): value is Priority{
    return value === 'low' || value === 'medium' || value === 'high';
}

export function isStatus(value: string): value is Status{
    return value === 'toDo' || value === 'inProgress' || value === 'done';
}