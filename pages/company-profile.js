import Head from "next/head";
import styles from '@/styles/CompanyProfile.module.css';
import banner from '@/styles/Banner.module.css';
import { IoChevronDown } from "react-icons/io5";
import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from "axios";
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Link from "next/link";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; 

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function CompanyProfile() {
  const { t, i18n } = useTranslation('common');

  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState('All');
  const [isMobile, setIsMobile] = useState(false);
  const [height, setHeight] = useState(360); // Default height
  const [careersList, setCareersList] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // New state for selected category ID

  useEffect(() => {
    const fetchCareers = async () => {
        try {
            const response = await axios.get('/api/all-careers');
            setCareersList(response.data.data); // Sesuaikan dengan struktur respons API
        } catch (error) {
            console.error('Error fetching careers:', error);
        }
    };

    fetchCareers();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/career-categories');
        const categories = response.data.data;
        const categoryNames = ['All', ...categories.map(category => category.name_en)];
        setMenuItems(categoryNames);
        console.log(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, []);

  const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  // Filter careers based on selected category
  const filterCareers = (careers, selectedCategory) => {
    if (selectedCategory === 'All') {
      return careers; // Tampilkan semua karir jika "All" dipilih
    }
    return careers.filter(career => career.category.name_en === selectedCategory);
  };
  
  // Terapkan filter ke careersList
  const filteredCareers = filterCareers(careersList, selectedMenu);
  // Chunked careers array
  const chunkedCareers = chunkArray(filteredCareers, 3);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (window.innerWidth <= 768) {
      // Handle overflow on body
      if (isOpen) {
        document.body.style.overflow = 'hidden'; // Body tidak bisa di-scroll
      } else {
        document.body.style.overflow = 'auto'; // Body bisa di-scroll
      }

      // Cleanup function to reset overflow when component unmounts or isOpen changes
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen]);

  const handleSelectMenu = (menu, id) => {
    setSelectedMenu(menu);
    setSelectedCategoryId(id); // Set the selected category ID
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsOpen(false);
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.dropdownMenu}`)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const contentRef = useRef(null);
  const startY = useRef(0); // Define startY as a useRef variable
  const startHeight = useRef(0);
  const lastY = useRef(0); // To track the last Y position
  const lastTime = useRef(0); // To track the last time for flick detection

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      if (height >= window.innerHeight) {
        contentElement.style.maxHeight = '100vh';
        contentElement.style.overflowY = 'scroll';
      } else {
        contentElement.style.maxHeight = `${height}px`;
        contentElement.style.overflowY = 'hidden';
      }
    }
  }, [height]);

  const handleStart = (clientY) => {
    if (!isMobile) return;
    startY.current = clientY;
    startHeight.current = height;
    lastY.current = clientY;
    lastTime.current = Date.now();
  };

  const handleMove = (clientY) => {
    if (!isMobile) return;

    const currentTime = Date.now();
    const deltaY = clientY - lastY.current;
    const deltaTime = currentTime - lastTime.current;

    // Update last positions and times
    lastY.current = clientY;
    lastTime.current = currentTime;

    const flickSpeed = deltaY / deltaTime;

    if (flickSpeed < -0.5) { // Adjust the threshold as needed for flick up
      setHeight(window.innerHeight);
    } else if (flickSpeed > 0.5) { // Adjust the threshold as needed for flick down
      setHeight(360); // Default height
      setIsOpen(false); // Close dropdown when flicking down
    }
  };

  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientY);
  };

  const handleMouseDown = (e) => {
    handleStart(e.clientY);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientY);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const descCareer = (career) => {
    switch (i18n.language) {
      case 'en':
        return career.description_en || career.description;
      case 'zh':
        return career.description_chi || career.description;
      default:
        return career.description;
    }
  };

  const handleApplyClick = (jobType) => {
    const email = 'info@housefoods.co.id';
    const subject = `Interested in ${jobType}`;
    const body = ''; // Bisa diisi dengan teks default untuk isi email
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
};

  const pageTitle = `House Kari | ${t('menu.companyProfile')}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Learn more about us" />
      </Head>
      <div className={banner.bannerStyle}>
        <img src="/images/company_profile_banner.png" alt="House Kari Website"/>
      </div>
      <div className={banner.breadcrumbs}>
        <p>{t('menu.home')} / {t('menu.ourStory')} / <span>{t('menu.companyProfile')}</span></p>
      </div>
      <div className={styles.bg_section}>
        <div className={styles.section1}>
          <div className={styles.section1_image}>
            <img src="/images/company_profile_section.png" alt="House Kari Website" />
          </div>
          <div className={styles.section1_content}>
            <h1>PT. HOUSE AND VOX INDONESIA</h1>
            <h3>{t('profileSubHeading')}</h3>
            <p>{t('profiledesc1')}</p>
            <p>{t('profiledesc2')}</p>
          </div>
        </div>
        <div className={styles.section2}>
          <img src="/images/pattern_center.png" alt="House Kari" className={styles.pattern_center}/>
          <img src="/images/filosofi_icon_1.png" alt="House Kari" className={styles.filosofi_icon_1}/>
          <img src="/images/filosofi_icon_2.png" alt="House Kari" className={styles.filosofi_icon_2}/>
          <h1>{t('filosofi')}</h1>
          <p dangerouslySetInnerHTML={{ __html: t('filosofiText') }}></p>
          <div className={styles.divider}></div>
        </div>
      </div>
      <div className={styles.two_block}>
        <div className={styles.vision_box}>
          <h1>{t('visi')}</h1>
          <p>{t('visiText')}</p>
          <div className={styles.overlay_visi}></div>
        </div>
        <div className={styles.mision_box}>
          <h1>{t('misi')}</h1>
          <ul>
            <li>{t('listMisi.listMisiOne')}</li>
            <li>{t('listMisi.listMisiTwo')}</li>
            <li>{t('listMisi.listMisiThree')}</li>
          </ul>
          <div className={styles.overlay_misi}></div>
        </div>
      </div>

      <div className={styles.careers}>
        <img src="/images/careers_icon.png" alt="House Kari" className={styles.careers_icon}/>
        <div className={styles.headingCareers}>
          <h1>{t('careers')}</h1>
          <div className={styles.select_menu_product}>
          <button 
            className={`${styles.dropdownButton} ${isOpen ? styles.activeButton : ''}`}  
            onClick={toggleDropdown}
          >
            {selectedMenu} <IoChevronDown />
          </button>
          <div 
            onTouchStart={handleTouchStart} 
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown} 
            className={`${styles.dropdownMenu} ${isOpen ? styles.active : ''}`} 
            style={{ height: isMobile ? `${height}px` : 'auto' }}
          >
            <div className={styles.circle_menu}>
              <div className={styles.circle_menu_box}></div>
            </div>
            {menuItems.length > 0 ? (
              menuItems.map((menu, index) => (
                <div
                  key={index}
                  className={`${styles.dropdownMenuItem} ${selectedMenu === menu ? styles.active : ''}`}
                  onClick={() => handleSelectMenu(menu)}
                >
                  {menu}
                </div>
              ))
            ) : (
              <div className={styles.dropdownMenuItem}>No categories available</div>
            )}
          </div>
        </div>

        </div>
        <Swiper 
          autoHeight={true}
          pagination={{
              clickable: true,
          }} 
          modules={[Pagination]} 
          className="swiperCareers"
        >
          {chunkedCareers.length > 0 ? (
            chunkedCareers.map((careerChunk, slideIndex) => (
              <SwiperSlide key={slideIndex}>
                {careerChunk.map(career => (
                  <div className={styles.boxCareers} key={career.id}>
                    <h3>{career.jobtype.name_en}</h3>
                    <p>{(descCareer(career))}</p>
                    <div className={styles.btnCareers}>
                      <div className={styles.dateCareers}>
                        <span>{t('ends')} {new Date(career.date_end).toLocaleDateString()}</span>
                      </div>
                      <button 
                          onClick={() => handleApplyClick(career.jobtype.name_en)}
                      >
                          {t('apply')}
                      </button>
                    </div>
                  </div>
                ))}
              </SwiperSlide>
            ))
          ) : (
            <div className={styles.noJobsMessage}>
              <h1>{t('noJob')}</h1>
            </div>
          )}
        </Swiper>

      </div>
    </>
  );
}
