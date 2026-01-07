import React from 'react';
import { Loader as LoaderIcon } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <LoaderIcon className="h-8 w-8 animate-spin text-indigo-600" />
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );
};

export default Loader;