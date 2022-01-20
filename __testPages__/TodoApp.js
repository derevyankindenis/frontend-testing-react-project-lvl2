// eslint-disable-next-line import/no-extraneous-dependencies
import { findAllByRole, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import difference from 'lodash/difference';

export default class TodoApp {
  constructor(screen) {
    this.screen = screen;
  }

  get listInput() {
    return this.screen.queryByRole('textbox', {
      name: /new list/i,
    });
  }

  get taskInput() {
    return this.screen.queryByRole('textbox', {
      name: /new task/i,
    });
  }

  get listContainer() {
    return this.screen.getByTestId('lists');
  }

  get tasksContainer() {
    return this.screen.getByTestId('tasks');
  }

  async getTasks() {
    try {
      // eslint-disable-next-line testing-library/prefer-screen-queries
      const items = await findAllByRole(this.tasksContainer, 'listitem');
      return items.map((item) => item.textContent);
    } catch (e) {
      return [];
    }
  }

  async getLists() {
    try {
      // eslint-disable-next-line testing-library/prefer-screen-queries
      const items = await findAllByRole(this.listContainer, 'listitem');
      return items.map((item) => item.textContent);
    } catch (e) {
      return [];
    }
  }

  get tsksEmptyText() {
    return this.screen.getByText('Tasks list is empty');
  }

  get addTaskBtn() {
    return this.screen.getByRole('button', {
      name: 'Add',
    });
  }

  get addListBtn() {
    return this.screen.getByRole('button', {
      name: /add list/i,
    });
  }

  get deleteBtns() {
    return this.screen.queryAllByRole('button', {
      name: /remove/i,
    });
  }

  async addTask(name) {
    const delBtns = this.deleteBtns;
    userEvent.type(this.taskInput, name);
    userEvent.click(this.addTaskBtn);
    const item = await this.getTask(name);
    const delBtn = difference(this.deleteBtns, delBtns)[0];
    return this.getRemoveTaskFn(delBtn, item);
  }

  async completeTask(name) {
    const task = await this.getTask(name);
    userEvent.click(task);
    return waitFor(() => task.checked);
  }

  // eslint-disable-next-line class-methods-use-this
  getRemoveTaskFn(delBtn, item) {
    const fn = () => {
      userEvent.click(delBtn);
      return waitForElementToBeRemoved(item);
    };
    return fn;
  }

  async addList(name) {
    userEvent.type(this.listInput, name);
    userEvent.click(this.addListBtn);
    await this.getList(name);
  }

  async getTask(name) {
    try {
      const task = await this.screen.findByRole('checkbox', { name });
      return task;
    } catch (e) {
      return null;
    }
  }

  async getList(name) {
    try {
      const list = await this.screen.findAllByRole('button', { name });
      return list;
    } catch (e) {
      return null;
    }
  }
}
