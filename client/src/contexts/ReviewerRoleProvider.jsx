import {useState, createContext} from 'react';

const ReviewerRoleContext = createContext();
export const ReviewerRoleProvider = ({children}) => {
    const [reviewerRole, setReviewerRole] = useState('');
    return (
        <ReviewerRoleContext.Provider value={{reviewerRole, setReviewerRole}}>
            {children}
        </ReviewerRoleContext.Provider>
    )
}

export default ReviewerRoleContext;