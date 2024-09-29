import { useState, useEffect } from "react";
import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import iS from "./logo-dark.png";
import Avatar from "@material-ui/core/Avatar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import image from "./1c95cb55-d42d-4776-9d79-2752cff7f80e_0.jpeg";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress, TextField, MenuItem } from "@material-ui/core";
import { DropzoneArea } from 'material-ui-dropzone';
import { common } from '@material-ui/core/colors';
import Clear from '@material-ui/icons/Clear';
import axios from "axios";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: common.white,
    '&:hover': {
      backgroundColor: '#ffffff7a',
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    color: "#082567",
    fontSize: "25px",
    fontWeight: 1000,
    backgroundColor: '#F8F0E3',
    textShadow: '1.1px 1.1px #36454F'
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  media: {
    height: 400,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "4em 1em 0 1em",
  },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    minHeight: "100vh",
    marginTop: "8px",
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    height: 500,
    backgroundColor: 'transparent',
    boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
    borderRadius: '15px',
  },
  imageCardEmpty: {
    height: 'auto',
  },
  buttonGrid: {
    maxWidth: "416px",
    width: "100%",
  },
  detail: {
    backgroundColor: '#F8F0E3',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appbar: {
    background: '#F8F0E3',
    boxShadow: 'none',
    color: '#082567'
  },
  loader: {
    color: '#082567 !important',
  },
  patientDetails: {
    marginBottom: '16px',
    color:'white'
  }
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [patientSymptoms, setPatientSymptoms] = useState('');

  const sendFile = async () => {
    if (!selectedFile || !patientName || !patientAge || !patientGender) {
      alert("Please fill in all required fields and upload an image.");
      return;
    }

    setIsloading(true); // Show loading spinner

    let formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", patientName);
    formData.append("age", patientAge);
    formData.append("gender", patientGender);
    formData.append("symptoms", patientSymptoms); // Optional

    try {
      let res = await axios.post(process.env.REACT_APP_API_URL, formData);
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Error uploading the image:", error);
    } finally {
      setIsloading(false); // Hide loading spinner
    }
  };

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
    setPatientName('');
    setPatientAge('');
    setPatientGender('');
    setPatientSymptoms('');
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Brain Tumour Diagnosis 
          </Typography>
          <div className={classes.grow} />
          <Avatar src={iS}></Avatar>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >

          {/* Patient Details Section */}
          <Grid item xs={12} className={classes.patientDetails}>
            <TextField
              fullWidth
              label="Patient Name"
              variant="outlined"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Age"
              variant="outlined"
              type="number"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
              style={{ marginTop: '16px' }}
            />
            <TextField
              fullWidth
              label="Gender"
              select
              variant="outlined"
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value)}
              style={{ marginTop: '16px' }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Symptoms"
              variant="outlined"
              value={patientSymptoms}
              onChange={(e) => setPatientSymptoms(e.target.value)}
              style={{ marginTop: '16px' }}
            />
          </Grid>

          {/* Image Upload Area */}
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              {image && (
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={preview}
                    component="image"
                    title="Uploaded MRI"
                  />
                </CardActionArea>
              )}
              {!image && (
                <CardContent className={classes.content}>
                  <DropzoneArea
                    acceptedFiles={['image/*']}
                    dropzoneText={<span style={{ color: 'black' }}>Drag and drop an image of a Brain MRI scan to process diagnosis. Or click to upload.</span>}                    
                    onChange={onSelectFile}
                  />
                </CardContent>
              )}
              {data && (
                <CardContent className={classes.detail}>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table className={classes.table} size="small" aria-label="simple table">
                      <TableHead className={classes.tableHead}>
                        <TableRow className={classes.tableRow}>
                          <TableCell className={classes.tableCell1}>Label:</TableCell>
                          <TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className={classes.tableBody}>
                        <TableRow className={classes.tableRow}>
                          <TableCell component="th" scope="row" className={classes.tableCell}>
                            {data.label}
                          </TableCell>
                          <TableCell align="right" className={classes.tableCell}>{(parseFloat(data.confidence) * 100).toFixed(2)}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}
              <CardContent>
                {isLoading ? (
                  <CircularProgress className={classes.loader} />
                ) : (
                  <ColorButton className={classes.clearButton} onClick={sendFile}>
                    Submit
                  </ColorButton>
                )}
                <ColorButton className={classes.clearButton} onClick={clearData} style={{ marginTop: '16px' }}>
                  Clear
                </ColorButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};
