import React from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';

const CqaOffices = () => {
  useSetUserNavigations(
    [
        {
          name: "CQA Offices",
          link: "/cqa_offices"
        },
    ]
  );
  return (
    <div>
      CQA Offices
    </div>
  )
}

export default CqaOffices
