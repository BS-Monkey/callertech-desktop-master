import React, { useState } from "react";
import { makeStyles, Button } from "@material-ui/core";

const useStyles = makeStyles({
  listLess: {},
  listMore: {},
  item: {
    margin: 5,
    display: "inline-block",
    padding: "5px 10px",
    border: "rgba(0,0,0,0.4) 2px solid",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    cursor: "pointer"
  }
});

const ExpandableTags = ({ list }) => {
  const [more, setMore] = useState(0);
  const MAX = 3;
  const classes = useStyles();
  return (
    <div className={more ? classes.listMore : classes.listLess}>
      {list.slice(0, more ? list.length : MAX).map(item => (
        <div className={classes.item} key={item}>
          {item}
        </div>
      ))}
      <If condition={list.length > MAX}>
        <div
          className={classes.item}
          style={{ color: "#f37524", borderColor: "#f37524" }}
          onClick={() => {
            setMore(!more);
          }}
        >
          {more ? "Show Less" : "Show More"}
        </div>
      </If>
    </div>
  );
};
export default ExpandableTags;
