import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Tabs.module.css';
import { IoChevronDown } from "react-icons/io5";

const Tabs = ({ tabs = [] }) => {
  const [activeTab, setActiveTab] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Japanese Product ');

  const menuItems = [
    'Japanese Product',
    'Indonesian Spices',
    'Frozen Veggies',
    'Indonesian Coffee'
  ];

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

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

  const handleSelectMenu = (menu) => {
    setSelectedMenu(menu);
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
      document.addEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [height, setHeight] = useState(360); // Default height
  const [isMobile, setIsMobile] = useState(false);
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

  return ( 
    <div className={styles.tabs}>
      <div className={styles.tabHeaders}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tabHeader} ${activeTab === index ? styles.active : ''}`}
            onClick={() => handleTabClick(index)} 
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className={styles.select_menu_product}>
        <button 
          className={`${styles.dropdownButton} ${isOpen ? styles.activeButton : ''}`}  
          onClick={toggleDropdown}
        >
          {selectedMenu} <IoChevronDown />
        </button>
        <div onTouchStart={handleTouchStart} 
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown} className={`${styles.dropdownMenu} ${isOpen ? styles.active : ''}`} style={{ height: isMobile ? `${height}px` : 'auto' }}>
          <div className={styles.circle_menu}><div className={styles.circle_menu_box}></div></div>
          {menuItems.map((menu, index) => (
            <div
              key={index}
              className={`${styles.dropdownMenuItem} ${selectedMenu === menu ? styles.active : ''}`}
              onClick={() => handleSelectMenu(menu)}
            >
              {menu}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.tabContent}>
        {tabs[activeTab] && tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
