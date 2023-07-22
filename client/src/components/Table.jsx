import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { PropTypes } from 'prop-types';

const TableComponent = ({ data }) => {

    TableComponent.propTypes = {
        data: PropTypes.array.isRequired,
    };

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Column 1</TableCell>
              <TableCell>Column 2</TableCell>
              {/* Add more table header cells as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.column1Data}</TableCell>
                <TableCell>{item.column2Data}</TableCell>
                {/* Add more table cells based on your data structure */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

export default TableComponent;