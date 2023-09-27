import { useContext } from "react";
import ReviewerRoleContext from "../contexts/ReviewerRoleProvider";

const useReviewerRole = ()=>{
    return useContext(ReviewerRoleContext);
}

export default useReviewerRole;