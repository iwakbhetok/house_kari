import { useState, useEffect } from 'react';
import styles from '@/styles/Slide.module.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AiOutlineSearch } from "react-icons/ai";
import Link from 'next/link';
import posthog from "posthog-js";
import Image from 'next/image';

const Slide = ({
  banners = [],
  showNavigation = true,
  showPagination = true,
  autoplayInterval = 6000
}) => {

  const [activeIndex, setActiveIndex] = useState(0);

  const handleHomepageBannerClick = () => {
    posthog.capture("click_homepage_banner_product", {
      location: "homepage_slider",
      destination: "/product",
    });
  };

  // Autoplay
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        (prevIndex + 1) % banners.length
      );
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [banners, autoplayInterval]);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const nextSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div className={styles.slide}>
      <div
        className={styles.slideWrapper}
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className={styles.slideItem}>
            <div className={styles.bannerWrapper}>
              <img
                src={banner.image}
                alt={banner.type || "Homepage Banner"}
                fetchpriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? "eager" : "lazy"}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        ))}
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
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${styles.paginationButton} ${
                index === activeIndex ? styles.active : ''
              }`}
            />
          ))}
        </div>
      )}

      <Link
        href="/product"
        id="click_btn_homepage_banner_product"
        onClick={handleHomepageBannerClick}
      >
        <div className={styles.product_banner}>
          <div className={styles.product_banner_image}>
            <Image
              src='/images/product_banner.png'
              alt='House Kari Product'
              fill
              sizes="(max-width: 768px) 22vw, 13vw"
              style={{ objectFit: 'cover' }}
            />
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