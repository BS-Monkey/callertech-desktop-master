import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfilePicture } from "../redux/profilePictures/profilePicture.actions";
import { profilePictureSelector } from "../redux/profilePictures/profilePicture.selector";
import { Avatar as MaterialAvatar } from "@material-ui/core";
import Utils from "../utils";

export const Avatar = ({ avatar, defaultName, className }) => {
  return (
    <MaterialAvatar className={className} src={avatar} alt={defaultName}>
      {!avatar && defaultName ? Utils.initials(defaultName) : ""}
    </MaterialAvatar>
  );
};
