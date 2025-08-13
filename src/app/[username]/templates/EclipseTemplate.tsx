"use client";

import { useEffect, useState } from "react";
import { Profile } from "../../../lib/schema";
import "../templates/styles/EclipseTemplate.css";

interface PortfolioClientProps {
  profile: Profile;
}

const PortfolioClient = ({ profile }: PortfolioClientProps) => {
  const [activeTab, setActiveTab] = useState<string>("frontend"); // Set frontend as default active tab
  const [isPortfolioPopupOpen, setIsPortfolioPopupOpen] = useState(false);
  const [portfolioItemDetails, setPortfolioItemDetails] = useState({
    imgSrc: "",
    title: "",
    details: "",
    created: "",
    technologies: "",
    role: "",
    liveUrl: "",
    sourceUrl: "",
  });
  const [activeModal, setActiveModal] = useState<number | null>(null);
  const [activePortfolio, setActivePortfolio] = useState<number | null>(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Handle contact form input changes
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input focus for floating labels
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const container = e.target.parentElement;
    if (container) {
      container.classList.add('focus');
    }
  };

  // Handle input blur for floating labels
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const container = e.target.parentElement;
    if (container && !e.target.value) {
      container.classList.remove('focus');
    }
  };

  // Handle contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // FormSubmit will handle the actual submission
    // The form action will automatically send the email
    console.log('Contact form submitted:', contactForm);
    
    // Reset form after submission
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Show success message (you can add a toast notification here if needed)
    alert('Message sent successfully!');
  };

  // Handle contact button clicks
  const handleContactButtonClick = (type: string) => {
    switch (type) {
      case 'email':
        if (profile.email) {
          window.location.href = `mailto:${profile.email}`;
        }
        break;
      case 'linkedin':
        if (profile.social_links?.linkedin) {
          window.open(profile.social_links.linkedin, '_blank');
        }
        break;
      case 'github':
        if (profile.social_links?.github) {
          window.open(profile.social_links.github, '_blank');
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const navHighlighter = () => {
      let scrollY = window.pageYOffset;
      sections.forEach((current: any) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document
            .querySelector(".nav-menu a[href*=" + sectionId + "]")
            ?.classList.add("active-link");
        } else {
          document
            .querySelector(".nav-menu a[href*=" + sectionId + "]")
            ?.classList.remove("active-link");
        }
      });
    };

    // Scroll animations
    const animateOnScroll = () => {
      const animatedElements = document.querySelectorAll('.animate-on-scroll, .slide-in-left, .slide-in-right, .slide-in-up, .slide-in-down, .scale-in, .rotate-in, .bounce-in, .fade-in, .fade-in-up');
      
      animatedElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate');
        }
      });

      // Animate section titles
      const sectionTitles = document.querySelectorAll('.section-title');
      sectionTitles.forEach((title) => {
        const titleTop = title.getBoundingClientRect().top;
        if (titleTop < window.innerHeight - 100) {
          title.classList.add('animate');
        }
      });
    };

    // Mobile menu functionality
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('sidebar');
    const navClose = document.querySelector('.nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

    // Show menu
    const showMenu = () => {
      if (sidebar) {
        sidebar.classList.add('show-sidebar');
        document.body.classList.add('sidebar-open');
      }
    };

    // Hide menu
    const hideMenu = () => {
      if (sidebar) {
        sidebar.classList.remove('show-sidebar');
        document.body.classList.remove('sidebar-open');
      }
    };

    // Toggle menu when hamburger is clicked
    if (navToggle) {
      navToggle.addEventListener('click', showMenu);
    }

    // Hide menu when close button is clicked
    if (navClose) {
      navClose.addEventListener('click', hideMenu);
    }

    // Hide menu when nav link is clicked (for mobile)
    navLinks.forEach(link => {
      link.addEventListener('click', hideMenu);
    });

    const handleScroll = () => {
      navHighlighter();
      animateOnScroll();
    };

    window.addEventListener("scroll", handleScroll);
    
    // Trigger animation on initial load
    animateOnScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      
      // Cleanup event listeners
      if (navToggle) {
        navToggle.removeEventListener('click', showMenu);
      }
      if (navClose) {
        navClose.removeEventListener('click', hideMenu);
      }
      navLinks.forEach(link => {
        link.removeEventListener('click', hideMenu);
      });
    };
  }, []);

  useEffect(() => {
    // Set the first skill category as active by default
    if (profile.skills_categories && profile.skills_categories.length > 0) {
      const firstCategory = profile.skills_categories[0].category.toLowerCase();
      setActiveTab(firstCategory);
    } else if (defaultSkillsCategories.length > 0) {
      // Fallback to default categories if no profile skills
      setActiveTab(defaultSkillsCategories[0].category.toLowerCase());
    }
  }, [profile.skills_categories]);

  // Set initial focus state for form fields with values
  useEffect(() => {
    const inputs = document.querySelectorAll('.input-container input, .input-container textarea');
    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        if (input.value) {
          const container = input.parentElement;
          if (container) {
            container.classList.add('focus');
          }
        }
      }
    });
  }, [contactForm]);

  const handleTabClick = (category: string) => {
    setActiveTab(category);
  };

  const openPortfolioPopup = (
    imgSrc: string,
    title: string,
    details: string,
    created: string,
    technologies: string,
    role: string,
    liveUrl: string,
    sourceUrl: string
  ) => {
    setPortfolioItemDetails({ imgSrc, title, details, created, technologies, role, liveUrl, sourceUrl });
    setIsPortfolioPopupOpen(true);
  };

  const closePortfolioPopup = () => {
    setIsPortfolioPopupOpen(false);
  };

  const openModal = (index: number) => {
    setActiveModal(index);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Helper function to get skill category data
  const getSkillsCategory = (category: string) => {
    return profile.skills_categories?.find(cat => cat.category.toLowerCase() === category);
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get initials for logo
  const getInitials = (name?: string) => {
    if (!name) return "D";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Default data fallbacks
  const defaultSkillsCategories = [
    {
      category: "Frontend",
      icon: "uil-brackets-curly",
      title: "Frontend Developer",
      subtitle: "More than 4 years",
      skills: [
        { name: "HTML", percentage: 90 },
        { name: "CSS", percentage: 90 },
        { name: "JavaScript", percentage: 80 },
        { name: "React", percentage: 85 }
      ]
    },
    {
      category: "Design",
      icon: "uil-swatchbook", 
      title: "UI / UX Design",
      subtitle: "More than 5 years",
      skills: [
        { name: "Figma", percentage: 90 },
        { name: "Sketch", percentage: 80 },
        { name: "PhotoShop", percentage: 70 }
      ]
    },
    {
      category: "Backend",
      icon: "uil-server-network",
      title: "Backend Developer", 
      subtitle: "More than 2 years",
      skills: [
        { name: "PHP", percentage: 80 },
        { name: "Python", percentage: 80 },
        { name: "MySQL", percentage: 70 },
        { name: "Firebase", percentage: 75 }
      ]
    }
  ];

  const defaultEducation = [
    {
      institution: "XYZ University (Sometown, NJ)",
      degree: "BFA in Graphic Design",
      period: "2011 - 2013"
    },
    {
      institution: "ABC University (Sometown, NJ)",
      degree: "Diploma in Web Design", 
      period: "2013 - 2015"
    },
    {
      institution: "KLM University (Sometown, NJ)",
      degree: "BS in Web Development",
      period: "2015 - 2017"
    }
  ];

  const defaultExperience = [
    {
      company: "Copalopa Inc. (Sometown, NJ)",
      position: "Lead / Senior UX Designer",
      period: "2018 - Present"
    },
    {
      company: "Gabogle Inc. (Sometown, NJ)",
      position: "Web site / UX Designer",
      period: "2015 - 2018" 
    },
    {
      company: "Copalopa Inc. (Sometown, NJ)",
      position: "Junior UX Designer",
      period: "2013 - 2015"
    }
  ];

  const defaultAboutStats = [
    {
      icon: "uil-graduation-cap",
      title: "Education", 
      subtitle: "BTech Graduate"
    },
    {
      icon: "uil-trophy",
      title: "Projects",
      subtitle: "15+ Completed"
    },
    {
      icon: "uil-rocket", 
      title: "Passion",
      subtitle: "Always Learning"
    }
  ];

  const defaultServices = [
    {
      icon: "uil-web-grid",
      title: "Web Designer",
      description: "User Interface Development, Web Page Development, Responsive Design, Performance Optimization"
    },
    {
      icon: "uil-arrow",
      title: "UI/UX Designer", 
      description: "Usability Testing, User Research, Wireframing & Prototyping, Design Systems"
    },
    {
      icon: "uil-monitor",
      title: "Mobile Developer",
      description: "React Native Development, iOS & Android Apps, Cross-Platform Development, App Store Deployment"
    }
  ];

  return (
    <>
      <div className="nav-toggle" id="nav-toggle">
        <i className="uil uil-bars"></i>
      </div>

      <aside className="sidebar" id="sidebar">
        <nav className="nav">
          <div className="nav-logo">
            <a href="#" className="nav-logo-text">
              {getInitials(profile.full_name)}
            </a>
          </div>

          <div className="nav-menu">
            <div className="menu">
              <ul className="nav-list">
                <li className="nav-item">
                  <a href="#home" className="nav-link active-link">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#about" className="nav-link">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#skills" className="nav-link">
                    Skills
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#work" className="nav-link">
                    Work
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#services" className="nav-link">
                    Services
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#contact" className="nav-link">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="btn-share">
            <i className="uil uil-share-alt social-share"></i>
          </div>

          <div className="nav-close" id="nav-close">
            <i className="uil uil-times"></i>
          </div>
        </nav>
      </aside>

      <main className="main">
        <section className="home" id="home">
          <div className="home-container container">
            <div className="home-social">
              <span className="home-social-follow">Follow Me</span>
              <div className="home-social-links">
                {profile.social_links?.linkedin && (
                  <a
                    href={profile.social_links.linkedin}
                    target="_blank"
                    className="home-social-link"
                  >
                    <i className="uil uil-linkedin"></i>
                  </a>
                )}

                {profile.social_links?.github && (
                  <a
                    href={profile.social_links.github}
                    target="_blank"
                    className="home-social-link"
                  >
                    <i className="uil uil-github"></i>
                  </a>
                )}

                {profile.social_links?.twitter && (
                  <a
                    href={profile.social_links.twitter}
                    target="_blank"
                    className="home-social-link"
                  >
                    <i className="uil uil-twitter"></i>
                  </a>
                )}
              </div>
            </div>

            <div className="home-image-container float-animation">
              <img
                src={profile.avatar_url || "https://i.postimg.cc/3NgvPcZD/home-img.png"}
                alt={profile.full_name || "Profile"}
                className="home-img scale-in"
              />
            </div>

            <div className="home-content">
              <div className="home-data">
                <h1 className="home-title">Hi, I'm {profile.full_name || profile.username}</h1>
                <h3 className="home-subtitle">{profile.headline || "Developer"}</h3>
                <p className="home-description">
                  {profile.bio || "Passionate developer creating amazing digital experiences"}
                </p>
                <a href="#about" className="button pulse-animation">
                  <i className="uil uil-user button-icon"></i>
                  More About me!
                </a>
              </div>
            </div>

            <div className="my-info">
              {profile.social_links?.linkedin && (
                <div className="info-item">
                  <i className="uil uil-linkedin info-icon"></i>
                  <div>
                    <h3 className="info-title">LinkedIn</h3>
                    <span className="info-subtitle">
                      {profile.social_links.linkedin.replace('https://', '')}
                    </span>
                  </div>
                </div>
              )}

              {profile.social_links?.github && (
                <div className="info-item">
                  <i className="uil uil-github info-icon"></i>
                  <div>
                    <h3 className="info-title">GitHub</h3>
                    <span className="info-subtitle">
                      {profile.social_links.github.replace('https://', '')}
                    </span>
                  </div>
                </div>
              )}

              {profile.email && (
                <div className="info-item">
                  <i className="uil uil-envelope-edit info-icon"></i>
                  <div>
                    <h3 className="info-title">Email</h3>
                    <span className="info-subtitle">{profile.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="about section animate-on-scroll" id="about">
          <h2 className="section-title" data-heading="My Intro">
            About me
          </h2>

          <div className="about-container container grid">
            <img
              src={profile.avatar_url || "https://i.postimg.cc/W1YZxTpJ/about-img.jpg"}
              alt={profile.full_name}
              className="about-img slide-in-left"
            />

            <div className="about-data slide-in-right">
              <h3 className="about-heading">
                Hi, I'm {profile.full_name || profile.username}, passionate developer
              </h3>
              <p className="about-description">
                {profile.about_description || "I'm a dedicated developer with strong foundation in modern web technologies. Through academic projects and continuous learning, I've developed skills in frontend and backend development."}
              </p>

              <div className="about-info stagger-children">
                {(profile.about_stats || defaultAboutStats).map((stat, index) => (
                  <div key={index} className="about-box animate-on-scroll">
                    <i className={`uil ${stat.icon} about-icon`}></i>
                    <h3 className="about-title">{stat.title}</h3>
                    <span className="about-subtitle">{stat.subtitle}</span>
                  </div>
                ))}
              </div>

              <a href="#contact" className="button bounce-in">
                <i className="uil uil-navigator button-icon"></i>Contact me
              </a>
            </div>
          </div>
        </section>

        <section className="qualification section animate-on-scroll">
          <h2 className="section-title" data-heading="My Journey">
            Qualifications
          </h2>

          <div className="qualification-container container grid">
            <div className="education slide-in-left">
              <h3 className="qualification-title">
                <i className="uil uil-graduation-cap"></i>Education
              </h3>

              <div className="timeline stagger-children">
                {(profile.education || defaultEducation).map((edu, index) => (
                  <div key={index} className="timeline-item animate-on-scroll">
                    <div className="circle-dot"></div>
                    <h3 className="timeline-title">{edu.institution}</h3>
                    <p className="timeline-text">{edu.degree}</p>
                    <span className="timeline-date">
                      <i className="uil uil-calendar-alt"></i>{edu.period}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="experience slide-in-right">
              <h3 className="qualification-title">
                <i className="uil uil-suitcase"></i>Experience
              </h3>

              <div className="timeline stagger-children">
                {(profile.experience || defaultExperience).map((exp, index) => (
                  <div key={index} className="timeline-item animate-on-scroll">
                    <div className="circle-dot"></div>
                    <h3 className="timeline-title">{exp.company}</h3>
                    <p className="timeline-text">{exp.position}</p>
                    <span className="timeline-date">
                      <i className="uil uil-calendar-alt"></i>{exp.period}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="skills section animate-on-scroll" id="skills">
          <h2 className="section-title" data-heading="My Abilities">
            Skills
          </h2>

          <div className="skills-container container grid">
            <div className="skills-tabs slide-in-left">
              {(profile.skills_categories || defaultSkillsCategories).map((category, index) => (
                <div
                  key={category.category}
                  className={`skills-header ${
                    activeTab === category.category.toLowerCase() ? "skills-active" : ""
                  }`}
                  onClick={() => handleTabClick(category.category.toLowerCase())}
                >
                  <i className={`uil ${category.icon} skills-icon`}></i>

                  <div>
                    <h1 className="skills-title">{category.title}</h1>
                    <span className="skills-subtitle">{category.subtitle}</span>
                  </div>

                  <i className="uil uil-angle-down skills-arrow"></i>
                </div>
              ))}
            </div>

            <div className="skills-content slide-in-right">
              {(profile.skills_categories || defaultSkillsCategories).map((category) => (
                activeTab === category.category.toLowerCase() && (
                  <div key={category.category} className="skills-group skills-active">
                    <div className="skills-list grid">
                      {category.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="skills-data">
                          <div className="skills-titles">
                            <h3 className="skills-name">{skill.name}</h3>
                            <span className="skills-number">{skill.percentage}%</span>
                          </div>

                          <div className="skills-bar">
                            <span
                              className="skills-percentage"
                              style={{ width: `${skill.percentage}%` }}
                            ></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </section>

        <section className="work section fade-in-up" id="work">
          <h2 className="section-title slide-in-left" data-heading="My Portfolio">
            Recent Works
          </h2>

          <div className="work-container container grid stagger-children">
            {profile.projects?.map((project, index) => (
              <div key={index} className="work-card scale-in">
                <img
                  src={project.imageUrl || "https://i.postimg.cc/43Th5VXJ/work-1.png"}
                  alt={project.title}
                  className="work-img"
                />
                <h3 className="work-title">{project.title}</h3>
                <div className="work-buttons">
                  <a
                    href="#"
                    className="work-button"
                    onClick={(e) => {
                      e.preventDefault();
                      openPortfolioPopup(
                        project.imageUrl || "",
                        project.title,
                        project.description,
                        formatDate(project.startDate),
                        project.technologies?.join(", ") || "",
                        project.role || "Developer", // Use the new role field
                        project.liveUrl || "",
                        project.githubUrl || ""
                      );
                    }}
                  >
                    Details
                    <i className="uil uil-arrow-right work-button-icon"></i>
                  </a>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" className="work-button work-button-live">
                      View Live
                      <i className="uil uil-external-link-alt work-button-icon"></i>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" className="work-button work-button-source">
                      Source Code
                      <i className="uil uil-github work-button-icon"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {isPortfolioPopupOpen && (
          <div className="portfolio-popup open">
            <div className="portfolio-popup-inner">
              <div className="portfolio-popup-content grid">
                <span
                  className="portfolio-popup-close"
                  onClick={closePortfolioPopup}
                >
                  <i className="uil uil-times"></i>
                </span>
                <div className="pp-thumbnail">
                  <img
                    src={portfolioItemDetails.imgSrc}
                    alt=""
                    className="portfolio-popup-img"
                  />
                </div>
                <div className="portfolio-popup-info">
                  <div className="portfolio-popup-subtitle">
                    Featured - <span>{portfolioItemDetails.title}</span>
                  </div>
                  <div className="portfolio-popup-body">
                    <h3 className="details-title">
                      {portfolioItemDetails.title}
                    </h3>
                    <p className="details-description">
                      {portfolioItemDetails.details}
                    </p>
                    <ul className="details-info">
                      <li>
                        <span>Created - </span>{portfolioItemDetails.created}
                      </li>
                      <li>
                        <span>Technologies - </span>{portfolioItemDetails.technologies}
                      </li>
                      <li>
                        <span>Role - </span>{portfolioItemDetails.role}
                      </li>
                      {portfolioItemDetails.liveUrl && (
                        <li>
                          <span>Live URL - </span>
                          <a href={portfolioItemDetails.liveUrl} target="_blank" rel="noopener noreferrer">
                            {portfolioItemDetails.liveUrl}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="services section fade-in-up" id="services">
          <h2 className="section-title slide-in-left" data-heading="Services">
            What I Offer
          </h2>

          <div className="services-container container grid stagger-children">
            {(profile.services || defaultServices).map((service, index) => (
              <div key={index} className="services-content bounce-in">
                <div>
                  <i className={`uil ${service.icon} services-icon`}></i>
                  <h3 className="services-title">
                    {service.title.split(' ').map((word, i) => (
                      <span key={i}>
                        {word}
                        {i === 0 && <br />}
                        {i > 0 && i < service.title.split(' ').length - 1 && ' '}
                      </span>
                    ))}
                  </h3>
                </div>

                <span className="services-button" onClick={() => openModal(index)}>
                  <span className="services-button-text">View More</span>{" "}
                  <i className="uil uil-arrow-right services-button-icon"></i>
                </span>

                {activeModal === index && (
                  <div className="services-modal active-modal">
                    <div className="services-modal-content">
                      <i
                        className="uil uil-times services-modal-close"
                        onClick={closeModal}
                      ></i>

                      <h3 className="services-modal-title">{service.title}</h3>

                      <ul className="services-modal-services grid">
                        {service.description.split(', ').map((item, itemIndex) => (
                          <li key={itemIndex} className="services-modal-service">
                            <i className="uil uil-check-circle services-modal-icon"></i>
                            <p className="services-modal-info">{item}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="contact section fade-in-up" id="contact">
          <h2 className="section-title slide-in-left" data-heading="Get in Touch">
            Contact me
          </h2>

          <div className="contact-container container grid">
            <div className="contact-content slide-in-left">
              <div className="contact-info stagger-children">
                {profile.email && (
                  <div className="contact-card scale-in">
                    <i className="uil uil-envelope-edit contact-card-icon"></i>
                    <h3 className="contact-card-title">Email</h3>
                    <span className="contact-card-data">{profile.email}</span>
                    <span className="contact-button" onClick={() => handleContactButtonClick('email')}>
                      Write me
                      <i className="uil uil-arrow-right contact-button-icon"></i>
                    </span>
                  </div>
                )}

                {profile.social_links?.linkedin && (
                  <div className="contact-card scale-in">
                    <i className="uil uil-linkedin contact-card-icon"></i>
                    <h3 className="contact-card-title">LinkedIn</h3>
                    <span className="contact-card-data">
                      {profile.social_links.linkedin.replace('https://', '')}
                    </span>
                    <span className="contact-button" onClick={() => handleContactButtonClick('linkedin')}>
                      Connect
                      <i className="uil uil-arrow-right contact-button-icon"></i>
                    </span>
                  </div>
                )}

                {profile.social_links?.github && (
                  <div className="contact-card scale-in">
                    <i className="uil uil-github contact-card-icon"></i>
                    <h3 className="contact-card-title">GitHub</h3>
                    <span className="contact-card-data">
                      {profile.social_links.github.replace('https://', '')}
                    </span>
                    <span className="contact-button" onClick={() => handleContactButtonClick('github')}>
                      Follow me
                      <i className="uil uil-arrow-right contact-button-icon"></i>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="contact-content slide-in-right">
              <form 
                action="https://formsubmit.co/el/your-email-here" 
                method="POST"
                onSubmit={handleContactSubmit}
                className="contact-form"
              >
                {/* FormSubmit configuration fields */}
                <input type="hidden" name="_subject" value="New Contact Message from Portfolio" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_next" value={typeof window !== 'undefined' ? window.location.href : ''} />
                
                <div className="input-container">
                  <input 
                    type="text" 
                    name="name"
                    className="input" 
                    value={contactForm.name}
                    onChange={handleContactInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                  />
                  <label htmlFor="name">Name</label>
                  <span>Name</span>
                </div>

                <div className="input-container">
                  <input 
                    type="email" 
                    name="email"
                    className="input" 
                    value={contactForm.email}
                    onChange={handleContactInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                  />
                  <label htmlFor="email">Email</label>
                  <span>Email</span>
                </div>

                <div className="input-container">
                  <input 
                    type="text" 
                    name="subject"
                    className="input" 
                    value={contactForm.subject}
                    onChange={handleContactInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                  />
                  <label htmlFor="subject">Subject</label>
                  <span>Subject</span>
                </div>

                <div className="input-container textarea">
                  <textarea 
                    name="message"
                    className="input"
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                  ></textarea>
                  <label htmlFor="message">Message</label>
                  <span>Message</span>
                </div>

                <button type="submit" className="button">
                  <i className="uil uil-navigator button-icon"></i>Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-bg">
            <div className="footer-container container grid">
              <div>
                <h1 className="footer-title">{profile.full_name || profile.username}</h1>
                <span className="footer-subtitle">{profile.headline || "Developer"}</span>
              </div>

              <ul className="footer-links">
                <li>
                  <a href="#services" className="footer-links">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#work" className="footer-links">
                    Work
                  </a>
                </li>
                <li>
                  <a href="#contact" className="footer-links">
                    Contact
                  </a>
                </li>
              </ul>

              <div className="footer-socials">
                {profile.social_links?.linkedin && (
                  <a
                    href={profile.social_links.linkedin}
                    target="_blank"
                    className="footer-social"
                  >
                    <i className="uil uil-linkedin"></i>
                  </a>
                )}

                {profile.social_links?.github && (
                  <a
                    href={profile.social_links.github}
                    target="_blank"
                    className="footer-social"
                  >
                    <i className="uil uil-github"></i>
                  </a>
                )}

                {profile.social_links?.twitter && (
                  <a
                    href={profile.social_links.twitter}
                    target="_blank"
                    className="footer-social"
                  >
                    <i className="uil uil-twitter"></i>
                  </a>
                )}
              </div>
            </div>

            <p className="footer-copy">
              &#169; {new Date().getFullYear()} {profile.full_name || profile.username} - Powered by Flick
            </p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default PortfolioClient;
