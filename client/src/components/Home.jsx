import useAuth from "../hooks/useAuth.js";

const Home = () => {
    const {auth} = useAuth();
    console.log(auth);
    return <div>Home</div>
}

export default Home;