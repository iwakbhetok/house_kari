import Head from "next/head";
import styles from '@/styles/Article.module.css'
import banner from '@/styles/Banner.module.css'
import Link from "next/link";
import SlideArticles from "../components/slide_articles";
import { useState, useEffect, useRef } from "react";
import { IoChevronDown } from "react-icons/io5";
import SlideArticlesMobile from "../components/slide_articles_mobile";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; 
import axios from "axios";
import SlideArticlesSecond from "../components/slide_articles_second";
import SlideArticlesSecondMobile from "../components/slide_articles_second_mobile";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import style jika diperlukan

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function Article() {
  const { t, i18n } = useTranslation('common'); 

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Article');
  // const [detail, setDetail] = useState([]);
  const [recipeList, setRecipeList] = useState([]);
  const [articlesSlide, setArticlesSlide] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const articleId = 13;

  useEffect(() => {
    const fetchArticlesSlide = async () => {
      try {
        const response = await axios.get(`/api/list-article-category/${articleId}`);
        const articles = response.data.data;
  
        // Mengurutkan artikel berdasarkan tanggal terbaru
        const sortedArticles = articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  
        // Mengambil 2 artikel terbaru
        const recent = sortedArticles.slice(0, 2);
  
        // Menghapus artikel terbaru dari daftar artikel yang akan diacak
        const remainingArticles = sortedArticles.slice(2);
  
        // Fungsi untuk mengacak urutan array
        const shuffleArray = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };
  
        const shuffledArticles = shuffleArray(remainingArticles);
        const limitedArticles = shuffledArticles.slice(0, 10); // Membatasi hingga 10 artikel
  
        setArticlesSlide(limitedArticles);
        setRecentArticles(recent);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };
  
    fetchArticlesSlide();
  }, [articleId]);
  

useEffect(() => {
  const fetchRecipes = async () => {
      try {
          const response = await axios.get('/api/all-recipes');
          const recipes = response.data.data;

          // Shuffle the recipes array
          for (let i = recipes.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [recipes[i], recipes[j]] = [recipes[j], recipes[i]];
          }

          // Limit to 7 recipes
          const limitedRecipes = recipes.slice(0, 7);

          setRecipeList(limitedRecipes);
      } catch (error) {
          console.error('Error fetching recipes:', error);
      }
  };

  fetchRecipes();
}, []);

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

  const secondColor = 'creamColor'
  const paginationStyle = 'old_red_color'

  const menuItems = [
    {
      categoryId: 1,
      categoryName: 'Article',
      categoryLink: '/'
    },
    {
      categoryId: 2,
      categoryName: 'Tips & Trick',
      categoryLink: 'tips-trick'
    },
    {
      categoryId: 3,
      categoryName: 'Event',
      categoryLink: 'event'
    },
    {
      categoryId: 4,
      categoryName: 'Media Release',
      categoryLink: 'media-release'
    },
  ];

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
    setSelectedMenu(menu.categoryName);
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

  const getRecipeTitle = (recipe) => {
    switch (i18n.language) {
        case 'en':
            return recipe.title_en || recipe.title;
        case 'zh':
            return recipe.title_chi || recipe.title;
        default:
            return recipe.title;
    }
};

const stripPTags = (html) => {
  if (typeof html === 'string') {
    return html.replace(/<p[^>]*>|<\/p>/g, '');
  } else {
    return html;
  }
};

const getRecipeTitleHeading = (blog) => {
  switch (i18n.language) {
      case 'en':
          return blog.title_en || blog.title;
      case 'zh':
          return blog.title_chi || blog.title;
      default:
          return blog.title;
  }
};

const getDescriptionName = (blog) => {
  switch (i18n.language) {
    case 'en':
      return blog.text_en || blog.text;
    case 'zh':
      return blog.text_chi || blog.text;
    default:
      return blog.text;
  }
};

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

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
};

  const pageTitle = `House Kari | ${t('menu.article')}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Learn more about us" />
      </Head>
      <div className={banner.bannerStyle}>
        <img src="/images/article_banner.png" alt="House Kari Website"/>
      </div>
      <div className={banner.breadcrumbs}> 
        <p>{t('menu.home')} / <span>{t('menu.article')}</span></p>
      </div>
      <div onTouchStart={handleTouchStart}  
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown} className={`${styles.dropdownMenu} ${isOpen ? styles.active : ''}`} style={{ height: isMobile ? `${height}px` : 'auto' }}>
          <div className={styles.circle_menu}><div className={styles.circle_menu_box}></div></div>
          {menuItems.map((menu) => (
            <div
              key={menu.categoryId}
              className={`${styles.dropdownMenuItem} ${selectedMenu === menu.categoryId ? styles.active : ''}`}
              onClick={() => handleSelectMenu(menu)}
            >
              <Link href={`/article/${menu.categoryLink}`} legacyBehavior><a>{menu.categoryName}</a></Link>
            </div>
          ))}
      </div>
      <div className={styles.section1}>
        <img src="/images/black_pepper_icon.png" alt="House Kari" className={styles.black_pepper_icon}/>
        <div className={styles.section1_layout}>
          <div className={styles.section1_tab_layout}>
            <div className={styles.section1_tab}>
              <Link href='/article'><button className={styles.activeTab}>{t('menu.article')}</button></Link>
              <Link href='/article/tips-trick'><button>{t('menu.tipsTricks')}</button></Link>
              <Link href='/article/event'><button>{t('menu.event')}</button></Link>
              <Link href='/article/media-release'><button>{t('menu.mediaRelease')}</button></Link>
            </div>
          </div>
          <div className={styles.section1_box}>
            <div className={styles.space_between_heading}>
              <h1 className={styles.heading_main}>{t('newestArticle')}</h1>
            </div>
            <div className={styles.blog_recent_layout}>
              {loading ? (
                <>
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className={styles.blog_recent_box}>
                      <div className={styles.blog_recent_image}>
                        <Skeleton height={300} />
                      </div>
                      <div className={styles.blog_recent_content}>
                        <Skeleton width={100} />
                        <h1><Skeleton width={`100%`} /></h1>
                        <p><Skeleton count={2} /></p>
                        <Skeleton width={`100%`} height={40} />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                recentArticles.map((blog, index) => (
                  <div key={index} className={styles.blog_recent_box}>
                    <div className={styles.blog_recent_image}>
                      <Link href={`/article-detail/[id]`} as={`/article-detail/${blog.id}`}>
                        <img src={`https://prahwa.net/storage/${blog.image}`} alt={blog.title} />
                      </Link>
                    </div>
                    <div className={styles.blog_recent_content}>
                      {blog.date && <span>{t('posted')} {formatDate(blog.date)}</span>}
                      <h1 dangerouslySetInnerHTML={{ __html: stripH1Tags(getRecipeTitleHeading(blog)) }}></h1>
                      <p dangerouslySetInnerHTML={{ __html: stripH1Tags(getDescriptionName(blog)) }}></p>
                      <Link href={`/article-detail/${blog.id}`}><button>{t('section1Home.learnMore')}</button></Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section2}>
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
      <div className={styles.section3}>
          <img src="/images/cinamon_icon.png" alt="House Kari" className={styles.cinamon_icon}/>
          <img src="/images/product_detail_icon_2.png" alt="House Kari" className={styles.product_detail_icon_2}/>
          <div className={styles.space_between_heading}>
              <h1 className={styles.heading_main_red}>{t('headingRecipe')}</h1>
          </div>
          <SlideArticles classNames={secondColor} paginationClass={paginationStyle} items={recipeList.map(recipe => ({
          ...recipe,
              title: stripH1Tags(getRecipeTitle(recipe)),
          }))} />
          <SlideArticlesMobile classNames={secondColor} paginationClass={paginationStyle} items={recipeList.map(recipe => ({
              ...recipe,
              title: stripH1Tags(getRecipeTitle(recipe)),
          }))} />
      </div>
    </>
  );
}
