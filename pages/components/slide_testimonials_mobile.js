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

export default function SlideTestimonialsMobile({items = []}) {
  const { t } = useTranslation('common');

  // const items = [
  //   {
  //     id: 1,
  //     images: '/images/images_testimonials.png',
  //     descTestimonials: 'I`ve tried cooking it, the taste really suits the Indonesian tongue.',
  //     dateTestimonials: '10/06/2024',
  //     userTestimonials: 'nazila_',
  //     variation: 'Spicy'
  //   },
  //   {
  //       id: 2,
  //       images: '/images/images_testimonials.png',
  //       descTestimonials: 'My cooking looks luxurious and it`s ready to cook straight away!',
  //       dateTestimonials: '10/06/2024',
  //       userTestimonials: 'Elvaaa',
  //       variation: 'Original'
  //   },
  //   {
  //       id: 3,
  //       images: '/images/images_testimonials.png',
  //       descTestimonials: 'This is the first time making katsu curry using this seasoning, it tastes delicious, it has a spicy taste.',
  //       dateTestimonials: '20/07/2024',
  //       userTestimonials: 'Putrisalwa',
  //       variation: 'Spicy'
  //   },
  //   {
  //     id: 4,
  //     images: '/images/images_testimonials.png',
  //     descTestimonials: 'It tastes delicious, tried the original several times because the kids can eat it now, tried the spicy one, it also suits my taste buds.',
  //     dateTestimonials: '10/06/2024',
  //     userTestimonials: 'Diana_13',
  //     variation: 'Spicy'
  //   },
  //   {
  //     id: 5,
  //     images: '/images/images_testimonials.png',
  //     descTestimonials: 'I`ve tried it before so I`m sure it tastes good. The price is very good, especially when compared to the prices of other packages. Suitable for me who doesn`t like complicated cooking.',
  //     dateTestimonials: '10/06/2024',
  //     userTestimonials: 'Risma Nainggolan',
  //     variation: 'Original'
  //   },
  // ];

  return (
    <>
    {items.length > 0 && (
      <Swiper 
        slidesPerView={'auto'}
        spaceBetween={23}
        loop={true}
        centeredSlides={true}
        pagination={{
          clickable:true
        }}
        modules={[Pagination]}
        className="mySwiperTestimonialsMobile"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div className='slideItemTestimonials'>
              {item.images ? (
                <div className="imageTestimonials">
                  <img
                    src={`https://prahwa.net/storage/${item.images}`}
                    alt={item.title}
                  />
                </div>
              ) : null}
              <div className='contentTestimonials'>
                <div className='divider'></div>
                <div className='ratingTestimonials'>
                    <img src='/images/star_rating.png' alt='House Kari Rating' />
                    <img src='/images/star_rating.png' alt='House Kari Rating' />
                    <img src='/images/star_rating.png' alt='House Kari Rating' />
                    <img src='/images/star_rating.png' alt='House Kari Rating' />
                    <img src='/images/star_rating.png' alt='House Kari Rating' />
                </div>
                <p>{item.description}</p>
                <div className='dateTestimonials'>
                    {/* <h5>Variation: {item.variation}</h5> */}
                    <span>{item.date} - {t('by')} {item.name}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    )}
    </>
  );
}

