import React, { Component } from "react";
import APIManager from "../Managers/APIManager";
class AppErrorBoundry extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    APIManager.log({ error });
    console.log(error);
    return { hasError: true };
  }

  componentDidCatch() {
    if (!window.isDev) {
      // setTimeout(() => {
      //   window.location.reload();
      // }, 500);
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
export default AppErrorBoundry;
