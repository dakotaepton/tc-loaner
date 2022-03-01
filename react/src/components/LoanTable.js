import React, { useEffect } from "react";
import { bulkReturn } from "../definitions";
import CircularProgress from "@material-ui/core/CircularProgress";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Button } from "@material-ui/core";
import RemoveFromQueueIcon from "@material-ui/icons/RemoveFromQueue";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import ConfirmReturnModal from "./ConfirmReturnModal";
import AlertBox from "./AlertBox";

function formatDate(date) {
  console.log(date);
  const options = {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return date.toLocaleDateString("en-AU", options);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  if (orderBy === "dateLoaned") {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  } else {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "name", label: "Loaner", align: "left", disablePadding: true },
  {
    id: "deviceName",
    label: "Device Name",
    align: "left",
    disablePadding: false,
  },
  {
    id: "dateLoaned",
    label: "Date Loaned",
    align: "left",
    disablePadding: false,
  },
];

function LoanTableHeader(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
            className={classes.tableHeader}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            padding={headCell.disablePadding ? "none" : "normal"}
            align={headCell.align}
            className={classes.tableHeader}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.deviceName ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

LoanTableHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: theme.palette.primary.main,
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 2 100%",
    fontWeight: "bold",
  },
  bulkReturnIcon: {
    margin: theme.spacing(0.5),
  },
  returnButton: {
    marginRight: theme.spacing(0.5),
  },
  denseToggler: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}));

const DenseTogglerSwitch = withStyles((theme) => ({
  switchBase: {},
  checked: {},
  track: {
    backgroundColor: theme.palette.common.white,
  },
}))(Switch);

const LoanTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, dense, title } = props;
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title === undefined ? "Current Loans" : title}
        </Typography>
      )}
      <Tooltip title="Toggle dense mode">
        <FormControlLabel
          control={
            <DenseTogglerSwitch
              checked={dense}
              onChange={props.onChangeDense}
            />
          }
          className={classes.denseToggler}
        />
      </Tooltip>
      {numSelected > 0 ? (
        <Tooltip title="Bulk return">
          <Button
            variant="contained"
            size="medium"
            color="secondary"
            className={classes.returnButton}
            startIcon={
              <RemoveFromQueueIcon className={classes.bulkReturnIcon} />
            }
            onClick={props.onBulkReturn}
          >
            RETURN
          </Button>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
};

LoanTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();

  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    padding: "0",
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  tableHeader: {
    fontWeight: "bold",
  },
}));

function LoanTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("dateLoaned");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [loans, setLoans] = React.useState(null);
  const [confirmReturnOpen, setConfirmReturnOpen] = React.useState(false);
  const [successAlert, setSuccessAlert] = React.useState(false);
  const [successAlertContent, setSuccessAlertContent] = React.useState("");
  const [errorAlert, setErrorAlert] = React.useState(false);
  const [errorAlertContent, setErrorAlertContent] = React.useState("");

  const returnAllSelectedLoans = (event) => {
    setConfirmReturnOpen(true);
  };

  const handleCloseReturnModal = (confirmedReturns) => {
    bulkReturn(confirmedReturns)
      .then((results) => {
        var successList = [];
        var errorList = [];

        results.forEach((result) => {
          result.forEach((individualResult) => {
            if (individualResult.success === true) {
              successList.push(individualResult.message);
            } else {
              errorList.push(individualResult.message);
            }
          });
        });

        if (errorList.length === 0) {
          setSelected([]);
          setSuccessAlertContent(successList);
          setSuccessAlert(true);
          setTimeout(function () {
            props.updateLoans();
          }, 3000);
        } else {
          setErrorAlertContent(errorList);
          setErrorAlert(true);
        }
      })
      .catch((error) => {
        console.log("HANDLER ERROR RESULTS");
        console.log(error.message);
      });
    setConfirmReturnOpen(false);
  };

  const handleCancelReturnModal = () => {
    setConfirmReturnOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = loans.map((n) => n.deviceName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

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
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (deviceName) => selected.indexOf(deviceName) !== -1;

  useEffect(() => {
    if (successAlert) {
      setTimeout(function () {
        setSuccessAlert(false);
        setSuccessAlertContent("");
      }, 2000);
    }
    if (errorAlert) {
      setTimeout(function () {
        setErrorAlert(false);
        setErrorAlertContent("");
      }, 4000);
    }
    setLoans(props.allLoans);
    console.log(props.allLoans);
  }, [loans]);

  return (
    <div>
      {successAlert ? (
        <AlertBox severity="success" alertContent={successAlertContent} />
      ) : (
        <div></div>
      )}
      {errorAlert ? (
        <AlertBox severity="error" alertContent={errorAlertContent} />
      ) : (
        <div></div>
      )}
      <div className={classes.root}>
        {confirmReturnOpen ? (
          <ConfirmReturnModal
            open={confirmReturnOpen}
            onClose={handleCloseReturnModal}
            onCancel={handleCancelReturnModal}
            loans={selected}
          />
        ) : null}
        <Paper className={classes.paper}>
          {loans === null ? (
            <CircularProgress />
          ) : (
            <div>
              <LoanTableToolbar
                numSelected={selected.length}
                dense={dense}
                onChangeDense={handleChangeDense}
                onBulkReturn={returnAllSelectedLoans}
                title={props.title}
              />
              <TableContainer>
                <Table
                  className={classes.table}
                  aria-labelledby="tableTitle"
                  size={dense ? "small" : "medium"}
                  aria-label="loan table"
                >
                  <LoanTableHeader
                    classes={classes}
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={loans.length}
                  />
                  <TableBody>
                    {stableSort(loans, getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.deviceName);
                        const labelId = `loan-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={(event) =>
                              handleClick(event, row.deviceName)
                            }
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.deviceName}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                inputProps={{ "aria-labelledby": labelId }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              {row.name}
                            </TableCell>
                            <TableCell align="left">{row.deviceName}</TableCell>
                            <TableCell align="left">
                              {formatDate(row.dateLoaned)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={loans.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </div>
          )}
        </Paper>
      </div>
    </div>
  );
}

export default LoanTable;
