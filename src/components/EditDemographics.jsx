import React, { useEffect, useState, Fragment } from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Grid,
} from "@material-ui/core";
import { Edit as EditIcon } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import updateDemographics from "../redux/actionCreators/thunk/updateDemographics";
import APIManager from "../Managers/APIManager";
import addNotes from "../redux/actionCreators/addNotes";
import updateActiveCampaign from "../redux/actionCreators/updateActiveCampaign";

const useStyles = makeStyles({
  displayBlock: {
    display: "block !important",
  },
});

const EditDemographics = ({
  callerdetails,
  extra_details,
  phonenumber,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [misc, setMisc] = useState("");
  const [company_name, setCompanyName] = useState("");
  const savedNotes = useSelector((state) => state.notes[phonenumber] || {});
  const [notes, setNotes] = useState("");
  const [wasPaused, setWasPaused] = useState(false);
  const dispatch = useDispatch();
  const paused = useSelector(({ phone }) => phone.paused);
  const updateData = () => {
    console.log("updateData", { callerdetails });
    if (!callerdetails) {
      setName("");
      setAge("");
      setGender("");
      setWebsite("");
      setCompanyName("");
      setEmail("");
      setMisc("");
      setNotes("");
      return;
    }
    if (callerdetails.default_name) {
      setName(callerdetails.default_name);
    }
    if (callerdetails.age || callerdetails.fc_age) {
      setAge(callerdetails.age || callerdetails.fc_age);
    }
    if (callerdetails.gender || callerdetails.fc_gender) {
      setGender(callerdetails.gender || callerdetails.fc_gender);
    }
    if (callerdetails.fc_website) {
      setWebsite(callerdetails.fc_website);
    }
    if (callerdetails.company_name) {
      setCompanyName(callerdetails.company_name);
    }
    if (extra_details && extra_details.email) {
      setEmail(extra_details.email);
    }
    if (extra_details && extra_details.website_url) {
      setWebsite(extra_details.website_url);
    }
    if (extra_details && extra_details.company_name) {
      setCompanyName(extra_details.company_name);
    }
    if (extra_details && extra_details.misc) {
      setMisc(extra_details.misc);
    }
    if (savedNotes) {
      setNotes(savedNotes.text || "");
    }
  };
  useEffect(() => {
    updateData;
  }, [callerdetails]);

  // useEffect(()=>{
  //   setWasPaused(paused)
  // }, [paused])
  const handleClose = () => {
    setOpen(false);
    if (!wasPaused) {
      dispatch(updateActiveCampaign({ paused: 0 }));
    }
  };

  const handleSave = () => {
    let data = {};
    if (name) data.name = name;
    if (age) data.age = age;
    if (gender) data.gender = gender;
    if (email) data.email = email;
    if (website) data.website = website;
    if (company_name) data.company_name = company_name;
    if (Object.keys(data).length) {
      dispatch(updateDemographics(phonenumber, data));
    }
    if (notes || savedNotes.text) {
      APIManager.saveNotes(phonenumber, notes).then((success) => {
        if (success) dispatch(addNotes({ [phonenumber]: { text: notes } }));
      });
    }
    handleClose();
  };

  const handleOpen = () => {
    setOpen(true);
    updateData();
    if (!paused) {
      dispatch(updateActiveCampaign({ paused: 1 }));
      setWasPaused(false);
    }
  };

  return (
    <Fragment>
      <Tooltip title="Edit Data">
        <span>
          <IconButton {...props} onClick={handleOpen}>
            <EditIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog fullWidth maxWidth="sm" onClose={handleClose} open={open}>
        <DialogTitle>Edit Data</DialogTitle>
        <DialogContent>
          <Grid spacing={1} container>
            <Grid item xs={12} sm={6}>
              <div>
                <TextField
                  id="outlined-basic"
                  label="Name"
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  type="text"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  value={name}
                />
              </div>
              <div>
                <TextField
                  id="outlined-basic"
                  label="Age"
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  type="text"
                  onChange={(e) => {
                    setAge(e.target.value);
                  }}
                  value={age}
                />
              </div>
              <div>
                <TextField
                  id="outlined-basic"
                  label="Gender"
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  type="text"
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                  value={gender}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div>
                <TextField
                  id="outlined-basic"
                  label="Company Name"
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  type="text"
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                  }}
                  value={company_name}
                />
              </div>
              <div>
                <TextField
                  id="outlined-basic"
                  label="Website"
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  type="url"
                  onChange={(e) => {
                    setWebsite(e.target.value);
                  }}
                  value={website}
                />
              </div>
              <div>
                <TextField
                  id="outlined-basic"
                  label="Email"
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  type="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div>
                <TextField
                  id="outlined-basic"
                  label="Notes"
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={6}
                  onChange={(e) => {
                    setNotes(e.target.value);
                  }}
                  value={notes}
                />
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default EditDemographics;
