import { isStatus, Priority, Status, Task } from "./task.model";

export function addTask(tasks: Task[], name: string): Task[]{
    let id = 0; // nie wiem jak dodac statyczne pole skoro nie mam klasy
    
    if (name.trim() === '' || name.trim() === null){
        return tasks;
    }
    id++;
    return [...tasks, {id: id, name: name, status: 'toDo', priority: 'low', dueDate: undefined, tags: []}];
}

export function removeTask(tasks: Task[], id: number): Task[]{
    return tasks.filter(task => task.id !== id)
}

export function updateTask(tasks: Task[], id: number, changes: Partial<Omit<Task, 'id'>>):  Task[]{
    return tasks.map(task => task.id === id ? {...task, ...changes} : task)
}

export function moveTask(tasks: Task[], id: number, status: string): Task[]{
    if(isStatus(status)){
        return updateTask(tasks, id, { status: status })
    }
    return tasks;
}

export interface Criteria{
    text?: string, 
    priority?: Priority,
    status?: Status,
    hideDone?: boolean,
}

export function filterTasks(tasks: Task[], cirteria: Criteria): Task[]{
    let result = tasks;
    const text = cirteria.text;
    const hide = cirteria.hideDone;

    if (cirteria === null || cirteria === undefined){
        return tasks;
    }
    
    if (cirteria.priority){
        result = result.filter(task => task.priority === cirteria.priority);
    }

    if (cirteria.status){
        result = result.filter(task => task.status === cirteria.status);
    }

    if(text !== undefined && text.trim() !== ''){
        result = result.filter(task => task.name.toLocaleLowerCase() === text.toLowerCase().trim());
    }

    if(hide !== undefined && hide){
        result = result.filter(task => task.status === 'done');
    }

    return result;
}

const priorityNumber : Record<Priority, number> = {
    'low': 0,
    'medium': 1,
    'high': 2,
}

export function sort(tasks: Task[]): Task[]{
    let withDate = tasks
        .filter(task => task.dueDate)
        .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime() || priorityNumber[b.priority] - priorityNumber[a.priority]);
    
    let withoutDate = tasks
        .filter(task => !task.dueDate)
        .sort((a, b) => priorityNumber[b.priority] - priorityNumber[a.priority]);

    return [...withDate, ...withoutDate];
}

export function getDueInDays(due: Date, now: Date = new Date()): number{
    return Math.floor
    (
        (due.getTime() / (1000 * 3600 * 24)) - (now.getTime() / (1000 * 3600 * 24))
    )
}