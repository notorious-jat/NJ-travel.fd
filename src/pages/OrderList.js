import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import ReviewModal from '../components/ReviewModal';
import { toast } from 'react-toastify';
import Template from '../components/Template';
import Loader from '../components/Loader';

// Styled Components
const OrderListWrapper = styled.div`
  padding: 15px 30px;
  max-width: 1200px;
  margin: auto;
  background-color: #f9f9f9;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 40px;
`;

const OrderContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  justify-content: center;
`;

const OrderCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 10px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
`;

const OrderCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderID = styled.p`
  color: #888;
  font-size: 1rem;
  margin:0;
`;

const OrderInfo = styled.p`
  margin: 0;
  font-size: 14px;
  color: #555;
`;

const TravelInfo = styled.div`
  margin-top: 10px;
  border-top: 1px solid #eee;
`;

const TravelName = styled.h4`
  font-size: 1.3rem;
  color: #333;
  margin:10px 0 5px;
`;

const ReviewSection = styled.div`
  margin: 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
`;

const ReviewCard = styled.div`
  margin-bottom: 0;
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ReviewHeader = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin:0;
`;

const ReviewText = styled.p`
  color: #555;
  font-size:14px;
  margin:2px 0;
`;

const ReviewDate = styled.small`
  color: #888;
  font-size: 0.9rem;
`;

const Image = styled.img`
  width: 100%;
  height: 125px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid ${(props) => (props.isSelected ? "#f7c41f" : "transparent")};
`;

const StarContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 0;
`;

const Star = styled.span`
  font-size: 1rem;
  cursor: pointer;
  color: ${(props) => (props.filled ? '#FFD700' : '#ccc')};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content:center
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  width:250px;
`;

const Input = styled.input`
  padding: 0.5rem;
  flex: 1;
  border-radius: 4px;
  max-width:250px;
`;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Month options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to log in first');
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        window.location.href = '/login'; // Redirect if no token
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/travel/user/packages', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          alert('You need to log in first');
          localStorage.removeItem('token')
          localStorage.removeItem('role')
          window.location.href = '/login'; // Redirect if no token
          return;
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        console.log({ data });

        setOrders(data.packages || []);
      } catch (error) {
        setError('Error fetching orders');
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        console.error('Error:', error);
        alert('You need to log in first');
        window.location.href = '/login'; // Redirect if no token
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Empty dependency array makes it run once after initial render

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const startMonth = new Date(order.bookingStartDate).getMonth();
      const endMonth = new Date(order.bookingEndDate).getMonth();

      // Filter by month
      const matchesMonth = selectedMonth === '' ||
        parseInt(selectedMonth) === startMonth ||
        parseInt(selectedMonth) === endMonth;

      // Filter by search query
      const query = searchQuery.toLowerCase();
      const matchesSearch = order.travel?.name?.toLowerCase().includes(query) ||
        String(order.amount).includes(query) ||
        String(order.quantity).includes(query);

      return matchesMonth && matchesSearch;
    });
  }, [orders, selectedMonth, searchQuery]);


  const handleReviewSubmit = (message) => {
    toast(message)
    window.location.reload();
    // Show toast here
  };

  const openReviewModal = (packageId) => {
    setSelectedPackageId(packageId);
    setShowModal(true);
  };

  const navigationHandler = (id) => {
    window.location.href = '/myorders/' + id
  }

  return (
    <Template>
      {loading ? <Loader /> :
        <OrderListWrapper>
          <Title>Your Orders</Title>
          <FilterContainer>
            <Select onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth}>
              <option value="">All Months</option>
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </Select>

            <Input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </FilterContainer>

          {filteredOrders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <OrderContainer>
              {filteredOrders.map((order, index) => (
                <OrderCard key={index} >
                  <Image onClick={() => navigationHandler(order._id)} title='click to see detttails' src={`http://localhost:5001/${order.images?.[0]}`} />
                  <OrderCardHeader>
                    <OrderID><strong>Order #{order._id.slice(0, 5)}</strong></OrderID>
                    <OrderInfo><strong>City:</strong> {order?.city?.name || 'NA'}</OrderInfo>
                    <OrderInfo><strong>Date:</strong> {new Date(order.ownedDate).toLocaleDateString()}</OrderInfo>
                  </OrderCardHeader>

                  {/* Show Travel Package Information */}
                  <TravelInfo>
                    <TravelName onClick={() => navigationHandler(order.travel._id)} title='click to see detttails'>{order.travel.name}</TravelName>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ width: '50%' }}>
                        <OrderInfo><strong>Number of Person:</strong>&nbsp;{order.quantity}</OrderInfo>
                        <OrderInfo><strong>Status:</strong>&nbsp;{order.status == "paid" ? order.status : 'Cancelled'}</OrderInfo>
                        <OrderInfo><strong>Total:</strong> ₹{order.amount}</OrderInfo>
                      </div>
                      <div style={{ width: '50%', textAlign: 'end' }}>
                        <OrderInfo><strong>Duration:</strong> {order.duration} Day {order.duration > 1 ? `& ${order.duration - 1} Night` : null}</OrderInfo>
                        <OrderInfo><strong>Start Date:</strong> {new Date(order.bookingStartDate).toLocaleDateString()}</OrderInfo>
                        <OrderInfo><strong>End Date:</strong> {new Date(order.bookingEndDate).toLocaleDateString()}</OrderInfo>
                      </div>
                    </div>
                  </TravelInfo>

                  {/* Check if User has Reviewed the Travel Package */}
                  {order.travel.hasReviewed ? (
                    <ReviewSection>
                      {order.travel.reviews.map((review, idx) => (
                        review.user === order.ownedBy && (
                          <ReviewCard key={idx}>
                            <StarContainer>

                              <StarContainer>
                                {[1, 2, 3, 4, 5].map((starIndex) => (
                                  <Star
                                    key={starIndex}
                                    filled={starIndex <= review.rating}
                                  >
                                    ★
                                  </Star>
                                ))}
                              </StarContainer>
                              <ReviewDate>Reviewed on: {new Date(review.date).toLocaleDateString()}</ReviewDate>
                            </StarContainer>
                            <ReviewText>{review.description}</ReviewText>
                          </ReviewCard>
                        )
                      ))}
                    </ReviewSection>
                  ) : (
                    <ReviewText style={{ zIndex: '111' }} onClick={() => openReviewModal(order.travel._id)}>add review for this package.</ReviewText>
                  )}
                </OrderCard>
              ))}
            </OrderContainer>
          )}
          {selectedPackageId && (
            <ReviewModal
              showModal={showModal}
              setShowModal={setShowModal}
              packageId={selectedPackageId}
              onReviewSubmit={handleReviewSubmit}
            />
          )}
        </OrderListWrapper>}
    </Template>
  );
};

export default OrderList;
