import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { auth } = useAuth();
  console.log(auth);
  return (
    <section>
      <p>{JSON.stringify(auth)}</p>
    </section>
  );
};

export default Profile;
