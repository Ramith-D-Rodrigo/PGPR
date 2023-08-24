import useSetUserNavigations from "../hooks/useSetUserNavigations";

const PESummaryDetailsNavigation = (pgprId) => {
  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "DE",
      link: "/PG_Assignments/Conduct_DE/" + pgprId,
    },
    {
      name: "Summary Details",
      link: "/PG_Assignments/Conduct_DE/Summary_details/" + pgprId,
    },
  ]);
};

export default PESummaryDetailsNavigation;
