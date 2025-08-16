"use client";

import { useEffect, useState } from "react";
import { Profile } from "../../../lib/schema";
import styles from "../templates/styles/EclipseTemplate.module.css";

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
      container.classList.add(styles['focus'] || 'focus');
    }
  };

  // Handle input blur for floating labels
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const container = e.target.parentElement;
    if (container && !e.target.value) {
      container.classList.remove(styles['focus'] || 'focus');
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

  const navMenuSelector = `.${styles['nav-menu']}`;
    const navLinkSelector = `.${styles['nav-link']}`;
  const activeLinkClass = styles['active-link'] || 'active-link';
  const animateClass = styles['animate'] || 'animate';

    const navHighlighter = () => {
      let scrollY = window.pageYOffset;
      sections.forEach((current: any) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute("id");

        const selector = `${navMenuSelector} a[href*="${sectionId}"]`;
        const link = document.querySelector(selector);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link?.classList.add(activeLinkClass);
        } else {
          link?.classList.remove(activeLinkClass);
        }
      });
    };

    // Scroll animations
    const animClassNames = [
      'animate-on-scroll',
      'slide-in-left',
      'slide-in-right',
      'slide-in-up',
      'slide-in-down',
      'scale-in',
      'rotate-in',
      'bounce-in',
      'fade-in',
      'fade-in-up',
    ];
    const animatedSelector = animClassNames.map((c) => `.${styles[c]}`).join(', ');

    const animateOnScroll = () => {
      const animatedElements = document.querySelectorAll(animatedSelector);

      animatedElements.forEach((element) => {
        const elementTop = (element as HTMLElement).getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add(animateClass);
        }
      });

      // Animate section titles
      const sectionTitles = document.querySelectorAll(`.${styles['section-title']}`);
      sectionTitles.forEach((title) => {
        const titleTop = (title as HTMLElement).getBoundingClientRect().top;
        if (titleTop < window.innerHeight - 100) {
          title.classList.add(animateClass);
        }
      });
    };

    // Mobile menu functionality
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('sidebar');
    const navClose = document.querySelector(`.${styles['nav-close']}`);
    const navLinks = document.querySelectorAll(navLinkSelector);

    // Show menu
    const showMenu = () => {
      if (sidebar) {
        sidebar.classList.add(styles['show-sidebar']);
        document.body.classList.add('sidebar-open');
      }
    };

    // Hide menu
    const hideMenu = () => {
      if (sidebar) {
        sidebar.classList.remove(styles['show-sidebar']);
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
  navLinks.forEach((link) => {
      link.addEventListener('click', hideMenu);
    });

    const handleScroll = () => {
      navHighlighter();
      animateOnScroll();
    };

    window.addEventListener("scroll", handleScroll);
    
    // Trigger animation on initial load
    animateOnScroll();

    // Smooth scroll for in-page anchors (nav, buttons, footer links)
    const handleAnchorClick = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute('href') || '';
      if (!href || !href.startsWith('#') || href === '#') return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash without immediate jump
        if (history.pushState) {
          history.pushState(null, '', href);
        } else {
          window.location.hash = href;
        }
      }
    };

    const inPageAnchors = Array.from(document.querySelectorAll('a[href^="#"]')) as HTMLAnchorElement[];
    inPageAnchors.forEach((a) => a.addEventListener('click', handleAnchorClick));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      
      // Cleanup event listeners
      if (navToggle) {
        navToggle.removeEventListener('click', showMenu);
      }
      if (navClose) {
        navClose.removeEventListener('click', hideMenu);
      }
  navLinks.forEach((link) => {
        link.removeEventListener('click', hideMenu);
      });

  inPageAnchors.forEach((a) => a.removeEventListener('click', handleAnchorClick));
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
  const inputs = document.querySelectorAll(`.${styles['input-container']} input, .${styles['input-container']} textarea`);
    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        if (input.value) {
          const container = input.parentElement;
          if (container) {
      container.classList.add(styles['focus']);
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

  // Normalize technologies coming as string or string[] from dashboard
  const techToString = (technologies?: unknown): string => {
    if (Array.isArray(technologies)) return (technologies as string[]).join(', ');
    if (typeof technologies === 'string') return technologies;
    return '';
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
    <div className={styles.eclipseScope}>
      <div className={styles['nav-toggle']} id="nav-toggle">
        <i className="uil uil-bars"></i>
      </div>

      <aside className={styles.sidebar} id="sidebar">
        <nav className={styles.nav}>
          <div className={styles['nav-logo']}>
            <a href="#" className={styles['nav-logo-text']}>
              {getInitials(profile.full_name)}
            </a>
          </div>

          <div className={styles['nav-menu']}>
            <div className={styles.menu}>
              <ul className={styles['nav-list']}>
                <li className={styles['nav-item']}>
                  <a href="#home" className={`${styles['nav-link']} ${styles['active-link']}`}>
                    Home
                  </a>
                </li>
                <li className={styles['nav-item']}>
                  <a href="#about" className={styles['nav-link']}>
                    About
                  </a>
                </li>
                <li className={styles['nav-item']}>
                  <a href="#skills" className={styles['nav-link']}>
                    Skills
                  </a>
                </li>
                <li className={styles['nav-item']}>
                  <a href="#work" className={styles['nav-link']}>
                    Work
                  </a>
                </li>
                <li className={styles['nav-item']}>
                  <a href="#services" className={styles['nav-link']}>
                    Services
                  </a>
                </li>
                <li className={styles['nav-item']}>
                  <a href="#contact" className={styles['nav-link']}>
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles['btn-share']}>
            <i className={`uil uil-share-alt ${styles['social-share']}`}></i>
          </div>

          <div className={styles['nav-close']} id="nav-close">
            <i className="uil uil-times"></i>
          </div>
        </nav>
      </aside>

      <main className={styles['main']}>
        <section className={styles['home']} id="home">
          <div className={`${styles['home-container']} ${styles.container}`}>
            <div className={styles['home-social']}>
              <span className={styles['home-social-follow']}>Follow Me</span>
              <div className={styles['home-social-links']}>
                {profile.social_links?.linkedin && (
                  <a
                    href={profile.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['home-social-link']}
                  >
                    <i className="uil uil-linkedin"></i>
                  </a>
                )}

                {profile.social_links?.github && (
                  <a
                    href={profile.social_links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['home-social-link']}
                  >
                    <i className="uil uil-github"></i>
                  </a>
                )}

                {profile.social_links?.twitter && (
                  <a
                    href={profile.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['home-social-link']}
                  >
                    <i className="uil uil-twitter"></i>
                  </a>
                )}
              </div>
            </div>

            <div className={`${styles['home-image-container']} ${styles['float-animation']}`}>
              <img
                src={profile.avatar_url || "https://i.postimg.cc/3NgvPcZD/home-img.png"}
                alt={profile.full_name || "Profile"}
                className={`${styles['home-img']} ${styles['scale-in']}`}
              />
            </div>

            <div className={styles['home-content']}>
              <div className={styles['home-data']}>
                <h1 className={styles['home-title']}>Hi, I'm {profile.full_name || profile.username}</h1>
                <h3 className={styles['home-subtitle']}>{profile.headline || "Developer"}</h3>
                <p className={styles['home-description']}>
                  {profile.bio || "Passionate developer creating amazing digital experiences"}
                </p>
                <a href="#about" className={`${styles['button']} ${styles['pulse-animation']}`}>
                  <i className={`uil uil-user ${styles['button-icon']}`}></i>
                  More About me!
                </a>
              </div>
            </div>

            <div className={styles['my-info']}>
              {profile.social_links?.linkedin && (
                <div className={styles['info-item']}>
                  <i className={`uil uil-linkedin ${styles['info-icon']}`}></i>
                  <div>
                    <h3 className={styles['info-title']}>LinkedIn</h3>
                    <span className={styles['info-subtitle']}>
                      {profile.social_links.linkedin.replace('https://', '')}
                    </span>
                  </div>
                </div>
              )}

              {profile.social_links?.github && (
                <div className={styles['info-item']}>
                  <i className={`uil uil-github ${styles['info-icon']}`}></i>
                  <div>
                    <h3 className={styles['info-title']}>GitHub</h3>
                    <span className={styles['info-subtitle']}>
                      {profile.social_links.github.replace('https://', '')}
                    </span>
                  </div>
                </div>
              )}

              {profile.email && (
                <div className={styles['info-item']}>
                  <i className={`uil uil-envelope-edit ${styles['info-icon']}`}></i>
                  <div>
                    <h3 className={styles['info-title']}>Email</h3>
                    <span className={styles['info-subtitle']}>{profile.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className={`${styles['about']} ${styles['section']} ${styles['animate-on-scroll']}`} id="about">
          <h2 className={styles['section-title']} data-heading="My Intro">
            About me
          </h2>

          <div className={`${styles['about-container']} ${styles['container']} ${styles['grid']}`}>
            <img
              src={profile.avatar_url || "https://i.postimg.cc/W1YZxTpJ/about-img.jpg"}
              alt={profile.full_name}
              className={`${styles['about-img']} ${styles['slide-in-left']}`}
            />

            <div className={`${styles['about-data']} ${styles['slide-in-right']}`}>
              <h3 className={styles['about-heading']}>
                Hi, I'm {profile.full_name || profile.username}
              </h3>
              <p className={styles['about-description']}>
                {profile.about_description || "I'm a dedicated developer with strong foundation in modern web technologies. Through academic projects and continuous learning, I've developed skills in frontend and backend development."}
              </p>

              <div className={`${styles['about-info']} ${styles['stagger-children']}`}>
                {(profile.about_stats || defaultAboutStats).map((stat, index) => (
                  <div key={index} className={`${styles['about-box']} ${styles['animate-on-scroll']}`}>
                    <i className={`uil ${stat.icon} ${styles['about-icon']}`}></i>
                    <h3 className={styles['about-title']}>{stat.title}</h3>
                    <span className={styles['about-subtitle']}>{stat.subtitle}</span>
                  </div>
                ))}
              </div>

              <a href="#contact" className={`${styles['button']} ${styles['bounce-in']}`}>
                <i className={`uil uil-navigator ${styles['button-icon']}`}></i>Contact me
              </a>
            </div>
          </div>
        </section>

        <section className={`${styles['qualification']} ${styles['section']} ${styles['animate-on-scroll']}`}>
            <h2 className={styles['section-title']} data-heading="My Journey">
                Qualifications
            </h2>

            <div className={`${styles['qualification-container']} ${styles['container']} ${styles['grid']}`}>
                <div className={`${styles['education']} ${styles['slide-in-left']}`}>
                    <h3 className={styles['qualification-title']}>
                        <i className="uil uil-graduation-cap"></i>Education
                    </h3>

                    <div className={`${styles['timeline']} ${styles['stagger-children']}`}>
                        {(profile.education || defaultEducation).map((edu, index) => (
                        <div key={index} className={`${styles['timeline-item']} ${styles['animate-on-scroll']}`}>
                            <div className={styles['circle-dot']}></div>
                                <h3 className={styles['timeline-title']}>{edu.institution}</h3>
                                <p className={styles['timeline-text']}>{edu.degree}</p>
                                <span className={styles['timeline-date']}>
                                <i className="uil uil-calendar-alt"></i>{edu.period}
                                </span>
                            </div>
                            ))}
                        </div>
                    </div>

                <div className={`${styles['experience']} ${styles['slide-in-right']}`}>
                    <h3 className={styles['qualification-title']}>
                        <i className="uil uil-suitcase"></i>Experience
                    </h3>

                    <div className={`${styles['timeline']} ${styles['stagger-children']}`}>
                        {(profile.experience || defaultExperience).map((exp, index) => (
                        <div key={index} className={`${styles['timeline-item']} ${styles['animate-on-scroll']}`}>
                            <div className={styles['circle-dot']}></div>
                            <h3 className={styles['timeline-title']}>{exp.company}</h3>
                            <p className={styles['timeline-text']}>{exp.position}</p>
                            <span className={styles['timeline-date']}>
                            <i className="uil uil-calendar-alt"></i>{exp.period}
                            </span>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </section>


        <section className={`${styles['skills']} ${styles['section']} ${styles['animate-on-scroll']}`} id="skills">
            <h2 className={styles['section-title']} data-heading="My Abilities">
                Skills
            </h2>

            <div className={`${styles['skills-container']} ${styles['container']} ${styles['grid']}`}>
                <div className={`${styles['skills-tabs']} ${styles['slide-in-left']}`}>
                {(profile.skills_categories || defaultSkillsCategories).map((category, index) => (
                    <div
                    key={category.category}
                    className={`${styles['skills-header']} ${
                        activeTab === category.category.toLowerCase() ? styles['skills-active'] : ''
                    }`}
                    onClick={() => handleTabClick(category.category.toLowerCase())}
                    >
                    <i className={`uil ${category.icon} ${styles['skills-icon']}`}></i>

                    <div>
                        <h1 className={styles['skills-title']}>{category.title}</h1>
                        <span className={styles['skills-subtitle']}>{category.subtitle}</span>
                    </div>

                    <i className={`uil uil-angle-down ${styles['skills-arrow']}`}></i>
                    </div>
                ))}
                </div>

                <div className={`${styles['skills-content']} ${styles['slide-in-right']}`}>
                {(profile.skills_categories || defaultSkillsCategories).map((category) => (
                    activeTab === category.category.toLowerCase() && (
                    <div key={category.category} className={`${styles['skills-group']} ${styles['skills-active']}`}>
                        <div className={`${styles['skills-list']} ${styles['grid']}`}>
                        {category.skills.map((skill, skillIndex) => (
                            <div key={skillIndex} className={styles['skills-data']}>
                            <div className={styles['skills-titles']}>
                                <h3 className={styles['skills-name']}>{skill.name}</h3>
                                <span className={styles['skills-number']}>{skill.percentage}%</span>
                            </div>

                            <div className={styles['skills-bar']}>
                                <span
                                className={styles['skills-percentage']}
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


        <section className={`${styles['work']} ${styles['section']} ${styles['fade-in-up']}`} id="work">
            <h2 className={`${styles['section-title']} ${styles['slide-in-left']}`} data-heading="My Portfolio">
                Recent Works
            </h2>

            <div className={`${styles['work-container']} ${styles['container']} ${styles['grid']} ${styles['stagger-children']}`}>
                {profile.projects?.map((project, index) => (
                <div key={index} className={`${styles['work-card']} ${styles['scale-in']}`}>
                    <img
                    src={project.imageUrl || "https://i.postimg.cc/43Th5VXJ/work-1.png"}
                    alt={project.title}
                    className={styles['work-img']}
                    />
                    <h3 className={styles['work-title']}>{project.title}</h3>
                    <div className={styles['work-buttons']}>
                    <a
                        href="#"
                        className={styles['work-button']}
                        onClick={(e) => {
                        e.preventDefault();
            openPortfolioPopup(
              project.imageUrl || "",
              project.title,
              project.description,
              formatDate(project.startDate),
              techToString(project.technologies as unknown),
              project.role || "Developer",
              project.liveUrl || "",
              project.githubUrl || ""
            );
                        }}
                    >
                        Details
                        <i className={`uil uil-arrow-right ${styles['work-button-icon']}`}></i>
                    </a>
                    {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles['work-button']} ${styles['work-button-live']}`}
                >
                        View Live
                        <i className={`uil uil-external-link-alt ${styles['work-button-icon']}`}></i>
                        </a>
                    )}
                    {project.githubUrl && (
                <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles['work-button']} ${styles['work-button-source']}`}
                >
                        Source Code
                        <i className={`uil uil-github ${styles['work-button-icon']}`}></i>
                        </a>
                    )}
                    </div>
                </div>
                ))}
            </div>
        </section>

        {isPortfolioPopupOpen && (
            <div className={`${styles['portfolio-popup']} ${styles['open']}`}>
                <div className={styles['portfolio-popup-inner']}>
                <div className={`${styles['portfolio-popup-content']} ${styles['grid']}`}>
                    <span
                    className={styles['portfolio-popup-close']}
                    onClick={closePortfolioPopup}
                    >
                    <i className="uil uil-times"></i>
                    </span>

                    <div className={styles['pp-thumbnail']}>
                    <img
                        src={portfolioItemDetails.imgSrc}
                        alt=""
                        className={styles['portfolio-popup-img']}
                    />
                    </div>

                    <div className={styles['portfolio-popup-info']}>
                    <div className={styles['portfolio-popup-subtitle']}>
                        Featured - <span>{portfolioItemDetails.title}</span>
                    </div>

                    <div className={styles['portfolio-popup-body']}>
                        <h3 className={styles['details-title']}>
                        {portfolioItemDetails.title}
                        </h3>

                        <p className={styles['details-description']}>
                        {portfolioItemDetails.details}
                        </p>

                        <ul className={styles['details-info']}>
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
                            <a
                                href={portfolioItemDetails.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
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


    <section className={`${styles['services']} ${styles['section']} ${styles['fade-in-up']}`} id="services">
        <h2 className={`${styles['section-title']} ${styles['slide-in-left']}`} data-heading="Services">
            What I Offer
        </h2>

        <div className={`${styles['services-container']} ${styles['container']} ${styles['grid']} ${styles['stagger-children']}`}>
            {(profile.services || defaultServices).map((service, index) => (
            <div key={index} className={`${styles['services-content']} ${styles['bounce-in']}`}>
                <div>
                <i className={`uil ${service.icon} ${styles['services-icon']}`}></i>
                <h3 className={styles['services-title']}>
                    {service.title.split(' ').map((word, i) => (
                    <span key={i}>
                        {word}
                        {i === 0 && <br />}
                        {i > 0 && i < service.title.split(' ').length - 1 && ' '}
                    </span>
                    ))}
                </h3>
                </div>

                <span className={styles['services-button']} onClick={() => openModal(index)}>
                <span className={styles['services-button-text']}>View More</span>{" "}
                <i className={`uil uil-arrow-right ${styles['services-button-icon']}`}></i>
                </span>

                {activeModal === index && (
                <div className={`${styles['services-modal']} ${styles['active-modal']}`}>
                    <div className={styles['services-modal-content']}>
                    <i
                        className={`uil uil-times ${styles['services-modal-close']}`}
                        onClick={closeModal}
                    ></i>

                    <h3 className={styles['services-modal-title']}>{service.title}</h3>

                    <ul className={`${styles['services-modal-services']} ${styles['grid']}`}>
                        {service.description.split(', ').map((item, itemIndex) => (
                        <li key={itemIndex} className={styles['services-modal-service']}>
                            <i className={`uil uil-check-circle ${styles['services-modal-icon']}`}></i>
                            <p className={styles['services-modal-info']}>{item}</p>
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


    <section className={`${styles['contact']} ${styles['section']} ${styles['fade-in-up']}`} id="contact">
        <h2 className={`${styles['section-title']} ${styles['slide-in-left']}`} data-heading="Get in Touch">
            Contact me
        </h2>


        <div className={`${styles['contact-container']} ${styles['container']} ${styles['grid']}`}>
        <div className={`${styles['contact-content']} ${styles['slide-in-left']}`}>
            <div className={`${styles['contact-info']} ${styles['stagger-children']}`}>
            {profile.email && (
                <div className={`${styles['contact-card']} ${styles['scale-in']}`}>
                <i className={`uil uil-envelope-edit ${styles['contact-card-icon']}`}></i>
                <h3 className={styles['contact-card-title']}>Email</h3>
                <span className={styles['contact-card-data']}>{profile.email}</span>
                <span
                    className={styles['contact-button']}
                    onClick={() => handleContactButtonClick('email')}
                >
                    Write me
                    <i className={`uil uil-arrow-right ${styles['contact-button-icon']}`}></i>
                </span>
                </div>
            )}

            {profile.social_links?.linkedin && (
                <div className={`${styles['contact-card']} ${styles['scale-in']}`}>
                <i className={`uil uil-linkedin ${styles['contact-card-icon']}`}></i>
                <h3 className={styles['contact-card-title']}>LinkedIn</h3>
                <span className={styles['contact-card-data']}>
                    {profile.social_links.linkedin.replace('https://', '')}
                </span>
                <span
                    className={styles['contact-button']}
                    onClick={() => handleContactButtonClick('linkedin')}
                >
                    Connect
                    <i className={`uil uil-arrow-right ${styles['contact-button-icon']}`}></i>
                </span>
                </div>
            )}

            {profile.social_links?.github && (
                <div className={`${styles['contact-card']} ${styles['scale-in']}`}>
                <i className={`uil uil-github ${styles['contact-card-icon']}`}></i>
                <h3 className={styles['contact-card-title']}>GitHub</h3>
                <span className={styles['contact-card-data']}>
                    {profile.social_links.github.replace('https://', '')}
                </span>
                <span
                    className={styles['contact-button']}
                    onClick={() => handleContactButtonClick('github')}
                >
                    Follow me
                    <i className={`uil uil-arrow-right ${styles['contact-button-icon']}`}></i>
                </span>
                </div>
            )}
            </div>
        </div>


        <div className={`${styles['contact-content']} ${styles['slide-in-right']}`}>
            <form 
                action="https://formsubmit.co/el/your-email-here" 
                method="POST"
                onSubmit={handleContactSubmit}
                className={styles['contact-form']}
            >
                {/* FormSubmit configuration fields */}
                <input type="hidden" name="_subject" value="New Contact Message from Portfolio" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_next" value={typeof window !== 'undefined' ? window.location.href : ''} />
                
                <div className={styles['input-container']}>
                <input 
                    type="text" 
                    name="name"
                    className={styles['input']} 
                    value={contactForm.name}
                    onChange={handleContactInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                />
                <label htmlFor="name">Name</label>
                <span>Name</span>
                </div>

                <div className={styles['input-container']}>
                <input 
                    type="email" 
                    name="email"
                    className={styles['input']} 
                    value={contactForm.email}
                    onChange={handleContactInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                />
                <label htmlFor="email">Email</label>
                <span>Email</span>
                </div>

                <div className={styles['input-container']}>
                <input 
                    type="text" 
                    name="subject"
                    className={styles['input']} 
                    value={contactForm.subject}
                    onChange={handleContactInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                />
                <label htmlFor="subject">Subject</label>
                <span>Subject</span>
                </div>

                <div className={`${styles['input-container']} ${styles['textarea']}`}>
                <textarea 
                    name="message"
                    className={styles['input']}
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                ></textarea>
                <label htmlFor="message">Message</label>
                <span>Message</span>
                </div>

                <button type="submit" className={styles['button']}>
                <i className={`uil uil-navigator ${styles['button-icon']}`}></i>
                Send Message
                </button>
            </form>
        </div>

        </div>
        </section>

        <footer className={styles['footer']}>
            <div className={styles['footer-bg']}>
                <div className={`${styles['footer-container']} ${styles['container']} ${styles['grid']}`}>
                <div>
                    <h1 className={styles['footer-title']}>
                    {profile.full_name || profile.username}
                    </h1>
                    <span className={styles['footer-subtitle']}>
                    {profile.headline || "Developer"}
                    </span>
                </div>

                <ul className={styles['footer-links']}>
                    <li>
                    <a href="#services" className={styles['footer-links']}>
                        Services
                    </a>
                    </li>
                    <li>
                    <a href="#work" className={styles['footer-links']}>
                        Work
                    </a>
                    </li>
                    <li>
                    <a href="#contact" className={styles['footer-links']}>
                        Contact
                    </a>
                    </li>
                </ul>

                <div className={styles['footer-socials']}>
          {profile.social_links?.linkedin && (
                    <a
                        href={profile.social_links.linkedin}
                        target="_blank"
            rel="noopener noreferrer"
                        className={styles['footer-social']}
                    >
                        <i className="uil uil-linkedin"></i>
                    </a>
                    )}

          {profile.social_links?.github && (
                    <a
                        href={profile.social_links.github}
                        target="_blank"
            rel="noopener noreferrer"
                        className={styles['footer-social']}
                    >
                        <i className="uil uil-github"></i>
                    </a>
                    )}

          {profile.social_links?.twitter && (
                    <a
                        href={profile.social_links.twitter}
                        target="_blank"
            rel="noopener noreferrer"
                        className={styles['footer-social']}
                    >
                        <i className="uil uil-twitter"></i>
                    </a>
                    )}
                </div>
                </div>

                <p className={styles['footer-copy']}>
                &#169; {new Date().getFullYear()} {profile.full_name || profile.username} - Powered by Flick
                </p>
            </div>
        </footer>

      </main>
      </div>
    </>
  );
};

export default PortfolioClient;
