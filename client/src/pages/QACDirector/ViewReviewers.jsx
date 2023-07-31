import React from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';

const ViewReviewers = () => {
  useSetUserNavigations(
    [
        {
          name: "Reviewers",
          link: "/reviewers"
        },
    ]
  );
  return (
    <div>
      ViewReviewers
    </div>
  )
}

export default ViewReviewers;
