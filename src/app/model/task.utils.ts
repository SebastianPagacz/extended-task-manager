import { isStatus, Priority, Status, Task } from "./task.model";

export function addTask(tasks: readonly Task[], name: string): Task[]{
    let unfrozenTasks = tasks.slice();
    let id = unfrozenTasks.sort((a, b) => b.id - a.id).at(0)?.id ?? 0; // Not the best approach, however I can't think of a better one
    
    if (name.trim() === '' || name.trim() === null){
        return unfrozenTasks;
    }
    id++;
    return [...tasks, {id: id, title: name.trim(), status: 'todo', priority: 'low', dueDate: undefined, tags: []}];
}

export function removeTask(tasks: readonly Task[], id: number): Task[]{
    return tasks.filter(task => task.id !== id)
}

export function updateTask(tasks: readonly Task[], id: number, changes: Partial<Omit<Task, 'id'>>):  Task[]{
    return tasks.map(task => task.id === id ? {...task, ...changes} : task)
}

export function moveTask(tasks: readonly Task[], id: number, status: string): Task[]{
    if(isStatus(status)){
        return updateTask(tasks, id, { status: status })
    }
    return tasks.slice();
}

export interface Criteria{
    text?: string, 
    priority?: Priority,
    status?: Status,
    hideDone?: boolean,
}

export function filterTasks(tasks: readonly Task[], criteria: Criteria): Task[]{ 
    if (criteria === undefined){
        return tasks.slice();
    }

    let result = tasks.slice();
    const text = criteria.text;
    const hide = criteria.hideDone;
    
    if (criteria.priority){
        result = result.filter(task => task.priority === criteria.priority);
    }

    if (criteria.status){
        result = result.filter(task => task.status === criteria.status);
    }

    if(text !== undefined && text.trim() !== ''){
        result = result.filter(task => task.title.toLocaleLowerCase().includes(text.toLowerCase().trim()));
    }

    if(hide){
        result = result.filter(task => task.status !== 'done');
    }

    return result;
}

const priorityNumber : Record<Priority, number> = {
    'low': 0,
    'medium': 1,
    'high': 2,
}

export function sortTasks(tasks: readonly Task[]): Task[]{
    return tasks
        .slice()
        .sort((a, b) => {
        if (a.dueDate && b.dueDate){
            const dateDiff = a.dueDate.getTime() - b.dueDate.getTime()
            if(dateDiff === 0){
                return priorityNumber[b.priority] - priorityNumber[a.priority];
            }
            return dateDiff;
        }
        else{
            return priorityNumber[b.priority] - priorityNumber[a.priority];
        }
    });
}

export function getDueInDays(due: Date, now: Date = new Date()): number{
    due.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    return Math.floor
    (
        (due.getTime() / (1000 * 3600 * 24)) - (now.getTime() / (1000 * 3600 * 24))
    );
}

export function groupBy<T, K extends string>(items: readonly T[], key: (item: T) => K): Partial<Record<K, T[]>>{
    const result: Partial<Record<K, T[]>> = {};

    for (const item of items){
        const k = key(item);
        const group = result[k];
        if(group){
            group.push(item);
        }
        else{
            result[k] = [item];
        }
    }
    return result;   
}