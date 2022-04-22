import { Button, makeStyles, TableCell, TableRow } from "@material-ui/core";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const useStyles = makeStyles({
  drag: {
    background: "#f9e8dd",
  },
});

export const AgentRow = ({
  agent,
  session,
  setOpen,
  onCall,
  onTransfer,
  handleSendMMS,
}) => {
  const classes = useStyles();
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log("accepted files", { acceptedFiles });
    if (acceptedFiles.length) {
      handleSendMMS(acceptedFiles[0], agent.phonenumber);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <TableRow
      {...getRootProps({
        onClick: (ev) => {
          ev.stopPropagation();
        },
      })}
      className={isDragActive ? classes.drag : ""}
    >
      <TableCell>
        <input {...getInputProps()} />
        {agent.name}
      </TableCell>
      <TableCell>{agent.phonenumber}</TableCell>
      <TableCell>{agent.extension}</TableCell>
      <TableCell>
        <If condition={session}>
          <Button
            onClick={() => {
              setOpen(false);
              onTransfer(agent.extension);
            }}
          >
            Transfer
          </Button>
        </If>
        <Button
          onClick={() => {
            setOpen(false);
            onCall(agent.extension);
          }}
        >
          Call
        </Button>
      </TableCell>
    </TableRow>
  );
};
