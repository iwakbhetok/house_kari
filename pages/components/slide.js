import { useState, useEffect } from 'react';
import styles from '@/styles/Slide.module.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AiOutlineSearch } from "react-icons/ai";
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Slide = ({ showNavigation = true, showPagination = true, autoplayInterval = 6000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/banner`);
        const data = await response.json();
        if (data && data.data) {
          setBanners(data.data);
        } else {
          console.error('Invalid response data format:', data);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [banners, autoplayInterval]);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  return (
    <div className={styles.slide}>
      <div className={styles.slideWrapper} style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {loading ? (
          <div className={styles.slideItem}>
            <Skeleton height={500} width={1700} />
          </div>
        ) : (
          banners.map((banner, index) => (
            <div key={index} className={styles.slideItem}>
              <img src={`https://prahwa.net/storage/${banner.image}`} alt={banner.type}/>
            </div>
          ))
        )}
      </div>
      {showNavigation && (
        <div className={styles.navigation}>
          <button onClick={prevSlide} className={styles.navButton}>
            <FiChevronLeft />
          </button>
          <button onClick={nextSlide} className={styles.navButton}>
            <FiChevronRight />
          </button>
        </div>
      )}
      {showPagination && (
        <div className={styles.pagination}>
          {banners.map((_, index) => (
            <button key={index} onClick={() => goToSlide(index)} className={`${styles.paginationButton} ${index === activeIndex ? styles.active : ''}`}></button>
          ))}
        </div>
      )}
      <Link href="/product">
        <div className={styles.product_banner}>
          <div className={styles.product_banner_image}>
            <img src='/images/product_banner.png' alt='House Kari Product'/>
            <div className={styles.product_banner_image_overlay}></div>
          </div>
          <div className={styles.product_banner_overlay}>
            <AiOutlineSearch />
          </div> 
        </div>
      </Link>
      <div className={styles.divider}></div>
    </div>
  );
};

export default Slide;
