import React,{useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import SupervisedUserCircleOutlined from '@material-ui/icons/SupervisedUserCircleOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import {  toast } from 'react-toastify';
import { viewProfile , updateProfile } from '../service/profileService';
import { logout } from '../service/authenticationService';
import * as encryptUtil from '../utils/encryptUtil';

export default function Home(props) {
  const classes = useStyles();
  const history = useHistory();
  
  const [firstName,setFirstName] = useState('');
  const [lastName,setLastName] = useState('');
  const [userName,setUserName] = useState('');
  const [password,setPassword] = useState('');
  const [reTypePassword,setReTypePassword] = useState('');
  const [emailId,setEmailId] = useState('');
  const [phoneNo,setPhoneNo] = useState(0);
  const [dateOfBirth,setDateOfBirth] = useState('2017-05-24');
  const [company,setCompany] = useState('');
  const [experience,setExperience] = useState(0);
  const [showValidateError,setShowValidateError] = useState(false);
  const [passwordError,setPasswordError] = useState(false);
  const [emailError,setEmailError] = useState(false);
  const [userExistError,setUserExistError] = useState("");
  const [isDisable,setIsDisable] = useState(true);
  const [showLoader,setShowLoader] = useState(true);

  useEffect(() =>{
    viewProfile().then((response) =>{
        if(response?.userData){
            let userData = response.userData;
            let password = encryptUtil.deEncrypt(userData.password);
            setFirstName(userData.first_name);
            setLastName(userData.last_name);
            setUserName(userData.user_name);
            setPassword(password);
            setReTypePassword(password);
            setEmailId(userData.email_id);
            setPhoneNo(userData.phone_no);
            setDateOfBirth(userData.d_o_b);
            setCompany(userData.company_name);
            setExperience(userData.experience);
          }else{
            history.push("/login");
          }
          setShowLoader(false);
    }).catch(() =>{
        setShowLoader(false);
       history.push("/login");
    });
  },[]);

const onEditClick = () =>{
    setIsDisable(false);
}

const onLogOutClick =() =>{
    logout().then(() =>{
        history.push("/login");
    });
}

const onCancelClick = () =>{
    setIsDisable(true);
}
  const onSaveClick = (event) => {
    let isValidateError;
    if((userName === "" || password === "" ||  reTypePassword === "" || 
       emailId === "" ||  phoneNo === "") && (!isValidateError)){
        isValidateError=true;
        setShowValidateError(true);
        toast.error("Missing Required Field.");
    }else{
      setShowValidateError(false);
    }
    if(password !== reTypePassword && (!isValidateError)){
      isValidateError=true;
      setPasswordError(true);
      toast.error("Password Mismatch.");
    }else{
      setPasswordError(false);
    }
    if(!emailId.toLocaleLowerCase().includes("@gmail.com")&& (!isValidateError)){
      isValidateError=true;
      setEmailError(true);
      toast.error("Invalid Mail Address.");
    }else{
      setEmailError(false);
    }
 if(isValidateError){
   return;
 }
 let pwd= encryptUtil.getEncrypt(password.toString());
 let updateMap = {user_name : userName, 
           password :pwd , phone_no : phoneNo,
           email_id : emailId, 
           first_name : firstName,
           last_name : lastName,
           d_o_b : dateOfBirth,
           company_name: company,
           experience : experience};

 updateProfile(updateMap).then(() =>{
    setIsDisable(true);
 }).catch(error =>{
  if(error.response?.data?.result?.userData){
    let userData = error.response.data.result.userData;
    setUserExistError("");
    if(userData.user_name === userName){
      setUserExistError("userName");
    }else if(userData.phone_no === phoneNo){
      setUserExistError("phoneNo");
    }
  }
 })
    event.preventDefault();
  };


  return (
      <Container maxWidth="xs" style={{background:"#ffff", borderRadius:"5px"}} >
      {showLoader ? <CircularProgress style={{marginTop: "16px",
                 position: "absolute"}} /> : null}
      <div className={classes.container}>
        <Avatar style={{ 
          background: 'linear-gradient(48deg, rgb(38 194 199 / 58%) 30%, rgb(0 43 255 / 99%) 90%)',
          marginTop:"16px"}}>
          <SupervisedUserCircleOutlined />
        </Avatar>
        <Button
          type="submit"
          variant="contained"
          color="default"
          style={{right:"0px",top:"16px", position:"absolute"}}
          onClick={onLogOutClick}
        >
          Logout
        </Button>
        <h4 style={{lineHeight:"0px",paddingBottom:"8px"}} color="textSecondary">
          Hi {userName}
        </h4>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="first_name"
                name="first_name"
                label="First Name"
                variant="outlined"
                size="small"
                fullWidth
                autoFocus
                disabled={isDisable}
                value={firstName}
                onChange={(event)=>setFirstName(event.target.value.trim())}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="last_name"
                name="last_name"
                label="Last Name"
                size="small"
                variant="outlined"
                fullWidth
                disabled={isDisable}
                value={lastName}
                onChange={(event)=>setLastName(event.target.value.trim())}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="user_name"
                name="user_name"
                label="User Name"
                size="small"
                variant="outlined"
                required
                fullWidth
                disabled
                value={userName}
                error={(showValidateError && userName === "")||(userExistError === "userName")}
                onChange={(event)=>setUserName(event.target.value.trim())}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="password"
                name="password"
                label="Password"
                type="password"
                size="small"
                variant="outlined"
                disabled={isDisable}
                required
                fullWidth
                value={password}
                error={showValidateError &&  password === ""}
                onChange={(event)=>setPassword(event.target.value.trim())}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="confirm_password"
                name="confirm_password"
                label="Retype Password"
                type="password"
                size="small"
                variant="outlined"
                disabled={isDisable}
                required
                fullWidth
                value={reTypePassword}
                helperText={passwordError ?"Password mismatch":""}
                error={(showValidateError && reTypePassword === "") || passwordError}
                onChange={(event)=>setReTypePassword(event.target.value.trim())}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="email_id"
                name="email_id"
                label="Email Address"
                type="email"
                variant="outlined"
                size="small"
                disabled={isDisable}
                required
                fullWidth
                value={emailId}
                helperText={"Supports only @gmail.com"}
                error={(showValidateError && emailId === "") || emailError}
                onChange={(event)=>setEmailId(event.target.value.trim())}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="phone_no"
                name="phone_no"
                label="Phone No"
                variant="outlined"
                type="number"
                size="small"
                disabled
                required
                fullWidth
                value={phoneNo}
                error={(showValidateError && phoneNo === "")||(userExistError === "phoneNo")}
                onChange={(event)=>setPhoneNo(event.target.value.trim())}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
               <TextField
                 id="d_o_b"
                 name="d_o_b"
                 label="Birthday"
                 type="date"
                 disabled={isDisable}
                 fullWidth
                 size="small"
                 variant="outlined"
                 value={dateOfBirth}
                 onChange={(event)=>setDateOfBirth(event.target.value.trim())}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="company"
                name="company"
                label="Company"
                variant="outlined"
                size="small"
                fullWidth
                disabled={isDisable}
                value={company}
                onChange={(event)=>setCompany(event.target.value.trim())}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="experience"
                name="experience"
                label="Experience(Y)"
                type ="number"
                variant="outlined"
                size="small"
                disabled={isDisable}
                fullWidth
                value={experience}
                onChange={(event)=>setExperience(event.target.value.trim())}
              />
            </Grid>
          </Grid>
          {isDisable ? <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{margin:"16px 0px 16px 0px"}}
            onClick={onEditClick}
          >
            Edit Profile
          </Button>
           : null}
          {!isDisable ?<Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
          <Button
            type="submit"
            variant="contained"
            color="default"
            onClick={onCancelClick}
            style={{margin:"16px 0px 16px 0px"}}
            fullWidth
          >
            Cancel
          </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={onSaveClick}
            style={{margin:"16px 0px 16px 0px"}}
            fullWidth
          >
            Save
          </Button>
          </Grid>
          </Grid>
          : null}
      </div>
      </Container>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    marginTop: "16px",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position:"relative",
  },
}));