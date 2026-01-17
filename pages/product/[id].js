import Head from "next/head";
import styles from '@/styles/Product.module.css';
import banner from '@/styles/Banner.module.css';
import Link from "next/link";
import SlideArticles from "../components/slide_articles";
import SlideArticlesMobile from "../components/slide_articles_mobile";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

const API_PRODUCT_DETAIL_URL = process.env.NEXT_PUBLIC_API_PRODUCT_DETAIL_URL || '/api/product-detail';

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

const ProductDetails = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [recipeList, setRecipeList] = useState([]);
  const [detail, setDetail] = useState(null);
  const [recommend, setRecommend] = useState(null);

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
          const response = await axios.get(`${API_PRODUCT_DETAIL_URL}/${id}`);
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

  useEffect(() => {
    const fetchRecommends = async () => {
      try {
        const response = await axios.get('/api/product');
        const data = response.data.data;

        // Filter out items with matching id
        const filteredData = data.filter(item => item.id !== id);

        // Shuffle the filtered array
        const shuffledData = filteredData.sort(() => 0.7 - Math.random());

        // Limit to 7 items
        const limitedRecommends = shuffledData.slice(0, 6);

        setRecommend(limitedRecommends);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (id) {
      fetchRecommends();
    }
  }, [id]);

  if (router.isFallback || loading) {
    return <div className="loading_interface">
      <img src="/images/loading_image.png"/>
    </div>;
  }
  
  if (!detail) {
    return <p>Product not found</p>;
  }

  const secondColor = 'creamColor';
  const paginationStyle = 'old_red_color';

  const getProductName = (detail) => {
    switch (i18n.language) {
      case 'en':
        return detail.name_en || detail.name;
      case 'zh':
        return detail.name_chi || detail.name;
      default:
        return detail.name;
    }
  };

  const getProductDesc = (detail) => {
    switch (i18n.language) {
      case 'en':
        return detail.description_en || detail.description;
      case 'zh':
        return detail.description_chi || detail.description;
      default:
        return detail.description;
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

  const stripPTags = (html) => {
    if (typeof html === 'string') {
      return html.replace(/<p[^>]*>|<\/p>/g, '');
    } else {
      return html;
    }
  };

  const removeQuotes = (str) => {
    return str.replace(/['"]/g, '');
  };

  const getProductRecommend = (product) => {
    switch (i18n.language) {
      case 'en':
        return product.name_en || product.name;
      case 'zh':
        return product.name_chi || product.name;
      default:
        return product.name;
    }
  };

  const formatWeight = (weight) => {
    const weightStr = weight.toString();
  
    // Replace '99' with a comma
    let formattedWeight = weightStr.replace(/99/g, ',');
  
    // Add thousands separator
    // formattedWeight = formattedWeight.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    // Handle the case for '265'
    if (formattedWeight.includes('265')) {
      // Remove '265' and add 'kg' at the end
      formattedWeight = formattedWeight.replace('265', '') + 'kg'; 
    }
  
    // Handle the case for '275'
    if (formattedWeight.includes('275')) {
      // Remove '275' and add 'g' at the end
      formattedWeight = formattedWeight.replace('275', '') + 'g';
    }
  
    return formattedWeight;
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

  const pageTitle = detail ? `House Kari | ${getProductName(detail)}` : 'House Kari';
  const ecommerceLinks = JSON.parse(detail.ecommerce_links);

  let parsedLinks = {};

  try {
    // Check if ecommerceLinks is a string that needs parsing
    if (typeof ecommerceLinks === 'string') {
      parsedLinks = JSON.parse(ecommerceLinks);
    } else {
      parsedLinks = ecommerceLinks; // Assume it's already an object
    }
  } catch (error) {
    console.error('Error parsing ecommerce_links:', error);
    return <p>Belum ada ecommerce</p>; // Display fallback message on error
  }

  // Check if any link is valid
  const hasValidLinks = Object.values(parsedLinks).some(
    (item) => item.link && typeof item.link === 'string'
  );

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
        <p>{t('menu.home')} / {t('menu.product')} / <span>{stripH1Tags(getProductName(detail))}</span></p>
      </div>
      <div className={styles.section3}>
        <div className={styles.section3_layout}>
          <div className={styles.section3_box}>
            <img src="/images/btn_hover.png" alt="House Kari" className={styles.btn_hover} />
            <div className={styles.section3_image}>
              <img src={`https://prahwa.net/storage/${detail.image}`} alt={detail.name} />
            </div>
            <div className={styles.section3_content}>
              <h1>{stripH1Tags(getProductName(detail))} {formatWeight(detail.weight)}</h1>
              <div className={styles.section3_content_desc}>
                <p dangerouslySetInnerHTML={{ __html: getProductDesc(detail) }}></p>
              </div>
              <div className={styles.section3_ecommerce}>
                <h2>{t('beliSekarang')}</h2>
                <div className={styles.section3_ecommerce_layout}>
                {hasValidLinks ? (
                  Object.keys(parsedLinks).map((key) => {
                    const { link, color_code, logo } = parsedLinks[key];

                    // Skip rendering if link is not a valid string
                    if (!link || typeof link !== 'string') {
                      return null;
                    }

                    return (
                      <Link href={link} key={key} passHref legacyBehavior>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button
                            style={{
                              backgroundColor: color_code
                            }}
                          >
                            <img
                              src={`https://prahwa.net/storage/${logo}`}
                              alt={key}
                            />
                          </button>
                        </a>
                      </Link>
                    );
                  })
                ) : (
                  <p style={{width: 'max-content', color: '#651318'}}>{t('notEcommerce')}</p>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section3Mobile}>
        <div className={styles.section3_layout}>
          <div className={styles.section3_box}>
            <div className={styles.section3_box_mobile}>
                <div className={styles.section3_image}>
                    <img src={`https://prahwa.net/storage/${detail.image}`} alt={detail.name} />
                </div>
            </div>
            <div className={styles.section3_box_mobile_content}>
                <div className={styles.section3_content}>
                <h1>{getProductName(detail)} {formatWeight(detail.weight)}</h1>
                <div className={styles.section3_content_desc}>
                    <p dangerouslySetInnerHTML={{ __html: getProductDesc(detail) }}></p>
                </div>
                <div className={styles.section3_ecommerce}>
                    <h2>{t('beliSekarang')}</h2>
                    <div className={styles.section3_ecommerce_layout}>
                    {hasValidLinks ? (
                      Object.keys(parsedLinks).map((key) => {
                        const { link, color_code, logo } = parsedLinks[key];

                        // Skip rendering if link is not a valid string
                        if (!link || typeof link !== 'string') {
                          return null;
                        }

                        return (
                          <Link href={link} key={key} passHref legacyBehavior>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <button
                                style={{
                                  backgroundColor: color_code
                                }}
                              >
                                <img
                                  src={`https://prahwa.net/storage/${logo}`}
                                  alt={key}
                                />
                              </button>
                            </a>
                          </Link>
                        );
                      })
                    ) : (
                      <p style={{width: 'max-content', color: '#651318'}}>{t('notEcommerce')}</p>
                    )}
                    </div>
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section4}>
        <div className={styles.section4_heading}>
          <h1>{t('otherProduct')}</h1>
        </div>
        <div className={styles.productLayoutBox}>
            <div className={styles.productLayout}>
              {recommend && recommend.length > 0 && recommend.filter(product => product.id !== Number(id)).map((product, index) => (
                <div className={`${styles.boxProduct} ${styles.boxProductWhite}`} key={index}>
                  <div className={styles.imageProduct}>
                    <img src={`https://prahwa.net/storage/${product.image}`} alt={product.name} />
                  </div>
                  <div className={styles.contentProduct}>
                    <h1>{getProductRecommend(product)}</h1>
                    <span>{formatWeight(product.weight)}</span>
                    <Link href={`/product/${product.id}`}><button>{t('section1Home.learnMore')}</button></Link>
                  </div>
                </div>
              ))}
            </div>
        </div> 
        <div className={styles.divider}></div>
      </div>
      <div className={styles.section5}>
        <img src="/images/product_detail_icon.png" className={styles.product_detail_icon} alt="House Kari" />
        <img src="/images/product_detail_icon_2.png" className={styles.product_detail_icon_2} alt="House Kari" />
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
 
export default ProductDetails;