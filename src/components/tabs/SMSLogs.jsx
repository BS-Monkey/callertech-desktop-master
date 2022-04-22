import React from "react";
import { useSelector } from "react-redux";
import {
  AppBar,
  Grid,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { ChatList } from "react-chat-elements";
import { Conversation } from "../Conversation";
import { NewMessage } from "../NewMessage";
import { conversationsSelector } from "../../redux/selectors/conversations";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: "12px",
  },
  cardContent: {
    padding: "15px",
    paddingBottom: "10px !important",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  txtMessageWindow: {
    height: "400px",
    overflow: "auto",
  },
  normalBubble: {
    padding: "10px 20px",
    border: "1px solid #efefef",
    margin: "3px 10px",
    display: "inline-block",
    background: "#ff8d47",
    borderRadius: "7px",
    maxWidth: "70%",
    color: "#fff",
  },
  isMeBubble: {
    padding: "10px 20px",
    border: "1px solid #efefef",
    margin: "3px 10px",
    display: "inline-block",
    background: "#efefef",
    borderRadius: "7px",
    maxWidth: "70%",
    float: "right",
    color: "#333",
  },
  msgWhen: {
    fontSize: "12px",
  },
  bubbleWrap: {
    clear: "both",
  },
  title2: {
    fontSize: "14px",
  },
  pos: {
    marginBottom: 12,
  },
  btnActionsRow: {
    display: "flex",
    textAlign: "right",
    justifyContent: "space-between",
  },
  header: {
    marginBottom: "10px",
  },
  groups: {
    height: "calc(100vh - 235px)",
    overflowY: "auto",
  },
  sidebar: {
    backgroundColor: "#fff",
    boxShadow: "rgba(0,0,0,0.5) 1px 0 10px",
  },
  title: {
    flexGrow: 1,
  },
});

const SMSLogs = () => {
  const classes = useStyles();
  const conversations = useSelector(conversationsSelector);
  const [selectedNum, setSelectedNum] = useState(null);
  return (
    <div>
      <Grid container className="" spacing={0}>
        <Grid item xs={4} className={classes.sidebar}>
          <AppBar color="default" position="sticky" className={classes.header}>
            <Toolbar variant="dense">
              <Typography variant="h6" className={classes.title}>
                Recent SMS
              </Typography>
              <NewMessage />
            </Toolbar>
          </AppBar>
          <ChatList
            className={classes.groups}
            onClick={(chat) => setSelectedNum(chat.phonenumber)}
            dataSource={conversations}
          />
        </Grid>
        <Grid item xs={8}>
          <If condition={selectedNum}>
            <Conversation phonenumber={selectedNum} />
          </If>
        </Grid>
      </Grid>
    </div>
  );
};

export default SMSLogs;
