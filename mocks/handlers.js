import { rest } from 'msw';

let listNewId = 1;
let taskNewId = 1;
const lists = {};
const tasks = {};

const handlers = [
  rest.post('http://localhost/api/v1/lists', (req, res, ctx) => {
    console.log('###', 'POST LISTS', req.body);
    const list = { ...req.body, id: listNewId++, removable: true };
    lists[list.id] = list;
    return res(ctx.status(201), ctx.json(list));
  }),

  rest.get('http://localhost/api/v1/lists', (req, res, ctx) => {
    console.log('###', 'GET LISTS', req.body);
    return res(ctx.status(200), ctx.json(Object.values(lists)));
  }),

  rest.get('http://localhost/api/v1/lists/:listId/tasks', (req, res, ctx) => {
    console.log('###', 'GET TASKS', req.body, req.params.listId);
    const listId = Number(req.params.listId);
    const toRetTasks = Object.values(tasks).filter((task) => task.listId === listId);
    return res(ctx.status(200), ctx.json(toRetTasks));
  }),

  rest.post('http://localhost/api/v1/lists/:listId/tasks', (req, res, ctx) => {
    console.log('###', 'POST TASKS', req.body, req.params.listId);
    const task = {
      ...req.body,
      listId: Number(req.params.listId),
      id: taskNewId++,
      completed: false,
      touched: new Date().getTime(),
    };
    tasks[task.id] = task;
    return res(ctx.status(201), ctx.json(task));
  }),

  rest.delete('http://localhost/api/v1/tasks/:taskId', (req, res, ctx) => {
    console.log('###', 'DELETE TASKS', req.body, req.params.taskId);
    delete tasks[req.params.taskId];
    return res(ctx.status(204));
  }),

  rest.patch('http://localhost/api/v1/tasks/:taskId', (req, res, ctx) => {
    console.log('###', 'PATCH TASKS', req.body, req.params.taskId);
    const task = tasks[req.params.taskId];
    task.completed = req.body.completed;
    return res(ctx.status(201), ctx.json(task));
  }),
];

export default handlers;
