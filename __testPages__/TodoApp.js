// eslint-disable-next-line import/no-extraneous-dependencies
import { findAllByRole } from '@testing-library/react';

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
}
