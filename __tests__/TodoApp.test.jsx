import React from 'react';
import '@testing-library/jest-dom';
import App from '@hexlet/react-todo-app-with-backend';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import server from '../mocks/server';

beforeEach(() => {
  server.listen({ onUnhandledRequest: 'warn' });
  server.resetHandlers();
  render(<App />);
});

afterEach(() => {
  server.close();
});

function addTask(name) {
  const input = screen.queryByRole('textbox', {
    name: /new task/i,
  });
  const btn = screen.getByRole('button', {
    name: 'Add',
  });
  userEvent.type(input, name);
  userEvent.click(btn);
}

function addList(name) {
  const input = screen.queryByRole('textbox', {
    name: /new list/i,
  });

  const btn = screen.getByRole('button', {
    name: /add list/i,
  });

  userEvent.type(input, name);
  userEvent.click(btn);
}

describe('Todo app', () => {
  test('user can add task', async () => {
    addList('list 1');
    await screen.findByText(/list 1/i);

    const input = screen.queryByRole('textbox', { name: /new task/i });
    const submitBtn = screen.getByRole('button', { name: 'Add' });

    userEvent.type(input, 'task 1');
    userEvent.click(submitBtn);

    expect(input).toHaveAttribute('readonly');
    expect(submitBtn).toBeDisabled();
    expect(await screen.findByText(/task 1/i)).toBeInTheDocument();
    expect(input).not.toHaveAttribute('readonly');
    expect(submitBtn).toBeEnabled();
  });

  test('user can remove tasks', async () => {
    addList('list 1');
    await screen.findByText(/list 1/i);
    addTask('task 1');
    await screen.findByText(/task 1/i);
    const delTask1Btn = await screen.findByRole('button', { name: 'Remove' });
    addTask('task 2');
    await screen.findByText(/task 2/i);
    userEvent.click(delTask1Btn);
    await waitForElementToBeRemoved(screen.queryByText(/task 1/i));
    expect(screen.queryByText(/task 1/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/task 2/i)).toBeInTheDocument();
  });

  test('user can complete tasks', async () => {
    addList('list 1');
    await screen.findByText(/list 1/i);
    addTask('task 1');
    await screen.findByText(/task 1/i);
    addTask('task 2');
    await screen.findByText(/task 2/i);
    const checkBoxTask1 = screen.getByRole('checkbox', { name: 'task 1' });
    userEvent.click(checkBoxTask1);
    await waitFor(() => expect(checkBoxTask1).toBeChecked());
    expect(screen.getByRole('checkbox', { name: 'task 2' })).not.toBeChecked();
  });

  test("user can't create task with same name", async () => {
    addList('list 1');
    await screen.findByText(/list 1/i);
    addTask('task 1');
    await screen.findByText(/task 1/i);
    addTask('task 1');
    await waitFor(() => expect(screen.getByText(/task 1 already exists/i)).toBeVisible());
    // eslint-disable-next-line jest-dom/prefer-in-document
    expect(screen.getAllByRole('checkbox', { name: /task 1/i })).toHaveLength(1);
  });

  test('user can add lists', async () => {
    const input = screen.queryByRole('textbox', {
      name: /new list/i,
    });

    const submitBtn = screen.getByRole('button', {
      name: /add list/i,
    });

    userEvent.type(input, 'list 1');
    userEvent.click(submitBtn);

    expect(input).toHaveAttribute('readonly');
    expect(submitBtn).toBeDisabled();
    expect(await screen.findByText(/list 1/i)).toBeInTheDocument();
    expect(input).not.toHaveAttribute('readonly');
    expect(submitBtn).toBeEnabled();
  });

  test('user can remove lists', async () => {
    addList('list 1');
    await screen.findByText(/list 1/i);
    const removeBtn = screen.getByRole('button', { name: /remove list/i });
    addList('list 2');
    userEvent.click(removeBtn);
    await waitForElementToBeRemoved(screen.queryByText(/list 1/i));
    expect(screen.queryByText(/list 1/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/list 2/i)).toBeInTheDocument();
  });

  test("user can't create lists with same name", async () => {
    addList('list 1');
    await screen.findByText(/list 1/i);
    addList('list 1');
    await waitFor(() => expect(screen.getByText(/list 1 already exists/i)).toBeVisible());
    // eslint-disable-next-line jest-dom/prefer-in-document
    expect(screen.getAllByRole('button', { name: /list 1/i })).toHaveLength(1);
  });

  test("deleted tasks aren't restored", async () => {
    addList('list 1');
    await screen.findByText(/list 1/i);
    addTask('task 1');
    await screen.findByText(/task 1/i);
    userEvent.click(screen.getByRole('button', { name: /remove list/i }));
    await waitForElementToBeRemoved(screen.queryByText(/list 1/i));
    addList('list 1');
    await screen.findByText(/list 1/i);
    expect(screen.queryByText(/task 1/i)).not.toBeInTheDocument();
  });

  test("removing tasks in list doesn't affect on other list", async () => {
    addList('list 1');
    const list1 = await screen.findByRole('button', { name: /list 1/i });
    addList('list 2');
    const list2 = await screen.findByRole('button', { name: /list 2/i });
    addTask('task 1');
    await screen.findByText(/task 1/i);
    userEvent.click(list1);
    addTask('task 3');
    await screen.findByText(/task 3/i);
    const delTask1Btn = await screen.findByRole('button', { name: 'Remove' });
    userEvent.click(delTask1Btn);
    await waitForElementToBeRemoved(screen.queryByText(/task 3/i));
    userEvent.click(list2);
    expect(await screen.findByText(/task 1/i)).toBeInTheDocument();
  });

  test('each task in own list', async () => {
    addList('list 1');
    const list1 = await screen.findByRole('button', { name: /list 1/i });
    addTask('task 1');
    await screen.findByText(/task 1/i);
    addList('list 2');
    await screen.findByRole('button', { name: /list 2/i });
    expect(screen.getByText('Tasks list is empty')).toBeVisible();
    addTask('task 2');
    await screen.findByText(/task 2/i);
    expect(screen.queryByText(/task 1/i)).not.toBeInTheDocument();
    expect(screen.getByText(/task 2/i)).toBeInTheDocument();
    userEvent.click(list1);
    expect(screen.queryByText(/task 2/i)).not.toBeInTheDocument();
    expect(screen.getByText(/task 1/i)).toBeInTheDocument();
  });
});
