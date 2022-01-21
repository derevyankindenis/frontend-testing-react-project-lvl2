/* eslint-disable class-methods-use-this */
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  findAllByRole,
  waitFor,
  waitForElementToBeRemoved,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import difference from 'lodash/difference';

export default class TodoApp {
  get listInput() {
    return screen.queryByRole('textbox', {
      name: /new list/i,
    });
  }

  get taskInput() {
    return screen.queryByRole('textbox', {
      name: /new task/i,
    });
  }

  get listContainer() {
    return screen.getByTestId('lists');
  }

  get tasksContainer() {
    return screen.getByTestId('tasks');
  }

  async getTasks() {
    try {
      const items = await findAllByRole(this.tasksContainer, 'listitem');
      return items.map((item) => item.textContent);
    } catch (e) {
      return [];
    }
  }

  async getLists() {
    try {
      const items = await findAllByRole(this.listContainer, 'listitem');
      return items.map((item) => item.textContent);
    } catch (e) {
      return [];
    }
  }

  get tsksEmptyText() {
    return screen.getByText('Tasks list is empty');
  }

  get addTaskBtn() {
    return screen.getByRole('button', {
      name: 'Add',
    });
  }

  get addListBtn() {
    return screen.getByRole('button', {
      name: /add list/i,
    });
  }

  get deleteTaskBtns() {
    return screen.queryAllByRole('button', {
      name: /remove/i,
    });
  }

  get deleteListBtns() {
    return screen.queryAllByRole('button', {
      name: /remove list/i,
    });
  }

  getErrorMesage(name) {
    return screen.getByText(`${name} already exists`);
  }

  async addTask(name) {
    const delBtns = this.deleteTaskBtns;
    userEvent.type(this.taskInput, name);
    userEvent.click(this.addTaskBtn);
    await this.getTask(name);
    const delBtn = difference(this.deleteTaskBtns, delBtns)[0];
    return this.getRemoveFn(delBtn);
  }

  async addList(name) {
    const delBtns = this.deleteListBtns;
    userEvent.type(this.listInput, name);
    userEvent.click(this.addListBtn);
    await this.getList(name);
    const delBtn = difference(this.deleteListBtns, delBtns)[0];
    return this.getRemoveFn(delBtn);
  }

  async completeTask(name) {
    const task = await this.getTask(name);
    userEvent.click(task);
    return waitFor(() => task.checked);
  }

  async pickList(name) {
    const list = await this.getList(name);
    userEvent.click(list);
  }

  getRemoveFn(delBtn) {
    const fn = () => {
      userEvent.click(delBtn);
      return waitForElementToBeRemoved(delBtn);
    };
    return fn;
  }

  async getTask(name) {
    try {
      const task = await screen.findByRole('checkbox', { name });
      return task;
    } catch (_) {
      return null;
    }
  }

  async getList(name) {
    try {
      const list = await screen.findByRole('button', { name });
      return list;
    } catch (_) {
      return null;
    }
  }
}
