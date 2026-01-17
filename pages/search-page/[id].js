import { useEffect, useState } from 'react';
import Head from 'next/head';
import banner from '@/styles/Banner.module.css'
import axios from 'axios';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '@/styles/Search.module.css'
import SlideArticles from '../components/slide_articles';
import SlideArticlesMobile from '../components/slide_articles_mobile';
import SlideArticlesSecond from '../components/slide_articles_second';
import SlideArticlesSecondMobile from '../components/slide_articles_second_mobile';
import Link from 'next/link';

export async function getServerSideProps({ params, locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      id: params.id,
    },
  };
}

export default function SearchPage({ id }) {
  const [results, setResults] = useState({ articles: [], products: [], reseps: [] });
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation('common');

  const secondColor = 'creamColor';
  const paginationStyle = 'old_red_color';

  const stripPTags = (html) => {
    if (typeof html === 'string') {
      return html.replace(/<p[^>]*>|<\/p>/g, '');
    } else {
      return html;
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

  useEffect(() => {
    if (id) {
      const fetchResults = async () => {
        try {
          const response = await axios.get(`/api/search/${id}`);
          setResults(response.data.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }
  }, [id]);

  const getProductName = (product) => {
    switch (i18n.language) {
      case 'en':
        return product.name_en || product.name;
      case 'zh':
        return product.name_chi || product.name;
      default:
        return product.name;
    }
  };

  const getArticleName = (detail) => {
    switch (i18n.language) {
        case 'en':
            return detail.title_en || detail.title;
        case 'zh':
            return detail.title_chi || detail.title;
        default:
            return detail.title;
    }
};

  function stripH1Tags(str) {
    if (typeof str !== 'string') {
        console.error('Expected a string but got:', typeof str);
        return ''; // Return an empty string if input is not a string
    }

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

  const pageTitle = `House Kari | Search`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Learn more about us" />
      </Head>
      <div className={banner.bannerStyle}>
        <img src="/images/company_profile_banner.png" alt="House Kari Website"/>
      </div>
      <div className={banner.breadcrumbs}>
        <p>{t('menu.home')} / Search / <span>{id}</span></p>
      </div>
      {loading ? (
        <div>
          <Skeleton count={3} height={40} />
          <Skeleton count={5} height={100} style={{ marginTop: 10 }} />
        </div>
      ) : (
        <div>
          {results.articles.length > 0 ? (
            <div className={styles.section5}>
              <div className={styles.space_between_heading}>
                <h1 className={styles.heading_main_red}>{t('headingArticlesSearch')}  “{id}”</h1>
              </div>
              <SlideArticlesSecond
                classNames={secondColor}
                paginationClass={paginationStyle}
                items={results.articles.slice(0, 13).map(detail => ({
                  ...detail,
                  title: stripH1Tags(getArticleName(detail)),
                }))}
              />
              <SlideArticlesSecondMobile
                classNames={secondColor}
                paginationClass={paginationStyle}
                items={results.articles.slice(0, 13).map(detail => ({
                  ...detail,
                  title: stripH1Tags(getArticleName(detail)),
                }))}
              />
            </div>
          ) : (
            <div className={styles.not_found_second}>
              <h1>{t('noArticle')}</h1>
            </div>
          )}


            {results.products.length > 0 ? (
              <div className={styles.product_layout}>
                <div className={styles.divider}></div>
                <div className={styles.space_between_heading}>
                  <h1 className={styles.heading_main_white}>{t('productSearchHeading')} “{id}”</h1>
                </div>
                <div className={styles.product_search_layout}>
                  {results.products.map(product => (
                    <div key={product.id} className={`${styles.boxProduct} ${styles.boxProductWhite}`}>
                      <div className={styles.imageProduct}>
                        <img src={`https://prahwa.net/storage/${product.image}`} alt={product.name} />
                      </div>
                      <div className={styles.contentProduct}>
                        <h1>{getProductName(product)}</h1>
                        <span>{formatWeight(product.weight)}</span>
                        <Link href={`/product/[id]`} as={`/product/${product.id}`}><button>{t('section1Home.learnMore')}</button></Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.not_found}>
                <h1>{t('noProducts')}</h1>
              </div>
            )}
          {results.reseps.length > 0 ? (
          <div className={styles.section5}>
            <img src="/images/product_detail_icon.png" className={styles.product_detail_icon} alt="House Kari" />
            <img src="/images/product_detail_icon_2.png" className={styles.product_detail_icon_2} alt="House Kari" />
            <div className={styles.space_between_heading}>
              <h1 className={styles.heading_main_red}>{t('headingRecipeSearch')} “{id}”</h1>
            </div>
            <SlideArticles classNames={secondColor} paginationClass={paginationStyle} items={results.reseps.slice(0, 13).map(recipe => ({
              ...recipe,
              title: stripH1Tags(getRecipeTitle(recipe)),
            }))} />
            <SlideArticlesMobile classNames={secondColor} paginationClass={paginationStyle} items={results.reseps.slice(0, 13).map(recipe => ({
              ...recipe,
              title: stripH1Tags(getRecipeTitle(recipe)),
            }))} />
          </div>
          ) : (
            <div className={styles.not_found_second}>
              <h1>{t('noRecipe')}</h1>
            </div>
          )}
        </div>
      )}
    </>
  );
}
