import React from 'react';
import './team.css';

const teamData = [
  {
    name: "Kylex",
    title: "CEO",
    image: "../Team/kylex.jpg",
    social: [
      { platform: "Github", iconClass: "fab fa-github", link: "https://github.com/Kylexvin" },
      { platform: "Instagram", iconClass: "fab fa-instagram", link: "https://www.instagram.com/vinny_kylex?igsh=MTJwZ2tjNm95ejZuMQ==" },
      { platform: "LinkedIn", iconClass: "fab fa-linkedin-in", link: "https://www.linkedin.com/in/vinny-kylex-?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" }
    ]
  },
  {
    name: "Sejjo",
    title: "CTO",
    image: "../Team/sejjo.jpg",
    social: [
      { platform: "Twitter", iconClass: "fab fa-twitter", link: "https://twitter.com/sejjo_profile" },
      { platform: "Instagram", iconClass: "fab fa-instagram", link: "https://www.instagram.com/sejjo_profile" },
      { platform: "Facebook", iconClass: "fab fa-facebook-f", link: "https://www.facebook.com/sejjo_profile" },
      { platform: "LinkedIn", iconClass: "fab fa-linkedin-in", link: "https://www.linkedin.com/in/sejjo_profile" }
    ]
  },
  {
    name: "Lannie",
    title: "CMO",
    image: "../Team/lannie.jpg",
    social: [
      { platform: "Twitter", iconClass: "fab fa-twitter", link: "https://twitter.com/lannie_profile" },
      { platform: "Instagram", iconClass: "fab fa-instagram", link: "https://www.instagram.com/lannie_profile" },
      { platform: "Facebook", iconClass: "fab fa-facebook-f", link: "https://www.facebook.com/lannie_profile" },
      { platform: "LinkedIn", iconClass: "fab fa-linkedin-in", link: "https://www.linkedin.com/in/lannie_profile" }
    ]
  },
 
  {
    name: "Valentine",
    title: "Customer Support",
    image: "../Team/vall.jpg",
    social: [
      { platform: "Twitter", iconClass: "fab fa-twitter", link: "https://twitter.com/valentine_profile" },
      { platform: "Instagram", iconClass: "fab fa-instagram", link: "https://www.instagram.com/valentine_profile" },
      { platform: "Facebook", iconClass: "fab fa-facebook-f", link: "https://www.facebook.com/valentine_profile" },
      { platform: "LinkedIn", iconClass: "fab fa-linkedin-in", link: "https://www.linkedin.com/in/valentine_profile" }
    ]
  }
];

const OurTeam = () => (
  <>
    <div className="client-container">
      {teamData.map(member => (
        <TeamMember key={member.name} {...member} />
      ))}
    </div>
    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
      <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
    </svg> */}
  </>
);

const TeamMember = ({ name, title, image, social }) => (
  <div className="card-client">
    <div className="user-picture">
      <img src={image} alt={name} />
    </div>
    <p className="name-client">
      {name}
      <span>{title}</span>
    </p>
    <div className="social-media">
      {social.map((socialItem, index) => (
        <SocialIcon key={index} {...socialItem} />
      ))}
    </div>
  </div>
);

const SocialIcon = ({ platform, iconClass, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="social-icon">
    <i className={iconClass}></i>
    <span className="tooltip-social">{platform}</span>
  </a>
);

export default OurTeam;