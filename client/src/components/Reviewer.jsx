// import axios from "../api/api.js";
import useAuth from "../hooks/useAuth.js";

function Reviewer() {
  const {auth} = useAuth();
  return (
    <section>
      <p>
          {JSON.stringify(auth)}
      </p>
    </section>
  );
}

export default Reviewer;