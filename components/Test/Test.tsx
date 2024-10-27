import React, { useEffect, useState, useRef, Fragment } from "react";
import { Box, List, ListItem, ListItemText, Typography, Divider, CircularProgress, ListItemAvatar, Avatar} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

const token: string = "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"

async function getUsers (endpoint: string) {
  return fetch(endpoint, {
    headers: {
      Authorization: `token ${token}`
    }
  }).then((res) => res.json())
}

export function Test () {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [startUser, setStartUser] = useState(0)

  const listRef = useRef(null)
  const firstRender = useRef(true)

  const endpoint: string = `https://api.github.com/users?per_page=10&since=${startUser}`

  const changeStateUsers = () => {
    setIsLoading(true)
      setTimeout(() => {
        getUsers(endpoint).then((data) => {
          setUsers(prevUsers => prevUsers.concat(data))
          setStartUser(startUser + 10)
          setIsLoading(false)
        })
      }, 1000)
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
    } else {
      changeStateUsers()
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!isLoading) {
        const scrollTop = listRef.current.scrollTop
        const scrollHeight = listRef.current.scrollHeight;
        const clientHeight = listRef.current.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight) {
          changeStateUsers()
        }
      }
    }

    listRef.current.addEventListener("scroll", handleScroll)
    return () => listRef.current.removeEventListener("scroll", handleScroll)
  }, [startUser])

  console.log(users)

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
          width: '400px',
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
        <List>
          {users.map((el) => {
            return (
              <Fragment key={uuidv4()}>
                <ListItem >
                  <ListItemAvatar>
                    <Avatar alt="Аватар" src={el.avatar_url} />
                  </ListItemAvatar>

                  <ListItemText primary={el?.login} />
                </ListItem>
                <Divider />
              </Fragment>
            )
          })}
          {isLoading ? (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          ): ""}
        </List>
      </Box>
    </Box>
  )
}
