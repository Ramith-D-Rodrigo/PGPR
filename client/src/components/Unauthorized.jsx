import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  // incase the user wants to go to the previous location
  const goBack = () => navigate(-1);

  return (
    <section>
      <h1>Unauthorized</h1>
      <br />
      <p>You don't have access to the requested page.</p>
      <button onClick={goBack}>Go Back</button>
    </section>
  );
};

export default Unauthorized;
