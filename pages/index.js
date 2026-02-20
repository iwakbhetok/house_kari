import styles from '@/styles/Home.module.css'
import Slide from './components/slide';
import Link from 'next/link';
import { IoChevronDown } from "react-icons/io5";
import { useState } from 'react';
import SlideArticles from './components/slide_articles';
import SlideTestimonials from './components/slide_testimonials';
import { useEffect, useRef } from 'react';
import SlideTestimonialsMobile from './components/slide_testimonials_mobile';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import axios from 'axios';
import SlideArticlesSecond from './components/slide_articles_second';
import SlideArticlesSecondMobile from './components/slide_articles_second_mobile';
import Skeleton from 'react-loading-skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'react-loading-skeleton/dist/skeleton.css';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';

// import required modules
import { Navigation ,Pagination } from 'swiper/modules';

const items = [
  <Image key={1} src='/images/banner-1.png' alt='banner' width={500} height={500}/>,
  <Image key={2} src='/images/banner-1.png' alt='banner' width={500} height={500}/>,
  <Image key={3} src='/images/banner-1.png' alt='banner' width={500} height={500}/>,
];

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function Home() {
  const { t, i18n } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Choose Recipe');
  const [articles, setArticles] = useState([]);
  const [articlesSlide, setArticlesSlide] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('/api/all-testimonials');
        setTestimonials(response.data.data); // Access the data array from the response
        setLoading(false);
        console.log(response.data)
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (message) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000); // 2000 milliseconds = 2 seconds

      return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }
  }, [message]);

  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    title: '',
    description: '',
    image: null // Image file will be stored here
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setFormData({
      ...formData,
      image: files[0], // Store the selected file
    });
    setFileCount(files.length); // Update file count
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone_number', formData.phone_number);
    data.append('title', 'Testimoni');
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await axios.post('/api/postReview', data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      console.log('Form submitted successfully:', response.data);
      setMessage('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Failed to submit form');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`/api/article-new/`);
      const articles = response.data.data;

      // Assuming the date field is in 'YYYY-MM-DD' format; adjust if necessary
      const sortedArticles = articles
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
        .slice(0, 2); // Select the top 2 most recent articles

      setArticles(sortedArticles);
      console.log('Fetched and filtered articles:', sortedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchArticles();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const getCategoriesRecipe = (category) => {
    switch (i18n.language) {
      case 'en':
        return category.name_en || category.name;
      case 'zh':
        return category.name_chi || category.name;
      default:
        return category.name;
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/recipe-categories'); // Replace with your API endpoint
        const data = response.data.data;
        const formattedMenuItems = data.map(category => ({
          label: getCategoriesRecipe(category),
          id: category.id
        }));
        setMenuItems(formattedMenuItems);
        setSelectedCategoryId(formattedMenuItems[0]?.id || null); // Set default category ID
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      const fetchRecipes = async () => {
        try {
          const response = await axios.get(`/api/recipeByCategories/${selectedCategoryId}`);
          // Filter out items with image_png equal to '0'
          const filteredItems = response.data.data.filter(item => item.image_png !== '0');
          setItems(filteredItems);
          console.log('response Resep Slide', response);
        } catch (error) {
          console.error('Error fetching recipes:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchRecipes();
    }
  }, [selectedCategoryId]);
  

  useEffect(() => {
    const fetchArticlesSlide = async () => {
      try {
        const response = await axios.get(`/api/list-article-new/`);
        const articles = response.data.data;
        
        // Fungsi untuk mengacak urutan array
        const shuffleArray = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };
  
        const shuffledArticles = shuffleArray(articles);
        setArticlesSlide(shuffledArticles);
        console.log(shuffledArticles)
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
  
    fetchArticlesSlide();
  }, []);
  

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
  };

  const stripPTags = (html) => {
    if (typeof html === 'string') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || '';
    } else {
      return '';
    }
  };

  const getProductName = (article) => {
    switch (i18n.language) {
      case 'en':
        return article.title_en || article.title;
      case 'zh':
        return article.title_chi || article.title;
      default:
        return article.title;
    }
  };

  const getProductText = (article) => {
    switch (i18n.language) {
      case 'en':
        return article.text_en || article.text;
      case 'zh':
        return article.text_chi || article.text;
      default:
        return article.text;
    }
  };

  // const menuItems = [
  //   { label: t('section2Menu.makanSiang') },
  //   { label: t('section2Menu.makanSarapan') },
  //   { label: t('section2Menu.makanSnack') },
  //   { label: t('section2Menu.makanSeafood') },
  //   { label: t('section2Menu.makanRoti') },
  //   { label: t('section2Menu.makanSayuran') },
  // ];

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
    setSelectedMenu(menu.label);
    setSelectedCategoryId(menu.id);
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

// if (articles.length === 0) return <p style={{textAlign: "center"}}>Loading...</p>;

function stripH1Tags(str) {
  return str
    .replace(/<\/?(div|h1|h2|h3|h4|h5|h6|p|span|strong|em|a|ul|ol|li|br|hr|b|i|header|footer|nav|section|article|aside|main|table|tr|td|th|caption|form|input|button|select|option|textarea|label|fieldset|legend|datalist|output|iframe|embed|object|param|canvas|svg|video|audio|source|track|figcaption|figure|time|mark|meter|progress|details|summary|dialog|address|small|sub|sup|code|pre|s|del|u|ins|bdi|bdo|ruby|rt|rp|wbr|blockquote|cite|dfn|kbd|samp|var|abbr|address|p|section|article|header|footer|aside|nav|main|figure|figcaption|legend|datalist|output|progress|meter|details|summary|dialog|template|script|style|noscript|title)[^>]*>/gi, '') // Remove HTML tags
    .replace(/&nbsp;/g, '') // Remove non-breaking spaces
    .replace(/&ldquo;/g, '"') // Replace HTML entities for left double quotation mark
    .replace(/&rdquo;/g, '"') // Replace HTML entities for right double quotation mark
    .replace(/&lsquo;/g, "'") // Replace HTML entities for left single quotation mark
    .replace(/&rsquo;/g, "'") // Replace HTML entities for right single quotation mark
    .replace(/<div\s+class="meta"[^>]*>(.*?)<\/div>/gi, '') // Remove <div class="meta">
    .trim(); // Remove leading/trailing whitespace
}

const getRecipeName = (item) => {
  switch (i18n.language) {
    case 'en':
      return item.title_en || item.title;
    case 'zh':
      return item.title_chi || item.title;
    default:
      return item.title;
  }
};

const getProductDesc = (item) => {
  switch (i18n.language) {
    case 'en':
      return item.description_en || item.description;
    case 'zh':
      return item.description_chi || item.description;
    default:
      return item.description;
  }
};

  return (
    <>
      <Slide showNavigation={false} showPagination={true} />
      <div className={styles.section_2}>
        <div className={styles.section_2_box}>
          <img src='/images/img_home_1.webp' alt='House Kari Story' />
        </div>
        <div className={styles.section_2_content}>
          <h1 className={styles.heading_main}>{t('section1Home.profilPerusahaan')}</h1>
          <p className={`${styles.desc_main}`}>{t('section1Home.profilPerusahaanDesc')}</p>
          <Link href='/company-profile'><button>{t('section1Home.learnMore')}</button></Link>
          <img src='/images/icon_section_2.png' alt='House Kari Website' className={styles.icon_section_2} />
          <img src='/images/pattern_section_2.png' alt='House Kari Website' className={styles.pattern_section_2} />
        </div>
      </div> 
      <div className={styles.section_3}>
        <div className={styles.section_3_heading}>
          <h1 className={styles.heading_main}>{t('section2Home.resepAla')}</h1>
          <p className={`${styles.desc_main} ${styles.desc_main_margin}`}>{t('section2Home.resepAlaDesc')}</p>
        </div>
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
            {menuItems.map((menu) => (
              <div
                key={menu.id}
                className={`${styles.dropdownMenuItem} ${selectedMenu === menu.label ? styles.active : ''}`}
                onClick={() => handleSelectMenu(menu)}
              >
                {menu.label}
              </div>
            ))}
          </div>
        </div>
        {items.length > 0 && (
          <Swiper
            slidesPerView={3}
            spaceBetween={80}
            navigation={true}
            centeredSlides={true}
            initialSlide={1}
            modules={[Navigation]}
            className="mySwiperProduct"
            loop={true}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <div className='slideItemProduct'>
                  <div className='imageContainer'>
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.image_png}`} alt={item.title} />
                  </div>
                  <h1>{stripH1Tags(getRecipeName(item))}</h1>
                  <div className='contectProductContainer'>
                    <p>{stripH1Tags(getProductDesc(item))}</p>
                    <Link href={`/recipe/${item.id}`}>
                      <button>{t('lihatResep')}</button>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        {items.length > 0 && (
        <Swiper 
          navigation={true} 
          loop={true}
          modules={[Navigation]} 
          className="slideProductMobile">
              {items.map((item) => (
              <SwiperSlide key={item.id}>
                  <div className='slideItemProduct'>
                    <div className='imageContainer'>
                      <img src={`https://ops.housejapanesecurry.com/storage/${item.image_png}`} alt={item.title} />
                    </div>
                      <h1>{stripH1Tags(getProductName(item))}</h1>
                      <div className='contectProductContainer'>
                        <p>{stripH1Tags(getProductDesc(item))}</p>
                          <Link href={`/recipe/${item.id}`}><button>{t('lihatResep')}</button></Link>
                      </div>
                  </div>
              </SwiperSlide>
              ))}
        </Swiper>
        )}
        <div className={styles.divider}></div>
      </div>
      <div className={styles.section_4}>
        <img src='/images/section_4_icon_1.png' alt='House Kari' className={styles.section_4_icon_1} />
        {/* <Image
          src={`/images/section_4_icon_1.png`}
          alt='House Kari'
          fill
          quality={85}
          className={styles.section_4_icon_1} 
        /> */}
        <img src='/images/section_4_icon_2.png' alt='House Kari' className={styles.section_4_icon_2} />
        <div className={styles.space_between_heading}>
          <h1 className={styles.heading_main}>{t('newestArticle')}</h1>
          <Link href='/article/9'><p className={styles.desc_main_margin}>{t('readMoreArticle')}...</p></Link>
        </div>
        <div className={styles.blog_recent_layout}>
          {isLoading ? (
            [1, 2].map((_, index) => (
              <div key={index} className={styles.blog_recent_box}>
                <div className={styles.blog_recent_image}>
                  <Skeleton height={200} />
                </div>
                <div className={styles.blog_recent_content}>
                  <Skeleton width={100} />
                  <h1><Skeleton width={`100%`} /></h1>
                  <p><Skeleton count={2} /></p>
                  <Skeleton width={`100%`} height={40} />
                </div>
              </div>
            ))
          ) : (
            articles.map((article) => (
              <div key={article.id} className={styles.blog_recent_box}>
                <div className={styles.blog_recent_image}>
                  {/* <img src={`https://ops.housejapanesecurry.com/storage/${article.image}`} alt={article.title} /> */}
                  <Image
                      src={`https://ops.housejapanesecurry.com/storage/${article.image}`}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={75}
                      className="object-cover"
                    />
                </div>
                <div className={styles.blog_recent_content}>
                  <span>{t('posted')} {formatDate(article.date)}</span>
                  <h1>{stripH1Tags(getProductName(article))}</h1>
                  <p>{stripH1Tags(getProductText(article))}</p>
                  <Link href={`/article-detail/${article.id}`}><button>{t('section1Home.learnMore')}</button></Link>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={styles.heading_mobile_desc}>
          <Link href='/article/9'>{t('readMoreArticle')}...</Link>
        </div>
      </div>
      <div className={styles.section_5}>
        <div className={styles.space_between_heading}>
          <h1 className={styles.heading_main_white}>{t('otherArticle')}</h1>
        </div>
        <SlideArticlesSecond items={articlesSlide.map(article => ({
          ...article,
              title: stripH1Tags(getProductName(article)),
        }))} />
        <SlideArticlesSecondMobile items={articlesSlide.map(article => ({
            ...article,
            title: stripH1Tags(getProductName(article)),
        }))} /> 
        <div className={styles.divider}></div>
      </div>
      <div className={styles.section_6}>
          <div className={styles.section_6_image}>
            <img src='/images/form_image.webp' alt='House Kari'/>
          </div>
          <div className={styles.section_6_form}>
            <div className={styles.section_6_heading}>
              <h1 className={styles.heading_main}>{t('headingForm')}</h1>
              <p className={styles.desc_main_margin}>{t('headingFormDesc')}</p>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.form_fields}>
                <label>{t('nameForm')}</label>
                <input
                  type="text"
                  name="name"
                  placeholder={t('nameForm')}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.form_fields}>
                <label>{t('numberForm')}</label>
                <input
                  type="number"
                  name="phone_number"
                  placeholder={t('numberForm')}
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.form_fields}>
                <label>{t('reviewForm')}</label>
                <textarea
                  name="description"
                  placeholder={t('reviewForm')}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className={styles.form_fields_row}>
                <div className={styles.fileInputWrapper}>
                <input
                  type="file"
                  id="file-input"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                />
                <label htmlFor="file-input" className={styles.customFileLabel}>
                  + {fileCount > 0 ? `${fileCount} ${t('unggahFile')}` : t('unggahFile')}
                </label>
                </div>
                <button type="submit" disabled={loading} className={styles.submitButton}>
                  {loading ? (
                    <span>Loading...</span> // Add your spinner or loading indicator
                  ) : (
                    t('submitBtn')
                  )}
                </button>
              </div>
            </form>
            {isVisible && <p className={styles.notifPost}>{message}</p>}
          </div>
      </div>
      <div className={styles.section_7}>
        <img src='/images/section_7_icon.png' alt='House Kari' className={styles.section_7_icon}/>
        <img src='/images/ginger_icon.png' alt='House Kari' className={styles.ginger_icon}/>
        <div className={styles.padding_container}>
          <div className={styles.space_between_heading}>
            <h1 className={styles.heading_main}>{t('testimoniHeading')}</h1>
          </div>
        </div>
        <SlideTestimonialsMobile items={testimonials.map(item => ({
            ...item,
        }))}/>
        <SlideTestimonials items={testimonials.map(item => ({
            ...item,
        }))}/>
      </div>
    </>
  );
}
