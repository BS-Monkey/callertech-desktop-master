import React, { Component, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  makeStyles,
  Container,
  Paper,
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  InputBase,
  TableFooter,
  TablePagination,
  Tooltip,
  Modal,
} from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import fetchContactsList from "../../redux/actionCreators/thunk/fetchContactsList";
import { KEYS } from "../../redux/reducers/tabs";
import {
  CallMade as CallMadeIcon,
  CallReceived as CallReceivedIcon,
  CallMissed as CallMissedIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  AssignmentInd,
} from "@material-ui/icons";
import moment from "moment";
import SMSBoxInput from "./SMSBoxInput";


const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: '12px',
  },
  cardContent: {
    padding: '15px',
    paddingBottom: '10px !important'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  txtMessageWindow: {
    height: '400px',
    overflow: 'auto',
  },
  normalBubble: {
    padding: '10px 20px',
    border: '1px solid #efefef',
    margin: '3px 10px',
    display: 'inline-block',
    background: '#ff8d47',
    borderRadius: '7px',
    maxWidth: '70%',
    color: '#fff',
  },
  isMeBubble:{
    padding: '10px 20px',
    border: '1px solid #efefef',
    margin: '3px 10px',
    display: 'inline-block',
    background: '#efefef',
    borderRadius: '7px',
    maxWidth: '70%',
    float: 'right',
    color: '#333',
  },
  msgWhen: {
    fontSize: '12px',
  },
  bubbleWrap: {
    clear: 'both',
  },
  title2: {  
    fontSize: '14px',
  },
  title: {  
    margin: '0',
    padding: '1em',
  },
  topH1: {
    paddingTop: '10px',
    marginTop: '0',
  },
  pos: {
    marginBottom: 12,
  },
  btnActionsRow: {
    display: 'flex',
    textAlign: 'right',
    justifyContent: 'space-between',
  }
});

function ContactItem(props) {
  const classes = useStyles();
  const itemContact = props.contact;
  let handleLangChange = () => { 
    console.log('inner handleLangChange', props.onViewMore)
    props.onViewMore(itemContact);            
  }
  return (
    <Card className={classes.root} variant="outlined">
      <CardContent className={classes.cardContent}>
        <Typography className={classes.title2} color="textSecondary" gutterBottom>
          {itemContact.phonenumber}
        </Typography>
        <Typography variant="h5" component="h2">
          {(itemContact.firstName) + ' ' + (itemContact.lastName)}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {itemContact.email}
        </Typography>
      </CardContent>
    </Card>
  );
}

const ContactsList = ({ value }) => {
  console.log('LOADED CONTACTS LIST')
  const classes = useStyles();
  let page = 1;
  const contacts_list = useSelector(({ contacts_list }) => contacts_list);
  const [compState, setNumber] = useState({
    lastRun: (new Date()).getTime(),
    shouldLoad: false
  });
  const did = useSelector(({ sip, app }) => sip.data[app.num]);

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setNumber({
      lastRun: (new Date()).getTime(),
      shouldLoad: compState.shouldLoad
    });
  }, [contacts_list]);
  let refetch = false;
  useEffect(() => {
    if (value == KEYS.indexOf("contacts_list") || compState.shouldLoad) refetch = true;
    if (refetch && did && did.caller_id) {
      compState.shouldLoad = false;
      dispatch(fetchContactsList(page));
    }
  }, [page, did, value]);
  useEffect(() => {
    if (compState.shouldLoad) refetch = true;
    if (refetch && did && did.caller_id) {
      compState.shouldLoad = false;
      dispatch(fetchContactsList(page));
    }
  }, [compState, open]);
  let handleViewMore = (group) => {
    setNumber({
      shouldLoad: false
    });
    console.log('outer DetailsFor', group)
  } 
  

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <Container>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div>dddd</div>
    </Modal>
      <h1 style={{ display: "flex" }}>
        <span>Contacts</span>
      <Button 
          style={{ marginLeft: "auto" }} onPress={handleOpen}
          variant="contained"
          color="primary"
          size="large">
          Add Contact
        </Button>
      </h1>
      {contacts_list.data.map((contact) => (
        <ContactItem key={contact.id} contact={contact} onViewMore={handleViewMore}></ContactItem>
      ))}
    </Container>
  );
};

export default ContactsList;
