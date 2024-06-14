import React from 'react';
import './team.css';

const teamData = [
  {
    name: "Kylex",
    title: "CEO of MoiHub",
    image: "../Team/kylex.jpg",
    social: [
      { platform: "Twitter", iconClass: "fab fa-twitter" },
      { platform: "Instagram", iconClass: "fab fa-instagram" },
      { platform: "Facebook", iconClass: "fab fa-facebook-f" },
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
    name: "valentine",
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
);

export default OurTeam;
