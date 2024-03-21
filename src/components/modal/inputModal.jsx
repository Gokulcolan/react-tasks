import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { DropDownData } from "../common/commonData";
import axios from "axios";

export default function InputModal() {
  const [open, setOpen] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [schemaValue, setSchemaValue] = useState("");
  const [newSchema, setNewSchema] = useState([]);
  const [dropDownData, setDropDownData] = useState(DropDownData);

  const handleGetValue = (e) => {
    setSegmentName(e.target.value);
  };

  const handleChange = (event) => {
    console.log(event, "e");
    setSchemaValue(event.target.value);
  };

  const addNewSchema = () => {
    if (schemaValue !== "") {
      setNewSchema([...newSchema, schemaValue]);
      setDropDownData(
        dropDownData.filter((option) => {
          console.log(option, "option");
          return option.Value !== schemaValue;
        })
      );
      setSchemaValue("");
    } else {
      alert("Please select Add Schema Value");
    }
  };

  const handleNewChange = (event, index) => {
    const updatedNewSchema = [...newSchema];
    updatedNewSchema[index] = event.target.value;
    setNewSchema(updatedNewSchema);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSegmentName("");
    setSchemaValue("");
    setNewSchema([]);
    setDropDownData(DropDownData);
  };

  let filteredData = DropDownData.filter((e) =>
    newSchema.some((val) => val == e.Value)
  );

  let schemaArray = filteredData?.map((val) => {
    return {
      [val.Value]: val.Label,
    };
  });

  // iam not able to send data to server its getting cors error

  const handleSave = () => {
    // this webhookUrl iam generated from your reference site

    const webhookUrl =
      "https://webhook.site/f489121b-82ac-42a1-a33d-ba8909f6e6fb";

    const data = {
      segment_name: segmentName,
      schema: schemaArray,
    };

    axios
      .post(webhookUrl, data)
      .then((response) => {
        console.log("Data sent successfully", response.data);
      })
      .catch((error) => {
        console.error("Error sending data", error);
      });
  };

  return (
    <React.Fragment>
      <div className="btnContainer">
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          className="mainBtn"
        >
          Save segment
        </Button>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Enter the name of the segment
        </DialogTitle>
        <TextField
          autoFocus
          id="segmentName"
          label="Segment Name"
          type="text"
          sx={{ width: "250px", margin: "0px 20px" }}
          onChange={handleGetValue}
        />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            To save your segment you need to add the schemas to build the query
          </DialogContentText>
        </DialogContent>

        {newSchema !== ""
          ? newSchema?.map((val, index) => (
              <Box
                key={index}
                sx={{
                  width: "250px",
                  marginLeft: "20px",
                  marginBottom: "20px",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id={`schema-select-label-${index}`}>
                    Selected Schema Values
                  </InputLabel>
                  <Select
                    labelId={`schema-select-label-${index}`}
                    value={val}
                    label="Add Schema To Segment"
                    onChange={(e) => {
                      handleNewChange(e, index);
                    }}
                  >
                    {DropDownData?.map((option, index) => (
                      <MenuItem key={index} value={option.Value}>
                        {option.Label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ))
          : null}
        <br />

        <Box sx={{ width: "250px", marginLeft: "20px" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Add Schema To Segment
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={schemaValue}
              label="Add Schema To Segment"
              onChange={(e) => handleChange(e)}
            >
              {dropDownData?.map((option, index) => (
                <MenuItem key={index} value={option.Value}>
                  {option.Label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <br />
        <div style={{ marginLeft: "20px" }}>
          <Button className="btn" onClick={addNewSchema}>
            + Add New Schema
          </Button>
        </div>
        <br />
        <DialogActions>
          <Button onClick={handleClose} className="cancelBtn">
            Cancel
          </Button>
          <Button onClick={handleSave} className="saveBtn">
            Save the segment
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
