import React, {useState, useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 600,
  },
  h6:{
    fontSize: 14,
  },
  description:{
    fontSize: 14,
    width: 50,
  },
  image: {
    width: 50,
  },
  clearButton: {
    float: "right",
    marginBottom: 16,
  },
  pagination: {
    marginRight: "40%",
  }
});

//data props are optional since they're not needed everywhere
interface IDataProps {
    data?: any;
    id?: number;
    full_name?: string;
    avatar_url?: string;
    description?: string;
}

//success message functinality
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

//hand data down to table
function createData(avatar_url: string, full_name: string, description: string, id: number) {
  return {avatar_url, full_name, description, id };
}

function RepoPicker(props: IDataProps) {
  const [checked, setChecked] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  //data variable
  const data =  props.data;

  //saves checkbox state to localstorage and sets the state of checked for each checkbox by id
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    window.localStorage.setItem(event.target.id, JSON.stringify(event.target.checked));
    setChecked({...checked, [event.target.id] : event.target.checked });
  }

  useEffect(() => {
    //run after checked state is updated
   }, [checked])

   //added clear storage handler to clear local storage and checked boxes if the user wishes
  const handleClear = () => {
    localStorage.clear()
    setChecked([]);
    setOpen(true);
  }


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  //set how many rows per page will render
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //close snackbar
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
 
  //cheking if the data exists to render
  if(data != null && data.items != null) {
    //render rows
    const rows =  data.items.map((item: any) => (
      createData(item.owner.avatar_url, item.full_name, item.description, item.id)
    ))
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    return (
      <div className="App">
        <Button onClick={handleClear} className={classes.clearButton} variant="contained" color="secondary">
            Clear All Favs
        </Button>
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert severity="success">
            Favs successfully cleared!
          </Alert>
      </Snackbar>
        <Typography variant="h4">Repo Fav Picker</Typography>
        <TablePagination
          className={classes.pagination}
          rowsPerPageOptions={[10]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
          <TableContainer component={Paper}>
          <Table size="small" className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
              <TableCell align="center">Avatar</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="left"> 
                  Fav
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => (
              <TableRow key={row.full_name}>
                <TableCell align="center" component="th" scope="row">
                <img alt="avatar" className={classes.image} src={row.avatar_url}/>
                </TableCell>
              
                <TableCell align="center" component="th" scope="row">
                <Typography className={classes.h6} variant="h6" component="span">
                  {row.full_name}
                  </Typography>
                </TableCell>
                
                <TableCell align="center" component="th" scope="row">
                  <Typography className={classes.description} variant="h6" component="span">
                    {row.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="left" component="th" scope="row">
                    <FormControlLabel
                      control={<Checkbox id={row.id}
                      checked={window.localStorage.getItem(row.id) === 'true'}
                      onChange={handleChange} 
                      icon={<FavoriteBorder />} checkedIcon={<Favorite />} />}
                      label=""
                    />
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
            <TableRow style={{ height: 48 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
    );
  }
  return null;
}

export default RepoPicker;
