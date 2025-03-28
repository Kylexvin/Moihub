import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';
import { Calendar, Clock, CreditCard, Map, CheckCircle, X, ArrowLeft, Search, Filter, Download, SortDesc } from 'lucide-react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize pdfMake
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('token') ? true : false;
  
  // Function to handle download all bookings
  const downloadAllBookings = () => {
    if (isPrinting || bookings.length === 0) return;
    
    setIsPrinting(true);
    toast.info('Preparing your bookings for download...', {
      position: "top-right",
      autoClose: 2000
    });
    
    try {
      // Create a well-structured PDF document definition
      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        header: {
          text: 'MoiLink Travellers',
          alignment: 'center',
          margin: [0, 20, 0, 10],
          style: 'header'
        },
        footer: function(currentPage, pageCount) {
          return {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: 'center',
            margin: [0, 10, 0, 0],
            style: 'footer'
          };
        },
        content: [
          {
            text: 'All Bookings',
            style: 'subheader',
            alignment: 'center',
            margin: [0, 0, 0, 5]
          },
          {
            text: `Generated on: ${new Date().toLocaleString()}`,
            style: 'date',
            alignment: 'center',
            margin: [0, 0, 0, 20]
          },
          // The bookings will be added here
        ],
        styles: {
          header: {
            fontSize: 22,
            bold: true,
            color: '#FF6600' // Orange color matching your UI
          },
          subheader: {
            fontSize: 16,
            bold: true
          },
          date: {
            fontSize: 10,
            color: '#666666'
          },
          footer: {
            fontSize: 8,
            color: '#666666'
          },
          bookingHeader: {
            fontSize: 14,
            bold: true,
            color: 'white',
            fillColor: function(rowIndex, node, columnIndex) {
              return getStatusColor(bookings[rowIndex].status);
            },
            margin: [0, 5, 0, 5]
          },
          tableHeader: {
            bold: true,
            fontSize: 10,
            color: '#666666'
          },
          tableValue: {
            fontSize: 10
          },
          statusBadge: {
            fontSize: 10,
            bold: true,
            alignment: 'center'
          }
        }
      };
      
      // Function to determine color based on status
      const getStatusColor = (status) => {
        switch(status) {
          case 'confirmed': return '#4CAF50'; // Green
          case 'pending': return '#FF9800';   // Yellow/Orange
          case 'cancelled': return '#F44336'; // Red
          default: return '#9E9E9E';          // Gray
        }
      };
      
      // Function to get status badge style
      const getStatusBadgeStyle = (status) => {
        let color;
        switch(status) {
          case 'confirmed': color = '#4CAF50'; break;
          case 'pending': color = '#FF9800'; break;
          case 'cancelled': color = '#F44336'; break;
          default: color = '#9E9E9E';
        }
        
        return {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          color: color
        };
      };
      
      // Add each booking as a separate section
      bookings.forEach((booking, index) => {
        // Status display with appropriate color
        const statusText = booking.status ? 
          booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'N/A';
        
        const bookingSection = {
          stack: [
            {
              table: {
                headerRows: 1,
                widths: ['*'],
                body: [
                  [
                    {
                      text: booking.route?.name || 'Unknown Route',
                      style: 'bookingHeader'
                    }
                  ]
                ]
              },
              layout: {
                fillColor: function(rowIndex, node, columnIndex) {
                  return (rowIndex === 0) ? getStatusColor(booking.status) : null;
                }
              }
            },
            // Status badge
            {
              text: statusText,
              style: 'statusBadge',
              color: getStatusColor(booking.status),
              margin: [0, 5, 0, 10]
            },
            // Booking details table
            {
              table: {
                widths: ['auto', '*'],
                body: [
                  [
                    { text: 'Number Plate', style: 'tableHeader' },
                    { text: booking.matatu?.registrationNumber || 'N/A', style: 'tableValue' }
                  ],
                  [
                    { text: 'Seat Number', style: 'tableHeader' },
                    { text: booking.seatNumber || 'N/A', style: 'tableValue' }
                  ],
                  [
                    { text: 'Booking Date', style: 'tableHeader' },
                    { 
                      text: new Date(booking.travelDate).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      }), 
                      style: 'tableValue' 
                    }
                  ],
                  [
                    { text: 'Departure Time', style: 'tableHeader' },
                    { text: booking.matatu?.departureTime || 'N/A', style: 'tableValue' }
                  ],
                  [
                    { text: 'Fare', style: 'tableHeader' },
                    { text: `Ksh ${booking.fare}`, style: 'tableValue' }
                  ]
                ]
              },
              layout: 'lightHorizontalLines'
            },
            // Booking ID for reference
            {
              text: `Booking ID: ${booking._id || 'N/A'}`,
              fontSize: 8,
              color: '#999999',
              alignment: 'right',
              margin: [0, 5, 0, 0]
            }
          ],
          margin: [0, 0, 0, 20]
        };
        
        // Add a page break before all bookings except the first one
        if (index > 0) {
          docDefinition.content.push({ text: '', pageBreak: 'before' });
        }
        
        docDefinition.content.push(bookingSection);
      });
      
      // Add summary at the end
      docDefinition.content.push({
        text: 'Thank you for traveling with MoiLink Travellers',
        alignment: 'center',
        style: 'subheader',
        margin: [0, 20, 0, 5]
      });
      
      // Generate and download the PDF
      pdfMake.createPdf(docDefinition).download(`MoiLink_All_Bookings_${new Date().toLocaleDateString()}.pdf`);
      
      toast.success('All bookings downloaded successfully!', {
        position: "top-right",
        autoClose: 3000
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to download bookings. Please try again.', {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setIsPrinting(false);
    }
  };
  
  useEffect(() => {
    // Existing fetchBookings function remains the same
    const fetchBookings = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Add query params for filtering, sorting and pagination
        const response = await axios.get(
          `https://moihub.onrender.com/api/bookings/user`, {
          params: {
            status: filterStatus !== 'all' ? filterStatus : undefined,
            search: searchTerm || undefined,
            sort: sortBy,
            page,
            limit
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setBookings(response.data.bookings);
        setTotalPages(Math.ceil(response.data.total / limit));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to fetch your bookings. Please try again later.');
        setLoading(false);
        
        if (err.response && err.response.status === 401) {
          toast.error('Session expired. Please login again.', {
            position: "top-right",
            autoClose: 3000
          });
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    
    fetchBookings();
  }, [navigate, isAuthenticated, filterStatus, searchTerm, sortBy, page, limit]);
  
  // Get the status badge class and text - This remains the same for the UI
  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return {
          className: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle size={14} className="mr-1" />,
          text: 'Confirmed'
        };
      case 'pending':
        return {
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock size={14} className="mr-1" />,
          text: 'Pending'
        };
      case 'cancelled':
        return {
          className: 'bg-red-100 text-red-800 border-red-200',
          icon: <X size={14} className="mr-1" />,
          text: 'Cancelled'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: null,
          text: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'
        };
    }
  };
  
  // Booking card component for UI display - remains the same
  const BookingCard = ({ booking }) => {
    const statusBadge = getStatusBadge(booking.status);
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className={`py-3 px-4 ${
          booking.status === 'confirmed' ? 'bg-orange-600' : 
          booking.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'
        } text-white flex justify-between items-center`}>
          <h3 className="font-semibold">{booking.route?.name || 'Unknown Route'}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusBadge.className}`}>
            {statusBadge.icon}
            {statusBadge.text}
          </span>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <div className="text-center">
              <div className="border-t border-gray-300 w-16 mt-3"></div>
            </div>
          </div>
          
          <div className="mb-4 flex justify-center">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <QRCode 
                value={booking.qr_verification_link || booking._id || 'N/A'}
                size={150}
                level="H"
              />
              <p className="text-xs text-center mt-2 text-red-500">For Admin to scan</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded flex items-start">
              <div className="mt-1 mr-2">
                <Map size={14} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Number Plate</p>
                <p className="font-semibold">{booking.matatu?.registrationNumber || 'N/A'}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded flex items-start">
              <div className="mt-1 mr-2">
                <CheckCircle size={14} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Seat</p>
                <p className="font-semibold">{booking.seatNumber || 'N/A'}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded flex items-start">
              <div className="mt-1 mr-2">
                <Calendar size={14} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Booking Date</p>
                <p className="font-semibold">{new Date(booking.travelDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded flex items-start">
              <div className="mt-1 mr-2">
                <Clock size={14} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Departure</p>
                <p className="font-semibold">{booking.matatu?.departureTime || 'N/A'}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded flex items-start col-span-2">
              <div className="mt-1 mr-2">
                <CreditCard size={14} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Fare</p>
                <p className="font-semibold">Ksh {booking.fare}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // The rest of your component remains the same...
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your bookings.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading your bookings...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md w-full shadow-md" role="alert">
          <div className="flex items-center mb-2">
            <X size={20} className="mr-2" />
            <p className="font-bold text-lg">Error</p>
          </div>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/moilinktravellers')}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  if (bookings.length === 0 && !searchTerm && filterStatus === 'all') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-blue-100 p-4">
              <Calendar size={32} className="text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Bookings Found</h2>
          <p className="text-gray-600 mb-6">You don't have any bookings yet. Book a trip to get started!</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate('/moilinktravellers')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
            >
              Book a Trip
            </button>
            <button 
              onClick={() => navigate('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-md transition duration-300 flex items-center justify-center"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
            <p className="text-gray-500">Page {page} of {totalPages}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {bookings.length > 0 && (
              <button 
                onClick={downloadAllBookings}
                disabled={isPrinting}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center justify-center text-sm"
              >
                {isPrinting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Download size={16} className="mr-1" /> Download All Bookings
                  </>
                )}
              </button>
            )}
            <button 
              onClick={() => navigate('/moilinktravellers')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center justify-center text-sm"
            >
              Book a New Trip
            </button>
            <button 
              onClick={() => navigate('/moilinktravellers')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-300 flex items-center justify-center text-sm"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Home
            </button>
          </div>
        </div>
        
        {/* Search and filter bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by vehicle number, route or destination..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // Reset to first page when searching
                }}
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center">
                <Filter size={16} className="text-gray-400 mr-2" />
                <select
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setPage(1); // Reset to first page when filtering
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <SortDesc size={16} className="text-gray-400 mr-2" />
                <select
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="fare-desc">Highest Fare</option>
                  <option value="fare-asc">Lowest Fare</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No bookings match your search criteria. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-md ${
                    page === 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Create a window of 5 pages centered on the current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 rounded-md ${
                        page === pageNum 
                          ? 'bg-blue-700 text-white' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    page === totalPages 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;