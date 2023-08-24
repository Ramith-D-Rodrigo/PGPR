import useSetUserNavigations from "../hooks/useSetUserNavigations";

const EvaluatePENavigation = (decodedPgprId, decodedCriteriaId) => {
  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "PE",
      link: `/PG_Assignments/Conduct_PE/${decodedPgprId}`,
    },
    {
      name: "Assigned Criteria",
      link: `/PG_Assignments/Conduct_PE/Assigned_criteria/${decodedPgprId}`,
    },
    {
      name: "Evaluate PE",
      link: `/PG_Assignments/Conduct_PE/Assigned_criteria/${decodedPgprId}/${decodedCriteriaId}`,
    },
  ]);
};

export default EvaluatePENavigation;
