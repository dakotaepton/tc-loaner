import React from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

const RedCheckbox = withStyles((theme) => ({
  root: {
    color: theme.palette.error.main,
    '&$checked': {
      color: theme.palette.error.main,
    },
  },
  checked: {},
}))((props) => <Checkbox color="default" {...props} />);


const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
  },
  cancelButton: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
  returnTable: {
    width: '100%',
  },
  damagedCheckbox: {
    color: theme.palette.error.main,
  }
}));

function ConfirmReturnModal(props) {
  const classes = useStyles();
  
  const { open, onClose, onCancel, loans } = props;
  const [selected, setSelected] = React.useState([]);

  const handleClose = () => {
    let damaged = [];
    let notDamaged = [];
    console.log(selected);
    loans.forEach((loan, index) => {
      if(loan.indexOf(selected) !== -1) {
        notDamaged.push(loan);
      } else {
        damaged.push(loan);
      }
    });
    console.log(damaged);
    console.log(notDamaged);

    onClose({damaged: damaged, notDamaged: notDamaged});
  }

  const handleCancel = () => {
    onCancel();
  }


  const handleClick = (event, deviceName) => {
    const selectedIndex = selected.indexOf(deviceName);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, deviceName);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (deviceName) => selected.indexOf(deviceName) !== -1;


  return (
    <div>
     <Dialog open={open} aria-labelledby="confirm-return-dialog-title">
        <DialogTitle id="confirm-return-dialog-title" className={classes.dialogTitle}>Any damaged returns?</DialogTitle>
        <TableContainer>
        <Table
          className={classes.returnTable}
          aria-labelledby="tableTitle"
          size='medium'
          aria-label="return table"
        >
          <TableBody>
            {
              loans.map((deviceName, index) => {
                const isItemSelected = isSelected(deviceName);
                const labelId = `loan-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, deviceName)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={deviceName}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <RedCheckbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                        className={classes.damagedCheckbox}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="deviceName" padding="none">
                    {deviceName}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
        <DialogActions>
          <Button onClick={handleCancel} variant="outlined" className={classes.cancelButton}>
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" variant="contained">
            Bulk Return
          </Button>
        </DialogActions>
      </Dialog> 
    </div>
  )

}

export default ConfirmReturnModal;