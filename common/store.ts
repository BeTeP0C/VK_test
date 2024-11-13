import { TUser } from "../types/TUser";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { GIT_HUB_TOKEN } from "./token";

export class UserStore {
  users: TUser[] = [];
  isLoading: boolean = false;
  startUser: number = 0;
  isEditing: boolean = false;
  editingUser: TUser = null;
  inputLogin: string = "";
  radioSort: boolean = true

  constructor() {
    makeAutoObservable(this);
  }

  // Получаем данные из api
  async getUsers(endpoint: string): Promise<TUser[]> {
    const resp = await axios.get(endpoint, {
      headers: {
        Authorization: `token ${GIT_HUB_TOKEN}`
      }
    })

    return resp?.data
  }

  // Обновляем список Users и другие зависимости
  async changeStateUsers () {
    this.isLoading = true
    const endpoint: string = `https://api.github.com/users?per_page=10&since=${this.startUser}`
    const data: TUser[] = await this.getUsers(endpoint)

    if (!data) {
      this.isLoading = false
      return
    }

    setTimeout(() => {
      runInAction(() => {
        const usersCopy: TUser[] = data.filter(user => !this.users.some((existingUser) => existingUser.login === user.login));

        this.users = [...this.users, ...usersCopy]
        this.startUser += 10
        this.isLoading = false
      })
    }, 200)
  }

  // Событие сохранения изменений
  handleSave = () => {
    const updateUsers: TUser[] = this.users.map((user: TUser) => {
      return user.login === this.editingUser.login ? {...this.editingUser, login: this.inputLogin} : user
    })

    runInAction(() => {
      this.users = [...updateUsers]
      this.inputLogin = ""
      this.editingUser = null
      this.isEditing = false
    })
  }

  // Событие редактирования
  handleEdit (user: TUser) {
    runInAction(() => {
      this.editingUser = user
      this.inputLogin = user.login
      this.isEditing = true
    })
  }

  // Событие удаления элемента
  handleDelete (currentUser: TUser) {
    runInAction(() => {
      const updateUsers: TUser[] = this.users.filter(user => user.login !== currentUser.login)
      this.users = updateUsers
    })
  }

  // Сортировка списка
  sortUsersLogin = () => {
    runInAction(() => {
      if (this.radioSort) {
        this.users.sort((a, b) => a.login.localeCompare(b.login));
        this.radioSort = !this.radioSort
      } else {
        this.users.sort((a, b) => b.login.localeCompare(a.login));
        this.radioSort = !this.radioSort
      }
    })
  }
}
