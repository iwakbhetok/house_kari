import Head from "next/head";
import styles from '@/styles/Recipe.module.css'
import banner from '@/styles/Banner.module.css'
import { useState, useEffect, useRef } from "react";
import SlideRecipe from "../components/slide_recipe";
import SlideArticles from "../components/slide_articles";
import SlideArticlesMobile from "../components/slide_articles_mobile";
import { IoChevronDown } from "react-icons/io5";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; 
import axios from "axios";
import Link from "next/link";
import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import SlideArticlesSecond from "../components/slide_articles_second";
import SlideArticlesSecondMobile from "../components/slide_articles_second_mobile";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation } from 'swiper/modules';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

const chunkArray = (arr, chunkSize) => {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
};

export default function Recipe() {
  const { t, i18n } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Bread & Pastry');

  const menuItems = [
    'Bread & Pastry',
    'Vegetables',
    'Meat',
    'Seafood',
    'Snacks'
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const secondColor = 'creamColor'
  const paginationStyle = 'old_red_color'
  const pageTitle = `House Kari | ${t('menu.recipe')}`;

  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // State untuk menyimpan indeks tab aktif

  const [articlesSlide, setArticlesSlide] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

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
        console.log('Fetched and shuffled product:', shuffledArticles);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
  
    fetchArticlesSlide();
  }, []);
  

  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/recipe-categories');
        const categoriesData = response.data.data;
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!selectedCategory) return;
      try {
        const response = await axios.get(`/api/recipeByCategories/${selectedCategory}`);
        setRecipes(response.data.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchRecipes();
  }, [selectedCategory]);

  const getCategoryName = (category) => {
    switch (i18n.language) {
      case 'en':
        return category.name_en || category.name;
      case 'zh':
        return category.name_chi || category.name;
      default:
        return category.name;
    }
  };

  const getProductName = (recipe) => {
    switch (i18n.language) {
      case 'en':
        return recipe.title_en || recipe.title;
      case 'zh':
        return recipe.title_chi || recipe.title;
      default:
        return recipe.title;
    }
  };

  const getDescriptionName = (recipe) => {
    switch (i18n.language) {
      case 'en':
        return recipe.description_en || recipe.description;
      case 'zh':
        return recipe.description_chi || recipe.description;
      default:
        return recipe.description;
    }
  };

  const handleSetActiveTab = (id) => {
    setActiveTab(id);
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const stripPTags = (html) => {
    if (typeof html === 'string') {
      return html.replace(/<p[^>]*>|<\/p>/g, '');
    } else {
      return html; // atau return '';
  }
  };

const [recipeList, setRecipeList] = useState([]);

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

  const chunkedRecipes = chunkArray(recipes, 2);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Learn more about us" />
      </Head>
      <div className={banner.bannerStyle}>
        <img src="/images/recipe_banner.png" alt="House Kari Website"/>
      </div>
      <div className={banner.breadcrumbs}>
        <p>{t('menu.home')} / <span>{t('menu.recipe')}</span></p>
      </div>
      <div className={styles.section1}>
        <img src="/images/sendok_recipe_slide.png" alt="House Kari" className={styles.sendok_recipe_slide}/>
        <div className={styles.tabContainer}>
          <div className={styles.tabHeadersLayout}>
            <div className={styles.tabHeaders}>
              {loadingCategories ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} height={40} width={100} style={{ margin: '0 10px' }} />
                ))
              ) : (
                categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setActiveTab(0); // Reset tab aktif ke tab pertama saat kategori dipilih
                    }}
                    className={`${styles.tabHeader} ${selectedCategory === category.id ? styles.active : ''}`}
                  >
                    {getCategoryName(category)}
                  </button>
                ))
              )}
            </div>
          </div>
          <div className={styles.tabContent}>
            <h1 className='headingRecipeSlide'>{t('featuredRecipe')}</h1>
            {loadingRecipes ? (
              <Swiper
                slidesPerView={3}
                spaceBetween={0}
                centeredSlides={true}
                loop={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                navigation={true}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination, Navigation]}
                className="mySwiperRecipe"
              >
                {[1, 2, 3].map((_, index) => (
                  <SwiperSlide key={index}>
                    <div className='slideItemRecipe'>
                      <div className='imageRecipe'>
                        <Skeleton style={{width: "100%", height: "100%", position: "absolute"}} />
                      </div>
                      <div className='contentRecipe'>
                        <Skeleton height={30} width={150} />
                        <Skeleton height={20} width={200} />
                        <Skeleton height={30} width={100} />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Swiper
                slidesPerView={3}
                spaceBetween={0}
                centeredSlides={true}
                loop={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                navigation={true}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination, Navigation]}
                className="mySwiperRecipe"
              >
                {recipes.map(recipe => (
                  <SwiperSlide key={recipe.id}>
                    <div className='slideItemRecipe'>
                      <div className='imageRecipe'>
                        <img src={`https://prahwa.net/storage/${recipe.image}`} alt={recipe.title} />
                      </div>
                      <div className='contentRecipe'>
                        <h1 dangerouslySetInnerHTML={{ __html: stripH1Tags(getProductName(recipe)) }}></h1>
                        <p dangerouslySetInnerHTML={{ __html: getDescriptionName(recipe) }}></p>
                        <Link href={`/recipe/[id]`} as={`/recipe/${recipe.id}`}><button>{t('section1Home.learnMore')}</button></Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            {recipes.length > 0 && (
            <Swiper 
                autoHeight={true}
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                centeredSlides={true}
                pagination={{
                  clickable:true
                }}
                modules={[Pagination]}
                className="mySwiperRecipeMobile"
                initialSlide={0}
              >
                {chunkedRecipes.map((chunk, index) => (
                  <SwiperSlide key={index}>
                    {chunk.map(recipe => (
                    <div className="slideItemRecipe" key={index}>
                        <div className="recipeItem">
                          <div className="imageRecipe">
                            <img src={`https://prahwa.net/storage/${recipe.image}`} alt={recipe.name} />
                          </div>
                          <div className="contentRecipe">
                            <h1 dangerouslySetInnerHTML={{ __html: stripH1Tags(getProductName(recipe)) }}></h1>
                            <p dangerouslySetInnerHTML={{ __html: getDescriptionName(recipe) }}></p>
                            <Link href={`/recipe/[id]`} as={`/recipe/${recipe.id}`}><button>{t('section1Home.learnMore')}</button></Link>
                          </div>
                        </div>
                    </div>
                    ))}
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>
      <div className={styles.section2}>
        <img src="/images/section_2_recipe_icon.png" alt="House Kari" className={styles.section_2_recipe_icon}/>
        <div className={styles.space_between_heading}>
          <h1 className={styles.heading_main_white}>{t('otherRecipe')}</h1>
        </div>
        <SlideArticles items={recipeList.map(recipe => ({
            ...recipe,
            title: stripH1Tags(getRecipeTitle(recipe)),
        }))} />
         <SlideArticlesMobile items={recipeList.map(recipe => ({
            ...recipe,
            title: stripH1Tags(getRecipeTitle(recipe)), 
        }))} />
        <div className={styles.divider}></div>
      </div>
      <div className={styles.section3}>
          <img src="/images/recipe_icon_section3.png" className={styles.recipe_icon_section3} alt="House Kari"/>
          <div className={styles.space_between_heading}>
              <h1 className={styles.heading_main_red}>{t('otherRecipeList')}</h1>
          </div>
          <SlideArticlesSecond classNames={secondColor} paginationClass={paginationStyle} items={articlesSlide.map(detail => ({
          ...detail,
              title: stripH1Tags(getProductName(detail)),
          }))} />
          <SlideArticlesSecondMobile classNames={secondColor} paginationClass={paginationStyle} items={articlesSlide.map(detail => ({
              ...detail,
              title: stripH1Tags(getProductName(detail)),
          }))} /> 
      </div>
    </>
  );
}
