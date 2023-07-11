import { MaterialReactTable } from 'material-react-table';

const Table = ({columns, data, tableProps}) => {
    return (
        <MaterialReactTable
            columns={columns}
            data={data}
            {...tableProps}
        />
    );
}

export default Table