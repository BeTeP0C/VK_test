import React, { useEffect, useState } from "react";
// import "@sendbird/uikit-react"
// import styles from "./styles.module.scss"
import Button from '@mui/material/Button';
import { Box, List, ListItem, ListItemText} from "@mui/material";
// import {FixedSizeList} from "react-window"

export function Test () {
  const [joke, setJoke] = useState([])
  let a:any = []

  useEffect(() => {
    fetch(`https://api.github.com/users`).then((res) => res.json()).then((data) => {
      // console.log(data)
      // a = data
      setJoke(data)
    })
  }, [])

  console.log(joke)

  return (
    <Box sx={{width: 500, height: 400, bgcolor:"background.paper"}}>
      <List sx={{maxHeight: 200, width: "100%", overflow: "auto", }}>
        {joke.map((el) => {
          return (
            <ListItem>
              <ListItemText primary={el?.login}/>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}
