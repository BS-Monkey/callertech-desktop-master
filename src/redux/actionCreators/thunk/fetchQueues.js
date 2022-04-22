import APIManager from "../../../Managers/APIManager";
import { addQueues, clearQueues } from "../QueuesActions";

const fetchQueues = () => (dispatch) => {
  dispatch(clearQueues());
  APIManager.fetchQueues().then((queues) => {
    if (queues.status == "success") {
      dispatch(addQueues(queues.data));
    }
  });
};
window.fetchQueues = fetchQueues;
export default fetchQueues;
