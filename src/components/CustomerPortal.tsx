import React, { useEffect, useState, useCallback } from "react";
import CustomerListCard from "./CustomerListCard";
import CustomerDetails from "./CustomerDetail";
import { titles } from "./titlesdata";
import { InfinitySpin } from "react-loader-spinner";
import ErrorElement from "./ErrorElement";

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

const CustomerPortal: React.FC = () => {
  const [customerListData, setCustomerListData] = useState<Customer[]>([]);
  const [displayedCustomers, setDisplayedCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadMore, _setLoadMore] = useState<number>(20);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // function to fetch data from API
  const fetchCustomersData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://randomuser.me/api/?results=1000");
      if (!response.ok) {
        throw new Error("Failed to fetch customer data");
      }
      const data = await response.json();
      const dataObj = data.results.map((user: any) => ({
        id: user.login.uuid,
        name: `${user.name.first} ${user.name.last}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        address: `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.country}`,
        profileImage: user.picture.large,
        dob: new Date(user.dob.date).toISOString().split("T")[0],
        age: user.gender.charAt(0).toUpperCase() + user.gender.slice(1),
        phone: user.phone,
        email: user.email,
        city: `${user.location.city}, ${user.location.state}, ${user.location.country}`,
      }));
      setCustomerListData(dataObj);
      setDisplayedCustomers(dataObj.slice(0, loadMore)); // Display the first 20 customers
    } catch (err) {
      setError((err as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersData();
  }, []);

  // handle lazy loading of data cards
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const isBottom =
        Math.ceil(e.currentTarget.scrollHeight - e.currentTarget.scrollTop) <=
        e.currentTarget.clientHeight + 1;

      if (isBottom && displayedCustomers.length < customerListData.length) {
        const nextCustomers = customerListData.slice(
          displayedCustomers.length,
          displayedCustomers.length + loadMore
        );
        setDisplayedCustomers((prev) => [...prev, ...nextCustomers]);
      }
    },
    [displayedCustomers, customerListData, loadMore]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <InfinitySpin width="200" color="#808080" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ErrorElement error={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-8">
      {/* Hamburger menu button */}
      <button
        className="sm:hidden p-2 bg-gray-800 text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰ Customer List
      </button>

      {/* Contact list cards */}
      <div
        className={`w-full sm:w-1/3 max-h-[150vh] overflow-y-auto overflow-x-clip overscroll-x-none custom-scrollbar ${
          isMenuOpen ? "block" : "hidden sm:block"
        }`}
        onScroll={handleScroll}
      >
        {displayedCustomers.map((element) => (
          <CustomerListCard
            key={element.id}
            name={element.name}
            title={element.title}
            onClick={() => setSelectedCustomer(element)}
            profileUrl={element.profileImage}
            city={element.city}
            selectedCustomerId={selectedCustomer?.id}
            currentId={element.id}
          />
        ))}
        {displayedCustomers.length < customerListData.length && (
          <div className="flex justify-center my-4">
            <InfinitySpin width="50" color="#808080" />
          </div>
        )}
      </div>

      {/* Customer details */}
      <div className="w-full sm:w-2/3">
        <CustomerDetails customer={selectedCustomer} />
      </div>
    </div>
  );
};

export default CustomerPortal;
