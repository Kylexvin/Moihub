import React, { useState } from 'react';
import './RoommateFinder.css'; // Import CSS file for styling

const RoommateCard = ({ name, yearOfStudy, description, hobbies, gender, phoneNumber, contact }) => {
  const cardStyle = {
    backgroundColor: gender === 'male' ? '#6495ED' : 'magenta', // Using hexadecimal color codes for blue and pink
    color: 'white',
    padding: '20px',
    margin: '10px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  };

  return (
    <>
    <div className="roommate-card" style={cardStyle}>
      <h3>{name}</h3>
      <p className='nemo'>Year of Study: {yearOfStudy}</p>
      <p className='nemo'>Description: {description}</p>
      <p className='nemo'>Hobbies: {hobbies}</p>
      <button onClick={() => contact(phoneNumber)}>Contact {gender === 'male' ? 'him' : 'her'} now <i className="fab fa-whatsapp"></i></button>
    </div>
     
   </>
  );
};

const RoommateFinder = () => {
  const [genderFilter, setGenderFilter] = useState('all'); // State for filtering
  const roommates = [
    {
      name: 'John',
      yearOfStudy: 'Senior',
      description: 'I love playing soccer and coding!',
      hobbies: '⚽️💻',
      gender: 'male',
      phoneNumber: '+1234567890', // Example phone number
    },
    {
      name: 'Emily',
      yearOfStudy: 'Junior',
      description: 'I enjoy cycling and reading books.',
      hobbies: '🚴‍♀️📚',
      gender: 'female',
      phoneNumber: '+9876543210', // Example phone number
    },

    {
        name: 'Anne',
        yearOfStudy: 'Junior',
        description: 'I enjoy cycling and reading books.',
        hobbies: '🚴‍♀️📚',
        gender: 'female',
        phoneNumber: '+9876543210', // Example phone number
      },
      {
        name: 'Lannie',
        yearOfStudy: 'Junior',
        description: 'I enjoy cycling and reading books.',
        hobbies: '🚴‍♀️📚',
        gender: 'male',
        phoneNumber: '+9876543210', // Example phone number
      },
    // Add more roommates as needed
  ];

  const handleContact = (phoneNumber) => {
    const whatsappLink = `https://wa.me/${phoneNumber}`; // WhatsApp link
    window.open(whatsappLink); // Open WhatsApp link in new tab
  };

  const filteredRoommates = genderFilter === 'all' ? roommates : roommates.filter(roommate => roommate.gender === genderFilter);

  return (
    <div className="roommate-finder">
      <h2>Welcome to Roommate Finder</h2>
      <div className="filter-buttons">
        <button onClick={() => setGenderFilter('all')}>All</button>
        <button onClick={() => setGenderFilter('male')} style={{ backgroundColor: '#6495ED' }}>Male</button>
        <button onClick={() => setGenderFilter('female')} style={{ backgroundColor: 'magenta' }}>Female</button>
      </div>
      <div className="roommate-list">
        {filteredRoommates.map((roommate, index) => (
          <RoommateCard
            key={index}
            {...roommate}
            contact={handleContact}
          />
        ))}
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
     <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
   </svg>
    </div>
  );
};

export default RoommateFinder;