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

  test('user can complete task', async () => {
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
});
