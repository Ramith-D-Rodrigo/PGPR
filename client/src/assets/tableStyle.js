//create a single styled class for table, table head, table row and table cell
const tableStyle = {
    minWidth: 650,
    borderCollapse: 'separate',
    borderSpacing: '0 10px',
    '& th': {
        backgroundColor: '#D8E6FC',
        fontWeight: 'bold',
        padding: '10px',
        textAlign: 'center',
        borderBottom: '1px solid #ddd',
    },
    '& td': {
        padding: '10px',
        textAlign: 'center',
        borderBottom: '1px solid #ddd',
    },
    '& tbody tr:hover': {
        backgroundColor: '#f5f5f5',
    },
}

export default tableStyle