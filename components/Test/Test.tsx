import React, { useEffect, useRef, Fragment } from "react";
import styles from "./styles.module.scss"
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  CircularProgress,
  ListItemAvatar,
  Avatar,
  Tooltip,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SortIcon from '@mui/icons-material/Sort'

import { v4 as uuidv4 } from "uuid"; // Для определения key у элементов списка без повторений

import { TUser } from "../../types/TUser";
import { UserStore } from "../../common/store";
import { observer } from "mobx-react-lite";

const userStore = new UserStore ();

export const Test = observer(() => {
  const listRef = useRef(null)

  // Отрендерим список первый раз
  useEffect(() => {
    let mounted: boolean = true;

    if (mounted) {
      userStore.changeStateUsers()
    }

    return () => {mounted = false}
  }, [])


  // Изменение users при достаточном скролле
  useEffect(() => {
    const handleScroll = () => {
      if (!userStore.isLoading) {
        const scrollTop: number = listRef.current.scrollTop
        const scrollHeight: number = listRef.current.scrollHeight;
        const clientHeight: number = listRef.current.clientHeight;

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
        role="user_list"
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

        <IconButton data-testid="button_sort" onClick={userStore.sortUsersLogin}>
          {userStore.radioSort ? "z-a" : "a-z"}
          <SortIcon sx={{marginLeft: "10px"}}/>
        </IconButton>

        <List>
          {userStore.users.map((el: TUser) => {
            return (
              <Fragment key={uuidv4()}>
                <ListItem data-testid="user_item">
                  <ListItemAvatar>
                    <Avatar alt="Аватар" src={el.avatar_url} />
                  </ListItemAvatar>

                  {/* Открытие события редактирования */}
                  {userStore.isEditing && el.login === userStore.editingUser.login ?
                  (
                    <>
                      <TextField
                        data-testid="item_input"
                        fullWidth
                        defaultValue={userStore.inputLogin}
                        onBlur={(e) =>{
                          userStore.inputLogin = e.target.value
                        }}
                      />

                      <IconButton data-testid="button_save" className={styles.save_button} onClick={userStore.handleSave}>
                        <CheckCircleIcon className={styles.icon}/>
                      </IconButton>
                    </>
                  ) :
                  (
                    <>
                      <ListItemText primary={el.login} />

                      <Tooltip title="Редактировать">
                        <IconButton data-testid="button_edit" className={styles.edit_button} onClick={(e) => userStore.handleEdit(el)}>
                          <EditIcon className={styles.icon} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Удалить">
                        <IconButton data-testid="button_delete" className={styles.delete_button} onClick={(e) => userStore.handleDelete(el)}>
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

          {/* Загрузка при ожидании данных */}
          {userStore.isLoading ? (
            <Box data-testid='loader' sx={{ textAlign: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          ): ""}
        </List>
      </Box>
    </Box>
  )
})
