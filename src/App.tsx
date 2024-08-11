import React from 'react';
import CustomerPortal from './components/CustomerPortal';

const App: React.FC = () => {
  return (
    <div className='bg-[#F4F5F9]'>
      <div className='bg-white flex justify-center items-center shadow-sm pb-4 pt-4'>
        <img src='/logo.svg' className='h-12' alt='Logo' />
      </div>
      <CustomerPortal />
    </div>
  );
};

export default App;
