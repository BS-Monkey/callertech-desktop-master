import { combineReducers } from "redux";
import callerdetails from "./callerdetails";
import calldata from "./calldata";
import app from "./app";
import sip from "./sip.reducer";
import flags from "./flags";
import notes from "./notes";
import email from "./email";
import addresses from "./addresses";
import recordings from "./recordings";
import calls from "./calls";
import recentcalls from "./recentcalls";
import hotfiles from "./hotfiles";
import notifications from "./notifications";
import messages from "./messages";
import tabs from "./tabs";
import voicemail from "./voicemail";
import scheduled_calls from "./scheduled_calls";
import call_logs from "./call_logs";
import sms_logs from "./sms_logs";
import contacts_list from "./contacts_list";
import campaigns from "./campaigns";
import campaign_items from "./campaign_items";
import phone from "./phone";
import queues from "./queues";
import conference from "./conference";
import { agents } from "./agents";
import { SettingsReducer } from "../settings/settings.reducer";
import { profilePictureReducer } from "../profilePictures/profilePictures.reducer";
import { autodetectionReducer } from "../autodetection/autodetection.reducer";

export const reducer = combineReducers({
  callerdetails,
  calldata,
  app,
  flags,
  notes,
  sip,
  extra_details: email,
  addresses,
  recordings,
  calls,
  recentcalls,
  hotfiles,
  notifications,
  messages,
  tabs,
  voicemail,
  scheduled_calls,
  call_logs,
  sms_logs,
  contacts_list,
  campaigns,
  campaign_items,
  phone,
  queues,
  conference,
  agents,
  settings: SettingsReducer,
  profilePicture: profilePictureReducer,
  autodetection: autodetectionReducer,
});
