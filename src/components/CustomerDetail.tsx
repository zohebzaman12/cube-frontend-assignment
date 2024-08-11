import React, { useEffect, useState } from "react";

interface Customer {
  id: string;
  name: string;
  title: string;
  address: string;
  profileImage: string;
  dob: string;
  age: string;
  phone: string;
  email: string;
  city: string;
}

interface CustomerDetailsProps {
  customer: Customer | null;
}

interface Photo {
  url: string;
  isPlaceholder?: boolean;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const generatePlaceholderPhotos = () => {
    const placeholderPhotos = Array.from({ length: 9 }).map(() => ({
      url: "https://via.placeholder.com/1200x800?text=Loading...", // Placeholder image URL
      isPlaceholder: true,
    }));
    setPhotos(placeholderPhotos);
  };

  useEffect(() => {
    if (customer) {
      generatePlaceholderPhotos();

      const fetchPhotos = async () => {
        try {
          setLoading(true);
          setError(null);

          const screenWidth = window.visualViewport
            ? window.visualViewport.width
            : window.innerWidth;
          let width = 1200;
          let height = 800;

          if (screenWidth < 640) {
            width = 600;
            height = 400;
          } else if (screenWidth < 1024) {
            width = 900;
            height = 600;
          }

          const photoPromises = Array.from({ length: 9 }).map(async () => {
            const url = `https://picsum.photos/${width}/${height}?random=${Math.floor(
              Math.random() * 1000
            )}`;

            const response = await fetch(url);

            if (!response.ok) {
              throw new Error("Failed to load photo");
            }

            return { url };
          });

          const newPhotos = await Promise.all(photoPromises);
          setPhotos(newPhotos);
          setLoading(false);
        } catch (err) {
          setError("Failed to load photos. Please try again later.");
          setLoading(false);
        }
      };

      fetchPhotos();
      const intervalId = setInterval(fetchPhotos, 10000); // 10 seconds

      return () => clearInterval(intervalId);
    }
  }, [customer]);

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-full p-8 bg-gray-100">
        <div className="text-center bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto">
          <p className="text-xl font-semibold text-gray-700 mb-4">
            No Customer Selected
          </p>
          <p className="text-base text-gray-500">
            Please select a customer to see their details.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8 bg-gray-100">
        <div className="text-center bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto">
          <p className="text-xl font-semibold text-red-700 mb-4">Error</p>
          <p className="text-base text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg shadow-sm bg-white mx-8 my-4 p-4">
      {/* Profile Section */}
      <div className="flex flex-col items-center md:flex-row justify-start gap-4 md:gap-8 p-4 md:p-6">
        <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-gray-300 overflow-hidden hover:scale-110 duration-500">
          <img
            src={customer.profileImage}
            alt="Profile Photo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start justify-center">
          <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
            {customer.name}
          </div>
          <div className="flex flex-col  text-gray-700 mt-2">
            <span className="text-sm font-semibold text-gray-500 mr-2">TITLE</span>
            <span className="text-lg md:4xl-base italic">{customer.title}</span>
          </div>
          <div className=" flex flex-col text-xs md:text-sm lg:text-base text-gray-600 mt-2">
            <span className="text-sm font-semibold text-gray-500 mr-2">ADDRESS</span>
            <span className="text-lg md:4xl-base italic">{customer.address}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-around md:flex-wrap">
        <div className="flex flex-col items-start">
          <div className="text-xs text-gray-500">DOB</div>
          <div className="text-lg md:text-xl font-semibold text-gray-900">
            {customer.dob}
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="text-xs text-gray-500">GENDER</div>
          <div className="text-lg md:text-xl font-semibold text-gray-900">
            {customer.age}
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="text-xs text-gray-500">PHONE</div>
          <div className="text-lg md:text-xl font-semibold text-gray-900 break-words">
            {customer.phone}
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="text-xs text-gray-500">EMAIL</div>
          <div className="text-lg md:text-xl font-semibold text-gray-900 break-words">
            {customer.email}
          </div>
        </div>
      </div>
      {/* Photos Section */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 bg-white m-4">
        {photos.map((photo, index) => (
          <div key={index}>
            <img
              className={`h-auto rounded-lg shadow-xl transition-filter duration-500 ${
                loading || photo.isPlaceholder ? "blur-sm" : "blur-none"
              }`}
              src={photo.url}
              alt={`Photo ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDetails;
