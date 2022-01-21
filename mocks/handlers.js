import { rest } from 'msw';

let listNewId = 1;
let taskNewId = 1;
const lists = {};
const tasks = {};

const handlers = [
  rest.post('/api/v1/lists', (req, res, ctx) => {
    const list = { ...req.body, id: listNewId++, removable: true };
    lists[list.id] = list;
    return res(ctx.status(201), ctx.json(list));
  }),

  rest.get('/api/v1/lists', (req, res, ctx) => res(ctx.status(200), ctx.json(Object.values(lists)))),

  rest.delete('/api/v1/lists/:listId', (req, res, ctx) => {
    delete lists[req.params.listId];
    return res(ctx.status(204));
  }),

  rest.get('/api/v1/lists/:listId/tasks', (req, res, ctx) => {
    const listId = Number(req.params.listId);
    const toRetTasks = Object.values(tasks).filter((task) => task.listId === listId);
    return res(ctx.status(200), ctx.json(toRetTasks));
  }),

  rest.post('/api/v1/lists/:listId/tasks', (req, res, ctx) => {
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

  rest.delete('/api/v1/tasks/:taskId', (req, res, ctx) => {
    delete tasks[req.params.taskId];
    return res(ctx.status(204));
  }),

  rest.patch('/api/v1/tasks/:taskId', (req, res, ctx) => {
    const task = tasks[req.params.taskId];
    task.completed = req.body.completed;
    return res(ctx.status(201), ctx.json(task));
  }),
];

export default handlers;
