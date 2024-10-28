import React, { useEffect, useState, useRef, Fragment } from "react";
import styles from "./styles.module.scss"
import { Box, List, ListItem, ListItemText, Typography, Divider, CircularProgress, ListItemAvatar, Avatar, Tooltip, IconButton, TextField, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { v4 as uuidv4 } from "uuid";
import { observer } from "mobx-react-lite";
import { makeAutoObservable, runInAction } from "mobx";
import { resolve } from "path";

export class UserStore {
  users: any[] = [];
  isLoading: boolean = false;
  startUser: number = 0;
  isEditing: boolean = false;
  editingUser: any = null;
  inputLogin: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  async getUsers(endpoint: string) {
    const token: string = "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"

    return fetch(endpoint, {
      headers: {
        Authorization: `token ${token}`
      }
    }).then((res) => res.json())
  }

  changeStateUsers () {
    this.isLoading = true
    const endpoint: string = `https://api.github.com/users?per_page=10&since=${this.startUser}`
    return new Promise<void> ((resolve) => {
      setTimeout(() => {
        this.getUsers(endpoint).then((data) => {
          runInAction(() => {
            const usersCopy = data.filter(user => !this.users.some((existingUser) => existingUser.login === user.login));

            this.users = [...this.users, ...usersCopy]
            this.startUser += 10
            this.isLoading = false
            resolve()
          })
        })
      }, 500)
    })
  }

  handleSave = () => {
    const updateUsers = this.users.map((user) => {
      return user.login === this.editingUser.login ? {...this.editingUser, login: this.inputLogin} : user
    })

    runInAction(() => {
      this.users = [...updateUsers]
      this.inputLogin = ""
      this.editingUser = null
      this.isEditing = false
    })
  }

  handleEdit (user) {
    runInAction(() => {
      this.editingUser = user
      this.inputLogin = user.login
      this.isEditing = true
    })
  }

  handleDelete (currentUser) {
    runInAction(() => {
      const updateUsers = this.users.filter(user => user.login !== currentUser.login)
      this.users = updateUsers
    })
  }
}

const userStore = new UserStore ();

export const Test = observer(() => {
  const listRef = useRef(null)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
    } else {
      userStore.changeStateUsers()
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!userStore.isLoading) {
        const scrollTop = listRef.current.scrollTop
        const scrollHeight = listRef.current.scrollHeight;
        const clientHeight = listRef.current.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight) {
          userStore.changeStateUsers()
        }
      }
    }

    if (listRef.current) {
      listRef.current.addEventListener('scroll', handleScroll);
      return () => {
        if (listRef.current) {
          listRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [userStore.startUser])

  console.log(userStore.users)

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'lightgray',
      }}
    >
      <Box
        ref={listRef}
        sx={{
          width: '500px',
          height: '300px',
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          overflow: 'auto',
        }}
      >
        <Typography variant="h5" align="center" mb={2}>
          Пользователи
        </Typography>

        <List role="userlist">
          {userStore.users.map((el) => {
            return (
              <Fragment key={uuidv4()}>
                <ListItem role="listitem">
                  <ListItemAvatar>
                    <Avatar alt="Аватар" src={el.avatar_url} />
                  </ListItemAvatar>

                  {userStore.isEditing && el.login === userStore.editingUser.login ?
                  (
                    <>
                      <TextField
                        fullWidth
                        defaultValue={userStore.inputLogin}
                        onBlur={(e) =>{
                          userStore.inputLogin = e.target.value
                        }}
                      />

                      <IconButton className={styles.save_button} onClick={userStore.handleSave}>
                        <CheckCircleIcon className={styles.icon}/>
                      </IconButton>
                    </>
                  ) :
                  (
                    <>
                      <ListItemText primary={el?.login} />

                      <Tooltip title="Редактировать">
                        <IconButton className={styles.edit_button} onClick={(e) => userStore.handleEdit(el)}>
                          <EditIcon className={styles.icon} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton className={styles.delete_button} onClick={(e) => userStore.handleDelete(el)}>
                          <DeleteIcon className={styles.icon} />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </ListItem>
                <Divider />
              </Fragment>
            )
          })}

          {userStore.isLoading ? (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          ): ""}
        </List>
      </Box>
    </Box>
  )
})
