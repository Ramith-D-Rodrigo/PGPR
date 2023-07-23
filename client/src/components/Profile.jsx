import axios from '../api/api.js';
import {useEffect, useState} from "react";

const Profile = () => {
    const [user, setUser] = useState({});

    async function getUserData() {
        try {
            let response = await axios.get('/api/role/user');
            setUser(response?.data);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <section>
            <p>{JSON.stringify(user)}</p>
        </section>
    );
};

export default Profile;
