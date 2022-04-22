import React, { useState } from "react";
import { Tooltip, Button, IconButton } from "@material-ui/core";
import { PhoneDisabledSharp } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import toggleDNC from "../../redux/actionCreators/thunk/toggleDNC";
import { useEffect } from "react";

const DNCButton = ({ phonenumber, icon = false, dnc = null }) => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.campaign_items.data);
  const [item, setItem] = useState(null);
  useEffect(() => {
    if (dnc === null && items)
      Object.keys(items).forEach(key => {
        if (items[key].phonenumber == phonenumber) {
          setItem(items[key]);
        }
      });
  }, [phonenumber, items]);
  const handleToggle = () => {
    dispatch(toggleDNC(phonenumber));
  };
  const isDNC = dnc === null ? item && item.dnc : dnc;
  return (
    <Tooltip
      title={isDNC ? "Remove From Do-Not-Call List" : "Add to Do-Not-Call List"}
    >
      <span>
        {icon ? (
          <IconButton
            color={isDNC ? "secondary" : "primary"}
            onClick={handleToggle}
            size="small"
          >
            <PhoneDisabledSharp />
          </IconButton>
        ) : (
          <Button
            startIcon={<PhoneDisabledSharp />}
            color={isDNC ? "secondary" : "primary"}
            onClick={handleToggle}
          >
            {isDNC ? "Remove From" : "Add to"} DNC
          </Button>
        )}
      </span>
    </Tooltip>
  );
};
export default DNCButton;
