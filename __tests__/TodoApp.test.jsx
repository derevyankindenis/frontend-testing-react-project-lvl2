import React from 'react';
import '@testing-library/jest-dom';
import App from '@hexlet/react-todo-app-with-backend';
import { render, screen } from '@testing-library/react';
import TodoApp from '../__testPages__/TodoApp';
import server from '../mocks/server';

const page = new TodoApp(screen);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Todo app', () => {
  test('there are inputs for tasks and lists', async () => {
    render(<App />);
    expect(page.taskInput).toBeVisible();
    expect(page.listInput).toBeVisible();
  });

  test('there are no tasks before user add its', async () => {
    render(<App />);
    const tasks = await page.getTasks();
    expect(tasks).toHaveLength(0);
  });

  test('there is placeholder for empty tasks', () => {
    render(<App />);
    expect(page.tsksEmptyText).toBeVisible();
  });

  test('user can add tasks', async () => {
    render(<App />);
    await page.addList('new list');
    await page.addTask('new task');
    await page.addTask('new task 2');
    const task = await page.getTask('new task');
    const task2 = await page.getTask('new task 2');
    expect(task).toBeVisible();
    expect(task2).toBeVisible();
  });

  test('user can remove tasks', async () => {
    render(<App />);
    await page.addList('new list');
    const deleteFirstTask = await page.addTask('first task');
    await page.addTask('second task');
    await deleteFirstTask();
    const task = await page.getTask('first task');
    const task2 = await page.getTask('second task');
    expect(task).toBeNull();
    expect(task2).toBeVisible();
  });

  test('user can complete tasks', async () => {
    render(<App />);
    await page.addList('new list');
    await page.addTask('first task');
    await page.addTask('second task');
    await page.completeTask('first task');
    const task = await page.getTask('first task');
    const task2 = await page.getTask('second task');
    expect(task).toBeChecked();
    expect(task2).not.toBeChecked();
  });

  test('user can add lists', async () => {
    render(<App />);
    await page.addList('new list');
    await page.addList('new list 2');
    const list = await page.getList('new list');
    const list2 = await page.getList('new list 2');
    expect(list).toBeVisible();
    expect(list2).toBeVisible();
  });

  test('user can remove lists', async () => {
    render(<App />);
    const deleteFirstList = await page.addList('first list');
    await page.addList('second list');
    await deleteFirstList();
    const list = await page.getList('first list');
    const list2 = await page.getList('second list');
    expect(list).toBeNull();
    expect(list2).toBeVisible();
  });

  test('each task in own list', async () => {
    render(<App />);
    await page.addList('list 1');
    await page.addTask('task 1');
    await page.addTask('task 2');
    await page.addList('list 2');
    expect(page.tsksEmptyText).toBeVisible();
    await page.addTask('task 3');
    await page.addTask('task 4');
    await page.pickList('list 1');
    const task1 = await page.getTask('task 1');
    const task2 = await page.getTask('task 2');
    expect(task1).toBeVisible();
    expect(task2).toBeVisible();
    await page.pickList('list 2');
    const task3 = await page.getTask('task 3');
    const task4 = await page.getTask('task 4');
    expect(task3).toBeVisible();
    expect(task4).toBeVisible();
  });

  test("removing tasks in list doesn't affect on other list", async () => {
    render(<App />);
    await page.addList('list 1');
    await page.addList('list 2');
    await page.addTask('task 1');
    await page.pickList('list 1');
    const removeTask3 = await page.addTask('task 3');
    await removeTask3();
    expect(page.tsksEmptyText).toBeVisible();
    await page.pickList('list 2');
    const task1 = await page.getTask('task 1');
    expect(task1).toBeVisible();
  });

  test("deleted tasks aren't restored", async () => {
    render(<App />);
    const removeList = await page.addList('list 1');
    await page.addTask('task 1');
    await removeList();
    await page.addList('list 1');
    const task = await page.getTask('task 1');
    expect(task).toBeNull();
  });

  test("user can't create lists with same name", async () => {
    render(<App />);
    await page.addList('list 1');
    await page.addList('list 1');
    expect(page.getErrorMesage('list 1')).toBeVisible();
  });

  test("user can't create task with same name", async () => {
    render(<App />);
    await page.addList('list 1');
    await page.addTask('task 1');
    await page.addTask('task 1');
    expect(page.getErrorMesage('task 1')).toBeVisible();
  });
});
