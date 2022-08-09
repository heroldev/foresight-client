import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Card } from '../../types/Card';
import { CardTemplate } from '../../types/CardTemplate';
import { useStore } from '../../state/store';
import { ICardSearchResultTableProps } from './types';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import Tooltip from '@mui/material/Tooltip';
import "../../bootstrap/global.css"
import CircularProgress from '@mui/material/CircularProgress';
import { css } from '@emotion/css';
import { useEffect } from 'react';

export const loadingContainerStyle =css`
display: flex;
align-items: center;
justify-content: center;
padding: 16px;
`

interface Column {
  id: 'name' | 'supertype' | 'symbol' | 'id';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'right';
  format?: string;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 150, maxWidth: 150 },
  { id: 'supertype', label: 'Card Type', align: 'right', minWidth: 70 },
  {
    id: 'symbol',
    label: 'Set',
    minWidth: 100,
    align: 'right',
    format: 'image'
  },
];

interface Data {
  name: string,
  subtype: string,
  supertype: string,
  symbol: string,
  id: string,
  card: Card
}

function createData(
  name: string,
  subtype: string,
  supertype: string,
  symbol: string,
  id: string,
  card: Card
): Data {
  return { name, subtype, supertype, symbol, id, card };
}

export default function CardSearchResultTable(props: ICardSearchResultTableProps) {

  const { resultList, loading, onSelect, queryCaption } = props;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    setPage(0)
  }, [loading]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const generateTableData = (): Data[] => {

    let tableItems: Data[] = []

    resultList.forEach(card => tableItems.push(createData(card.name, (card.subtypes?.join(', ') || ''), card.supertype, card.set!.images.symbol, card.id, card)))

    return tableItems
  }

  const handleCardResultClick = (card: Card) => {
    onSelect(card)
  }

  let rows = generateTableData()

  return (
    <Box>
      {loading ? <div className={loadingContainerStyle}>
        <CircularProgress />
        </div>
        : <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 528, overflowX: "hidden" }}>
            <Table stickyHeader size="small">
              {queryCaption &&
                <caption>{queryCaption}</caption>
              }
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align} onClick={() => handleCardResultClick(row.card)}>
                              {column.format === 'image'
                                ?
                                <Tooltip title={row.card.set!.name} placement='left'>
                                  <img src={row.symbol} alt="Symbol" height="35" ></img>
                                </Tooltip>
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      }
    </Box>
  );
}
/*
{generateTableData().map((object, index) => (
  <TableRow
    key={index}
    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
  >
    <TableCell component="th" scope="row">
      {object.name}
    </TableCell>
    <TableCell align="right">{object.type}</TableCell>
    <TableCell align="right"><img src={object.symbol} alt="Symbol" width="20" height="20" ></img></TableCell>
    <TableCell align="right">{object.id}</TableCell>
  </TableRow>
))}
*/