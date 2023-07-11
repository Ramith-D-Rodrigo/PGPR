import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  return <section>{JSON.stringify(user)}</section>;
};

export default Profile;
