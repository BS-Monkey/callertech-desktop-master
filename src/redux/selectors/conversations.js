import ReactLinkify from "react-linkify";
import React from "react";
import { createSelector } from "reselect";
import Link from "../../components/Link";
import moment from "moment";
import { formatNational, getPhoneNumber } from "../../utils";
import { agentsSelector } from "./agents";

const getConversationsFromAllMessages = (messages, agents) => {
  return Object.keys(messages)
    .map((phonenumber) => {
      const group = messages[phonenumber];
      if (!group.length) {
        return {
          title: formatNational(phonenumber),
          subtitle: "",
          avatar: "https://callertech.com/images/default_profile.png",
          date: new Date(),
          phonenumber,
          unread: 0,
        };
      }
      const lastMessage = group[group.length - 1];
      const unread = group.reduce((totalUnread, msg) => {
        if (msg.position === "left" && !msg.is_read) {
          console.log("unread message", msg);
          return totalUnread + 1;
        }
        return 0;
      }, 0);

      const agent = agents.find(
        (_agent) => getPhoneNumber(_agent.phonenumber) === phonenumber
      );
      let title = lastMessage.name;
      if (agent) {
        title = agent.name;
      }
      return {
        subtitle: lastMessage.text,
        avatar: lastMessage.otherAvatar,
        date: new Date(group[group.length - 1].date),
        phonenumber,
        unread,
        title,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
};
export const messagesSelector = (state) => state.messages.entities;
export const latestSMSSelector = (state) => state.messages.latest_message_id;
export const messagesIdsSelector = (state) => state.messages.ids;

export const conversationsSelector = createSelector(
  messagesSelector,
  agentsSelector,
  latestSMSSelector,
  messagesIdsSelector,
  getConversationsFromAllMessages
);
export const unreadConversationsSelector = createSelector(
  conversationsSelector,
  (conversations) =>
    conversations.reduce((unread, conversation) => {
      if (conversation.unread) {
        console.log("unread conversation", conversation);
      }
      return unread + conversation.unread;
    }, 0)
);

export const messageGroupSelector = (phonenumber) =>
  createSelector(
    messagesSelector,
    latestSMSSelector,
    (messages) => messages[phonenumber]
  );

export const messageListSelector = (phonenumber) =>
  createSelector(messageGroupSelector(phonenumber), (messages) =>
    messages
      ? messages
          .map((_message) => {
            const message = { ..._message };
            message.date = moment(message.date).toDate();
            if (message.type == "text" && !message.linkified) {
              message.text = (
                <ReactLinkify
                  componentDecorator={(decoratedHref, decoratedText, key) => (
                    <Link href={decoratedHref} key={key}>
                      {decoratedText}
                    </Link>
                  )}
                >
                  {message.text}
                </ReactLinkify>
              );
              message.linkified = true;
            }
            return message;
          })
          .sort((a, b) => (a.date > b.date ? 1 : -1))
      : []
  );
