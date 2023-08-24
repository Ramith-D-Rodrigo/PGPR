import useSetUserNavigations from "../hooks/useSetUserNavigations";

const ConductPENavigation = (decodedPgprId) => {
  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "PE",
      link: `/PG_Assignments/Conduct_PE/${decodedPgprId}`,
    },
  ]);
};

export default ConductPENavigation;
