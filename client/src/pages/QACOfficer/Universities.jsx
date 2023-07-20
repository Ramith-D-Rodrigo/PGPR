import MainLayout from '../../components/MainLayout';
// import axios from 'axios';
// import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants';
import Table from '../../components/Table';

const Universities = () => {

    // axios.get(SERVER_URL + SERVER_API_VERSION + '/universities')
    // .then(res => {
    //     console.log(res.data);
    // })

    const tableData = [
        { id: 1, column1Data: 'Data 1', column2Data: 'Data 2' },
        { id: 2, column1Data: 'Data 3', column2Data: 'Data 4' },
    ];

    return (
            <Table data={tableData} />
    )
}

export default Universities