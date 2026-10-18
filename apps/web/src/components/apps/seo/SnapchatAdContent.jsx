import React from 'react';
import SnapchatMobilePreview from './SnapchatMobilePreview';

const SnapchatAdContent = ({ image, copy }) => {
  return (
    <div className="flex justify-center items-center w-full h-full bg-slate-50 p-4 rounded-xl">
        <div className="scale-90 sm:scale-100 transition-transform origin-center">
            <SnapchatMobilePreview image={image} content={copy} />
        </div>
    </div>
  );
};

export default SnapchatAdContent;