import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { CSVLink } from "react-csv";
import {
  fetchStates,
  fetchDistricts,
  fetchBlocks,
  fetchSchools,
  fetchClasses,
} from "../api/filterStudentDetails";

const DownloadCsv = ({ open, handleClose, rowData }) => {
  const [dropdownValues, setDropdownValues] = useState({
    stateDropdown: null,
    districtDropdown: null,
    blockDropdown: null,
    schoolNameDropdown: null,
    classNameDropdown: null,
  });

  const [downloadType, setDownloadType] = useState("Student Details");
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);

  const [csvData, setCsvData] = useState([]);
  const [csvFilename, setCsvFilename] = useState("student_details.csv");

  // Fetch states, districts, and blocks initially
  useEffect(() => {
    const loadStates = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const states = await fetchStates(token);
        setStateOptions(states);
      } catch (error) {
        console.error("Error loading states:", error);
      }
    };

    const loadAllDistricts = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const districts = await fetchDistricts(token);
        setDistrictOptions(districts);
      } catch (error) {
        console.error("Error loading districts:", error);
      }
    };

    const loadAllBlocks = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const blocks = await fetchBlocks(token);
        setBlockOptions(blocks);
      } catch (error) {
        console.error("Error loading blocks:", error);
      }
    };

    const loadAllSchool = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const schools = await fetchSchools(token);
        setSchoolOptions(schools);
      } catch (error) {
        console.error("Error loading blocks:", error);
      }
    };

    loadStates();
    loadAllDistricts();
    loadAllBlocks();
    loadAllSchool();
  }, []);

  // Update districts based on selected state
  useEffect(() => {
    const loadDistricts = async () => {
      if (!dropdownValues.stateDropdown) return; // Check for selected state
      try {
        const token = sessionStorage.getItem("token");
        const districts = await fetchDistricts(token, dropdownValues.stateDropdown);
        setDistrictOptions(districts);

        const blocks = await fetchBlocks(token, dropdownValues.stateDropdown);
        setBlockOptions(blocks);

        const schools = await fetchSchools(token, dropdownValues.stateDropdown);
        setSchoolOptions(schools);

      } catch (error) {
        console.error("Error loading districts:", error);
      }
    };
    loadDistricts();
  }, [dropdownValues.stateDropdown]);

  // Update blocks based on selected district
  useEffect(() => {
    const loadBlocks = async () => {
      if (!dropdownValues.districtDropdown) return; // Check for selected district
      try {
        const token = sessionStorage.getItem("token");

        const blocks = await fetchBlocks(token,dropdownValues.stateDropdown, dropdownValues.districtDropdown);
        setBlockOptions(blocks);
        
      } catch (error) {
        console.error("Error loading blocks:", error);
      }
    };
    loadBlocks();
  }, [dropdownValues.districtDropdown]);

  // Update schools based on selected block or fetch all if none is selected
  useEffect(() => {
    const loadSchools = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const schools = await fetchSchools(token, dropdownValues.stateDropdown, dropdownValues.districtDropdown, dropdownValues.blockDropdown);
        setSchoolOptions(schools);
      } catch (error) {
        console.error("Error loading schools:", error);
      }
    };
    loadSchools();
  }, [dropdownValues.blockDropdown]);

  // Fetching classes based on selected school
  useEffect(() => {
    const loadClasses = async () => {
      if (!dropdownValues.schoolNameDropdown) return; // Only fetch if a schoolNameDropdown is selected
      try {
        const token = sessionStorage.getItem("token");
        const classes = await fetchClasses(token, dropdownValues.schoolNameDropdown);
        console.log("classes", classes);
        setClassOptions(classes);
      } catch (error) {
        console.error("Error loading classes:", error);
      }
    };
    loadClasses();
  }, [dropdownValues.schoolNameDropdown]);

  const handleDownload = () => {
    let filteredData = rowData;
    console.log("filteredData", filteredData);

    // Filter data based on selected dropdowns
    if (dropdownValues.stateDropdown) {
      filteredData = filteredData.filter(
        (item) => item.state === dropdownValues.stateDropdown
      );
    }
    if (dropdownValues.districtDropdown) {
      filteredData = filteredData.filter(
        (item) => item.district === dropdownValues.districtDropdown
      );
    }
    if (dropdownValues.blockDropdown) {
      filteredData = filteredData.filter(
        (item) => item.block === dropdownValues.blockDropdown
      );
    }
    if (dropdownValues.schoolNameDropdown) {
      filteredData = filteredData.filter(
        (item) => item.schoolName === dropdownValues.schoolNameDropdown
      );
    }
    if (dropdownValues.classNameDropdown) {
      filteredData = filteredData.filter(
        (item) => item.className === dropdownValues.classNameDropdown
      );
    }

    if (!filteredData || filteredData.length === 0) {
      alert("No data available for the selected filters.");
      return false;
    }

    let dataToDownload = [];
    let filename = "student_details.csv";

    if (downloadType === "Student Details") {
      // Download all student details
      dataToDownload = filteredData.map((student) => ({
        "User ID": student.userId,
        Name: student.name,
        Username: student.username,
        Email: student.email,
        Mobile: student.mobile,
        Gender: student.gender,
        "Date of Birth": student.dateOfBirth,
        Role: student.role,
        Board: student.board,
        Password: student.password,
        "Created By": student.createdBy,
        "Updated By": student.updatedBy,
        "Student Id": student.studentId,
        "Class Name": student.className,
        Groups: student.groups.join(", "),
        Religion: student.religion,
        "School UDISE": student.schoolUdise,
        Caste: student.caste,
        "Annual Income": student.annualIncome,
        "Mother's Education": student.motherEducation,
        "Father's Education": student.fatherEducation,
        "Mother's Occupation": student.motherOccupation,
        "Father's Occupation": student.fatherOccupation,
        "Number of Siblings": student.noOfSiblings,
        "Student Enroll ID": student.studentEnrollId,
        Promotion: student.promotion,
        School: student.schoolName,
        State: student.state,
        District: student.district,
        Block: student.block,
      }));
      filename = "filtered_student_details.csv";
    } else if (downloadType === "Username and Password") {
      // Download only username, name, and password
      dataToDownload = filteredData.map((student) => ({
        Name: student.name,
        Username: student.username,
        Password: student.password,
      }));
      filename = "filtered_credentials.csv";
    }

    // Set CSV data and filename
    setCsvData(dataToDownload);
    setCsvFilename(filename);
  };

  const handleChange = (event, value, name) => {
    setDropdownValues({ ...dropdownValues, [name]: value });
  };

  const handleRadioChange = (event) => {
    setDownloadType(event.target.value);
  };

  const handleModalClose = () => {
    setDropdownValues({
      stateDropdown: null,
      districtDropdown: null,
      blockDropdown: null,
      schoolNameDropdown: null,
      classNameDropdown: null,
    });
    setDownloadType("Student Details");
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: {
            xs: "90%",
            sm: "70%",
            md: "400px",
          },
          bgcolor: "background.paper",
          border: "1px solid #cad0d8",
          borderRadius: "12px",
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
          maxHeight: "90vh",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" component="h2">
            Download CSV
          </Typography>
          <IconButton onClick={handleModalClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Select Download Type</FormLabel>
          <RadioGroup
            aria-label="download-type"
            name="download-type"
            value={downloadType}
            onChange={handleRadioChange}
            sx={{
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            <FormControlLabel
              value="Student Details"
              control={<Radio />}
              label="Student Details"
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
            />
            <FormControlLabel
              value="Username and Password"
              control={<Radio />}
              label="Username and Password"
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
            />
          </RadioGroup>
        </FormControl>

        {/* Dropdown for States */}
        <Box sx={{ mb: 2 }}>
          <Autocomplete
            disablePortal
            options={stateOptions}
            value={dropdownValues.stateDropdown}
            onChange={(event, value) => handleChange(event, value, "stateDropdown")}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Select State" />
            )}
          />
        </Box>

        {/* Dropdown for Districts */}
        <Box sx={{ mb: 2 }}>
          <Autocomplete
            disablePortal
            options={districtOptions}
            value={dropdownValues.districtDropdown}
            onChange={(event, value) => handleChange(event, value, "districtDropdown")}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Select District" />
            )}
          />
        </Box>

        {/* Dropdown for Blocks */}
        <Box sx={{ mb: 2 }}>
          <Autocomplete
            disablePortal
            options={blockOptions}
            value={dropdownValues.blockDropdown}
            onChange={(event, value) => handleChange(event, value, "blockDropdown")}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Select Block" />
            )}
          />
        </Box>

        {/* Dropdown for Schools */}
        <Box sx={{ mb: 2 }}>
          <Autocomplete
            disablePortal
            options={schoolOptions}
            value={dropdownValues.schoolNameDropdown} // Manage this state accordingly
            onChange={(event, value) => handleChange(event, value, "schoolNameDropdown")}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Select School" />
            )}
          />
        </Box>

        {/* Dropdown for Class */}
        <Box sx={{ mb: 2 }}>
          <Autocomplete
            disablePortal
            options={classOptions}
            value={dropdownValues.classNameDropdown}
            onChange={(event, value) => handleChange(event, value, "classNameDropdown")}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Select Class" />
            )}
          />
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleModalClose}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
          <CSVLink
            data={csvData}
            filename={csvFilename}
            onClick={handleDownload}
          >
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Download
            </Button>
          </CSVLink>
        </Box>
      </Box>
    </Modal>
  );
};

export default DownloadCsv;