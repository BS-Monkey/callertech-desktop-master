import store from "../store";
import changeAppError from "../actionCreators/changeAppError";

const AppError = error => {
  store.dispatch(changeAppError(error));
};
export default AppError;
