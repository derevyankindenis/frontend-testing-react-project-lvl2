import React from 'react';
import '@testing-library/jest-dom';
import App from '@hexlet/react-todo-app-with-backend';
import { render, screen, waitFor, findAllByRole } from '@testing-library/react';
import TodoApp from '../__testPages__/TodoApp.js';

const page = new TodoApp(screen);

describe('Todo app', () => {
  test('there are inputs for tasks and lists', async () => {
    render(<App />);
    expect(page.taskInput).not.toBeNull();
    expect(page.listInput).not.toBeNull();
  });

  test('there are no tasks before user add its', async () => {
    render(<App />);
    const tasks = await page.getTasks();
    expect(tasks).toHaveLength(0);
  });

  test('there is placeholder for empty tasks', () => {
    render(<App />);
    expect(page.tsksEmptyText).not.toBeNull();
  });

  // TODO:
  // test('there are primary and secondary lists', async () => {
  //   render(<App />);
  //   const lists = await page.getLists();
  //   expect(lists).toHaveLength(2);
  // });
});
