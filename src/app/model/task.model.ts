export type Priority = 'low' | 'medium' | 'high';

export type Status = 'toDo' | 'inProgress' | 'done';

export interface Task{
    readonly id: number, // Co zmienia readonly przy nazwie propa i przy typie propa?
    name: string,
    status: Status,
    priority: Priority,
    tags: readonly string[],
}

export function isPriority(value: string): boolean{
    if (value === 'low' || value === 'medium' || value === 'high'){
        return true;
    }
    return false;
}

export function isStatus(value: string): boolean{
    if(value === 'toDo' || value === 'inProgress' || value === 'done'){
        return true;
    }
    return false;
}