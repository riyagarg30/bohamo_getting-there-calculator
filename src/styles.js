// styles.js
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    customFlightIcon:{
        color: 'red',
    },
  redIcon: {
    '& > img':{
        transform: 'rotate(45deg) !important',
    }
  },
  container: {
    display: "flex",
    height: "100%",
  },
  sidePanel: {
    width: 300,
    maxWidth: 300,
    minWidth: 300,
    flexShrink: 0,
    height: "100%",
    "& .MuiDrawer-paper": {
      width: 300,
      maxWidth: 300,
      minWidth: 300,
      height: "100%", // Full height of the viewport
      boxSizing: "border-box",
      //   position: 'relative',
    },
  },
  mainContent: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    // padding: theme.spacing(2),
    // marginLeft: 250, // Offset for the side panel
    // height: '100%', // Full height
    overflow: "auto", // To prevent overflow
  },
  button: {
    marginTop: theme.spacing(2),
    width: "100%",
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  flihtMap: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
}));

export default useStyles;
