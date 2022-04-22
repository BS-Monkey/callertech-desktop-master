import store from "../redux/store";
import changeLoading from "../redux/actionCreators/changeLoading";

export const start = () => {
  store.dispatch(changeLoading(1));
};
export const stop = () => {
  store.dispatch(changeLoading(0));
};
export default { start, stop };
