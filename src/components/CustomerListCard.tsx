import React from 'react';

interface CustomerListCardProps {
  name: string;
  title: string;
  onClick: () => void;
  profileUrl: string;
  city: string;
  selectedCustomerId: string | undefined;
  currentId: string;
}

const CustomerListCard: React.FC<CustomerListCardProps> = ({
  name,
  title,
  onClick,
  profileUrl,
  city,
  selectedCustomerId,
  currentId,
}) => {
  const bgColorClass = selectedCustomerId === currentId ? 'bg-gray-300' : 'bg-white';
  return (
    <div
      className={`flex items-center p-2 md:p-4 max-w-full overflow-x-hidden ${bgColorClass} shadow-sm hover:scale-105 hover:bg-gray-200 duration-300`}
      onClick={onClick}
    >
      <img
        className='w-12 h-12 md:w-20 md:h-20 rounded-full object-cover mr-2 md:mr-4'
        src={profileUrl}
        alt='Profile'
      />
      <div>
        <h2 className='text-md md:text-lg font-semibold text-gray-900'>{name}</h2>
        <p className='text-xs md:text-sm text-blue-500'>{title}</p>
        <p className='text-xs md:text-sm text-gray-500'>{city}</p>
      </div>
    </div>
  );
};

export default CustomerListCard;