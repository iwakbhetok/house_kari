import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { MdOutlineStar } from "react-icons/md";


// import required modules
import { Pagination } from 'swiper/modules';
import Link from 'next/link';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; 

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function SlideRecipeMobile({ items = [] }) {
  const { t } = useTranslation('common');

  return (
    <>
    <h1 className='headingRecipeSlideMobile'>{t('featuredRecipe')}</h1>
      <Swiper 
        slidesPerView={3}
        spaceBetween={0}
        loop={true}
        centeredSlides={true}
        pagination={{
          clickable:true
        }}
        modules={[Pagination]}
        className="mySwiperRecipeMobile"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div className='slideItemRecipe'>
              <div className='imageRecipe'>
                <img src={item.images} alt='House Kari Testimonials' />
              </div>
              <div className='contentRecipe'>
                <h1>{item.recipeHeading}</h1>
                <p>{item.recipeDesc}</p>
                <Link href='/recipe/1'><button>{t('section1Home.learnMore')}</button></Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

