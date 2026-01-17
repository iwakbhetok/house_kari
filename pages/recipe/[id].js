import { useState, useEffect } from 'react';
import banner from '@/styles/Banner.module.css'
import Head from 'next/head';
import styles from '@/styles/Recipe.module.css'
import SlideArticles from '../components/slide_articles';
import Link from 'next/link';
import SlideArticlesMobile from '../components/slide_articles_mobile';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; 
import axios from 'axios';
import { useRouter } from 'next/router';
import SlideArticlesSecond from '../components/slide_articles_second';
import SlideArticlesSecondMobile from '../components/slide_articles_second_mobile';

const API_RECIPE_DETAIL_URL = process.env.NEXT_PUBLIC_API_RECIPE_DETAIL_URL || '/api/recipe-detail';

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const response = await fetch(`${API_RECIPE_DETAIL_URL}/${id}`); 
    if (!response.ok) {
      throw new Error('Failed to fetch product detail');
    }
    const recipe = await response.json();

    console.log('Product Detail API Response:', recipe); // Log the API response

    return {
      props: {
        ...(await serverSideTranslations(context.locale, ['common'])),
        recipe,
      },
    };
  } catch (error) {
    console.error('Fetch product error:', error);
    return {
      props: {
        ...(await serverSideTranslations(context.locale, ['common'])),
        recipe: null,
      },
    };
  }
}

const RecipeDetail = () => {
    const { t, i18n } = useTranslation('common');
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [detail, setDetail] = useState(null);

    const [recipeList, setRecipeList] = useState([]);
    const [articlesSlide, setArticlesSlide] = useState([]);

    useEffect(() => {
      const fetchArticlesSlide = async () => {
        try {
          const response = await axios.get(`/api/list-article/`);
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
          setArticlesSlide(limitedArticles);
          console.log('Fetched and shuffled product:', limitedArticles);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };
    
      fetchArticlesSlide();
    }, []);

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

    useEffect(() => {
      const fetchProduct = async () => {
        if (id) {
          try {
            const response = await axios.get(`${API_RECIPE_DETAIL_URL}/${id}`);
            setDetail(response.data.data); // Perhatikan pengaturan data detail di sini
            setLoading(false);
            console.log('Fetched product:', response.data.data);
          } catch (error) {
            console.error('Error fetching product:', error);
            setLoading(false);
          }
        }
      };
    
      fetchProduct();
    }, [id]);

    const togglePopup = () => {
        setIsActive(!isActive); 
    };

      if (router.isFallback || loading) {
        return <div className="loading_interface">
        <img src="/images/loading_image.png"/>
      </div>;
      }
      
      if (!detail) {
        return <p>Product not found</p>;
      }

      const secondColor = 'creamColor'
      const paginationStyle = 'old_red_color'

      const getProductName = (detail) => {
        switch (i18n.language) {
          case 'en':
            return detail.title_en || detail.title;
          case 'zh':
            return detail.title_chi || detail.title;
          default:
            return detail.title;
        }
      };

      const getDescName = (detail) => {
        switch (i18n.language) {
          case 'en':
            return detail.description_en || detail.description;
          case 'zh':
            return detail.description_chi || detail.description;
          default:
            return detail.description;
        }
      };

      const getIngredients = (detail) => {
        switch (i18n.language) {
          case 'en':
            return detail.ingredients_en || detail.ingredients;
          case 'zh':
            return detail.ingredients_chi || detail.ingredients;
          default:
            return detail.ingredients;
        }
      };

      const renderIngredients = (ingredients) => {
        return { __html: ingredients }; // Memasukkan teks HTML ke dalam objek dengan __html
      };

      const getHowTo = (detail) => {
        switch (i18n.language) {
          case 'en':
            return detail.howToMake_en || detail.howToMake;
          case 'zh':
            return detail.howToMake_chi || detail.howToMake;
          default:
            return detail.howToMake;
        }
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

      const renderhowToMake = (howToMake) => {
        return { __html: howToMake }; // Memasukkan teks HTML ke dalam objek dengan __html
      };

      const stripPTags = (html) => {
        if (typeof html === 'string') {
          return html.replace(/<p[^>]*>|<\/p>/g, ''); 
        } else {
          return html;
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
      
      
      

      function stripTags(str) {
        return str.replace(/<\/?[^>]+(>|$)/g, '');
      }
      
      function getYouTubeVideoId(url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/|user\/[\w-]+\/(?:videos|playlist|about|live|featured|channel|community)?\/)?|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

      const videoId = detail.link_youtube ? getYouTubeVideoId(detail.link_youtube) : null;

      const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';
      console.log('link yt',videoId)

      const imageClass = detail.link_youtube ? styles.hidden_image : styles.section4_image;

      const section4VideoClass = detail.link_youtube ? styles.section4_video : styles.hidden_image;

      // const pageTitle = `House Kari | ${t('menu.recipe')} A`;
      const pageTitle = detail ? `House Kari | ${stripH1Tags(getProductName(detail))}` : 'House Kari';

      

    return(
        <>
        <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Learn more about us" />
        </Head>
        <div className={banner.bannerStyle}>
            <img src="/images/recipe_banner.png" alt="House Kari Website"/>
        </div>
        <div className={banner.breadcrumbs}>
            <p>{t('menu.home')} / {t('menu.recipe')} / <span>{stripH1Tags(getProductName(detail))}</span></p>
        </div>
        <div className={styles.section4}>
            <div className={styles.section4_layout}>
                  <div className={styles.section4_image_layout}>
                    <div className={imageClass}>
                        <img src={`https://prahwa.net/storage/${detail.image}`} alt={detail.name} />
                        <div className={styles.section4_overlay}></div>
                    </div>
                    <div className={section4VideoClass}>
                        {detail.link_youtube && (
                            <iframe
                                width="560"
                                height="315"
                                src={embedUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                  </div>
                  <div className={styles.section4_content_layout}>
                    <div className={styles.section4_content}> 
                        <div className={styles.recipeDetail}>
                            <h1>{stripH1Tags(getProductName(detail))}</h1>
                            <p>{stripH1Tags(getDescName(detail))}</p>
                        </div>
                        <div className={styles.recipeBahan}>
                            <h3 className={styles.headingRecipeDetail}>{t('bahan')}</h3>
                            <div dangerouslySetInnerHTML={renderIngredients(getIngredients(detail))}></div>
                        </div>
                        <div className={styles.recipeCara}>
                            <h3 className={styles.headingRecipeDetail}>{t('caraBuat')}</h3>
                            <div dangerouslySetInnerHTML={renderhowToMake(getHowTo(detail))}></div>
                        </div>
                    </div>
                    <button onClick={togglePopup} className={styles.btn_download}>{t('download')}</button>
                  </div>
            </div>
        </div>
        <div className={styles.section5}>
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
          {/* <SlideArticlesMobile classNames={secondColor} paginationClass={paginationStyle} items={slideBlog} />
          <SlideArticles classNames={secondColor} paginationClass={paginationStyle} items={slideBlog} /> */}
          <SlideArticlesSecond classNames={secondColor} paginationClass={paginationStyle} items={articlesSlide.map(detail => ({
          ...detail,
              title: stripH1Tags(getProductName(detail)),
          }))} />
          <SlideArticlesSecondMobile classNames={secondColor} paginationClass={paginationStyle} items={articlesSlide.map(detail => ({
              ...detail,
              title: stripH1Tags(getProductName(detail)),
          }))} /> 
        </div>
        <div className={`${styles.popup} ${isActive ? styles.active : ''}`}>
            <div className={styles.popupContent}>
                {detail.coockbook_en || detail.coockbook_chi || detail.coockbook ? (
                    <>
                        {detail.coockbook_en && (
                            <Link href={`https://prahwa.net/storage/${detail.coockbook_en}`} target='_blank'>
                                <button>Western Cookbook</button>
                            </Link>
                        )}
                        {detail.coockbook_chi && (
                            <Link href={`https://prahwa.net/storage/${detail.coockbook_chi}`} target='_blank'>
                                <button>Chinese Cookbook</button>
                            </Link>
                        )}
                        {detail.coockbook && (
                            <Link href={`https://prahwa.net/storage/${detail.coockbook}`} target='_blank'>
                                <button>Indonesian Cookbook</button>
                            </Link>
                        )}
                    </>
                ) : (
                    <p>Sorry, recipe is being created</p>
                )}

                <span onClick={togglePopup} className={styles.closeButton}>X</span>
            </div>
        </div>
        </>
    );
}

export default RecipeDetail