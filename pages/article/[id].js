import Head from "next/head";
import styles from '@/styles/Article.module.css';
import banner from '@/styles/Banner.module.css';
import Link from "next/link";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SlideArticles from "../components/slide_articles";
import SlideArticlesMobile from "../components/slide_articles_mobile";
import axios from 'axios';
import SlideArticlesSecond from "../components/slide_articles_second";
import SlideArticlesSecondMobile from "../components/slide_articles_second_mobile";

const API_PRODUCT_DETAIL_URL = process.env.NEXT_PUBLIC_API_ARTICLE_DETAIL_URL || '/api/list-article-category';

export async function getServerSideProps(context) {
    const { id } = context.params; 
  
    try {
      const response = await fetch(`${API_PRODUCT_DETAIL_URL}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product detail');
      }
      const product = await response.json();
  
      console.log('Product Detail API Response:', product); // Log the API response
  
      return {
        props: {
          ...(await serverSideTranslations(context.locale, ['common'])),
          product,
        },
      };
    } catch (error) {
      console.error('Fetch product error:', error);
      return {
        props: {
          ...(await serverSideTranslations(context.locale, ['common'])),
          product: null,
        },
      };
    }
}

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
};

const ArticlePage = () => { 
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState([]);
  const [error, setError] = useState(null);
  const [recipeList, setRecipeList] = useState([]);
  const [articlesSlide, setArticlesSlide] = useState([]);

useEffect(() => {
  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`/api/all-recipes/`);
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
      const limitedArticles = shuffledArticles.slice(0, 7); // Membatasi hingga 7 artikel
      setRecipeList(limitedArticles);
      console.log('Fetched and shuffled product:', limitedArticles);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  fetchRecipes();
}, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get('/api/article-categories/');
        setDetail(response.data.data);
        console.log('Fetched categories:', response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.message);
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      if (id) {
        try {
          const response = await axios.get(`${API_PRODUCT_DETAIL_URL}/${id}`);
          const articles = response.data.data;
  
          // Assuming the date field is in 'YYYY-MM-DD' format; adjust if necessary
          const sortedArticles = articles
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
            .slice(0, 2); // Select the top 2 most recent articles
  
          setArticles(sortedArticles);
          setLoading(false);
          console.log('Fetched and filtered articles:', sortedArticles);
        } catch (error) {
          console.error('Error fetching articles:', error);
          setLoading(false);
        }
      }
    };
  
    fetchArticles();
  }, [id]);

  useEffect(() => {
    const fetchArticlesSlide = async () => {
      if (id) {
        try {
          const response = await axios.get(`${API_PRODUCT_DETAIL_URL}/${id}`);
          setArticlesSlide(response.data.data); // Perhatikan pengaturan data detail di sini
          setLoading(false);
          console.log('Fetched product:', response.data.data);
        } catch (error) {
          console.error('Error fetching product:', error);
          setLoading(false);
        }
      }
    };
  
    fetchArticlesSlide();
  }, [id]);

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

  const stripPTags = (html) => {
    if (typeof html === 'string') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || '';
    } else {
      return '';
    }
  };

  if (router.isFallback || loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (articles.length === 0) return <p>No articles found.</p>;

  const activeMenu = detail.find(menu => parseInt(id) === menu.id);

  const pageTitle = `House Kari | ${activeMenu ? activeMenu.name : ''}`;

  const secondColor = 'creamColor'
  const paginationStyle = 'old_red_color'

  

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Learn more about us" />
      </Head>
      <div className={banner.bannerStyle}>
        <img src="/images/product_page_banner.png" alt="House Kari Website" />
      </div>
      <div className={banner.breadcrumbs}>
        <p>{t('menu.home')} / {t('menu.article')} / <span>{activeMenu ? activeMenu.name : ''}</span></p>
      </div>
      <div className={styles.section1}>
        <img src="/images/black_pepper_icon.png" alt="House Kari" className={styles.black_pepper_icon}/>
        <div className={styles.section1_layout}>
          <div className={styles.section1_tab}>
            {detail.map((menu) => (
              <Link key={menu.id} href={`/article/${menu.id}`} passHref>
                <button 
                  className={parseInt(id) === menu.id ? styles.activeTab : ''}
                >
                  {menu.name}
                </button>
              </Link>
            ))}
          </div>
          <div className={styles.section1_box}>
            <div className={styles.space_between_heading}>
              <h1 className={styles.heading_main}>{t('newestArticle')}</h1>
            </div>
            <div className={styles.blog_recent_layout}>
              {articles.map((article) => (
                <div key={article.id} className={styles.blog_recent_box}>
                  <div className={styles.blog_recent_image}>
                    <img src={`https://prahwa.net/storage/${article.image}`} alt={article.title} />
                  </div>
                  <div className={styles.blog_recent_content}>
                    <span>{t('posted')} {formatDate(article.date)}</span>
                    <h1>{stripPTags(getProductName(article))}</h1>
                    <p>{stripPTags(getProductText(article))}</p>
                    <Link href={`/article-detail/${article.id}`}><button>{t('section1Home.learnMore')}</button></Link>
                  </div>
                </div>
              ))}
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
              title: stripPTags(getProductName(article)),
        }))} />
        <SlideArticlesSecondMobile items={articlesSlide.map(article => ({
            ...article,
            title: stripPTags(getProductName(article)),
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
              title: stripPTags(getRecipeTitle(recipe)),
          }))} />
          <SlideArticlesMobile classNames={secondColor} paginationClass={paginationStyle} items={recipeList.map(recipe => ({
              ...recipe,
              title: stripPTags(getRecipeTitle(recipe)),
          }))} />
      </div>
    </>
  );
};

export default ArticlePage;
