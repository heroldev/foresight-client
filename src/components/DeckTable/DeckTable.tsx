import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { DeckFormat } from '../../types/Format';
import { AddCircle } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Deck } from '../../types/Deck';
import { deletePkmnDeck, getDeckBox, getUser, loadPkmnDeck, select, useStore } from '../../state/store';
import { Card } from '../../types/Card';
import { Link } from 'react-router-dom';
import randomWords from 'random-words'
import { generateId } from '../../util/generateId';

interface Data {
  name: string;
  format: string;
  modified: string;
  id: string
}

enum DeleteDeckOption {
  single = "single",
  selected = "selected"
}

function createData(
  name: string,
  format: DeckFormat,
  modified: string,
  id: string
): Data {
  return {
    name,
    format,
    modified,
    id
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof Data>(
  order: Order,
  orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Deck Name',
  },
  {
    id: 'format',
    numeric: true,
    disablePadding: false,
    label: 'Format',
  },
  {
    id: 'modified',
    numeric: true,
    disablePadding: false,
    label: 'Last Modified',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

export default function DeckTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const createNewDeck = useStore(state => state.createNewDeck)
  const deleteDeck = useStore(state => state.deleteDeck)
  const editDeck = useStore(state => state.editDeck)
  const copyDeck = useStore(state => state.copyDeck)

  const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected } = props;
  
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 1 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} decks selected
          </Typography>
        ) : numSelected == 1 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} deck selected
          </Typography>
        ) : <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          component="div"
        >
          Decks
        </Typography>}
        {numSelected > 0 ? (
          <Tooltip title="Delete Deck(s)">
            <IconButton onClick={() => handleDeleteDeck(DeleteDeckOption.selected)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Create Deck">
            <IconButton component={Link} to={"/create"}>
              <AddCircle />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  };
  
  /*[
    createData('Rapid Smash', 60, DeckFormat.Expanded, new Date().toLocaleString()),
    createData('Despacito 2', 60, DeckFormat.Expanded, new Date().toLocaleString()),
    createData('Asinine Fire', 60, DeckFormat.Standard, new Date().toLocaleString()),
    createData('Get Fucked LOL', 57, DeckFormat.Unlimited, new Date().toLocaleString()),
    createData('Junebug', 60, DeckFormat.Unlimited, new Date().toLocaleString()),
    createData('Maybug', 60, DeckFormat.Unlimited, new Date().toLocaleString()),
    createData('Julybug', 60, DeckFormat.Unlimited, new Date().toLocaleString()),
    createData('ADP', 60, DeckFormat.Unlimited, new Date().toLocaleString()),
    createData('RIP', 60, DeckFormat.Unlimited, new Date().toLocaleString()),
    createData('vite and plack', 60, DeckFormat.Unlimited, new Date().toLocaleString()),
  ];*/

  const generateTableData = (): Data[] => {
    let tableData: Data[] = []
    let deckBox = select(getDeckBox)
    deckBox.forEach(deck => tableData.push(createData(deck.name, deck.format, new Date(deck.modified).toLocaleString(), deck.deckId)))
    return tableData
  }

  let rows = generateTableData()

  const handleDeleteDeck = (deleteOption: DeleteDeckOption) => {
  
    switch(deleteOption) {
      case DeleteDeckOption.single:
        let deletedDeckIndex = rows.findIndex(data => data.id = selected[0])
        rows.splice(deletedDeckIndex, 1)
        deleteDeck(selected[0])
        deletePkmnDeck(selected[0])
        setSelected([])
        break;
      case DeleteDeckOption.selected:
        selected.forEach((deckId) => {
        let deletedDeckIndex = rows.findIndex(data => data.id = deckId)
        rows.splice(deletedDeckIndex, 1)
        deleteDeck(deckId)
        deletePkmnDeck(deckId)
        })
        setSelected([])
        break;
      default:
        //do nothing
        break;
    }

    setPage(0)
  }

  const handleEditDeck = () => {
    editDeck(selected[0])
    loadPkmnDeck(selected[0])
  }

  const handleCopyDeck = () => {
    const newDeckId = generateId()
    copyDeck(selected[0], newDeckId)
    setSelected([])
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, deckId: string) => {
    const selectedIndex = selected.indexOf(deckId);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, deckId);
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.slice().sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
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
                      <TableCell align="right">{row.format}</TableCell>
                      <TableCell align="right">{row.modified}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Box display="flex">
        {selected.length == 1 ?
          <Box>
            <Button variant="contained" style={{ backgroundColor: '#1C18E8', marginRight: "16px" }} component={Link} to={"/create"} size={"medium"}>
              Create New Deck
            </Button>
            <Button variant="contained" style={{marginRight: "16px" }} onClick={handleEditDeck} component={Link} to={"/edit"} size={"medium"}>
              Edit Deck
            </Button>
            <Button variant="contained" style={{ marginRight: "16px" }} onClick={handleCopyDeck} size={"medium"}>
              Copy Deck
            </Button>
            <Button variant="contained" style={{ backgroundColor: '#D22323', marginRight: "16px" }} onClick={() => handleDeleteDeck(DeleteDeckOption.single)} size={"medium"}>
              Delete Deck
            </Button>
          </Box> : selected.length > 1 ?
            <Box>
              <Button variant="contained" style={{ backgroundColor: '#1C18E8', marginRight: "16px" }} component={Link} to={"/create"} size={"medium"}>
                Create New Deck
              </Button>
              <Button variant="contained" style={{ backgroundColor: '#D22323', marginRight: "16px" }} onClick={() => handleDeleteDeck(DeleteDeckOption.selected)} size={"medium"}>
                Delete selected Decks
              </Button>
            </Box> :
            <Box>
              <Button variant="contained" style={{ backgroundColor: '#1C18E8', marginRight: "16px" }} component={Link} to={"/create"} size={"medium"}>
                Create New Deck
              </Button>
            </Box>
        }
      </Box>

    </Box>
  );
}