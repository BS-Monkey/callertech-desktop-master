/* eslint-disable jsx-a11y/no-autofocus */
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";
import checkLogin from "../redux/actionCreators/thunk/checkLogin";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  logo: {
    width: 320,
    marginBottom: 50
  }
}));
const Login = () => {
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");
  const dispatch = useDispatch();

  const classes = useStyles();

  const handleLogin = ev => {
    ev.preventDefault();
    dispatch(checkLogin(username, password));
    return false;
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img className={classes.logo} alt="logo" src="assets/images/logo.png" />
        <form noValidate onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            value={username}
            onChange={e => updateUsername(e.target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={e => updatePassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
// let mapStateToProps = ({ userdata }) => ({ userdata });
// let mapDispatchToProps = dispatch => ({});
// connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Login);
