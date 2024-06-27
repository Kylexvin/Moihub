import React from 'react';
import './team.css';

const teamData = [
  {
    name: "Kylex",
    title: "CEO of MoiHub",
    image: "../Team/kylex.jpg",
    social: [
      { platform: "Twitter", iconClass: "fab fa-whatsapp" },
      { platform: "Instagram", iconClass: "fab fa-instagram" },
      { platform: "LinkedIn", iconClass: "fab fa-linkedin-in" }
    ]
  },
  {
    name: "Sejjo",
    title: "CTO MoiHub",
    image: "../Team/sejjo.jpg",
    social: [
      { platform: "Twitter", iconClass: "fab fa-twitter" },
      { platform: "Instagram", iconClass: "fab fa-instagram" },
      { platform: "Facebook", iconClass: "fab fa-facebook-f" },
      { platform: "LinkedIn", iconClass: "fab fa-linkedin-in" }
    ]
  },
  {
    name: "Lannie",
    title: "CMO MoiHub",
    image: "../Team/lannie.jpg",
    social: [
      { platform: "Twitter", iconClass: "fab fa-twitter" },
      { platform: "Instagram", iconClass: "fab fa-instagram" },
      { platform: "Facebook", iconClass: "fab fa-facebook-f" },
      { platform: "LinkedIn", iconClass: "fab fa-linkedin-in" }
    ]
  },
  {
    name: "Tekashi",
    title: "GM MoiHub",
    image: "../Team/tekashi.jpg",
    social: [
      { platform: "Twitter", iconClass: "fab fa-twitter" },
      { platform: "Instagram", iconClass: "fab fa-instagram" },
      { platform: "Facebook", iconClass: "fab fa-facebook-f" },
      { platform: "LinkedIn", iconClass: "fab fa-linkedin-in" }
    ]
  },
  {
    name: "Valentine",
    title: "Customer Care MoiHub",
    image: "../Team/vall.jpg",
    social: [
      { platform: "Twitter", iconClass: "fab fa-twitter" },
      { platform: "Instagram", iconClass: "fab fa-instagram" },
      { platform: "Facebook", iconClass: "fab fa-facebook-f" },
      { platform: "LinkedIn", iconClass: "fab fa-linkedin-in" }
    ]
  }
];

const OurTeam = () => (
    <>
  <div className="client-container">
    {teamData.map(member => (
      <div className="card-client" key={member.name}>
        <div className="user-picture">
          <img src={member.image} alt={member.name} />
        </div>
        <p className="name-client">
          {member.name}
          <span>{member.title}</span>
        </p>
        <div className="social-media">
          {member.social.map((social, index) => (
            <a href="#" key={index} className="social-icon">
              <i className={social.iconClass}></i>
              <span className="tooltip-social">{social.platform}</span>
            </a>
          ))}
        </div>
      </div>
    ))}
  </div>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
        <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
      </svg>
  </>
);

export default OurTeam;
