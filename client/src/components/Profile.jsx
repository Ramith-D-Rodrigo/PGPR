import axios from '../api/api.js';
import useAuth from "../hooks/useAuth.js";
import {useEffect, useState} from "react";

const Profile = () => {
    const {auth} = useAuth();

    const [user, setUser] = useState({});

    async function getUserData() {
        try {
            let response = await axios.get('/api/user');
            console.log(response);
            setUser(response?.data);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    console.log(auth);

    return (
        <section>
            <p>{JSON.stringify(user)}</p>
        </section>
    );
};

export default Profile;
