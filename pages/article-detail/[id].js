import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import banner from '@/styles/Banner.module.css';
import Head from 'next/head';
import axios from 'axios';
import styles from '@/styles/Article.module.css';
import SlideArticlesSecond from "../components/slide_articles_second";
import SlideArticlesSecondMobile from "../components/slide_articles_second_mobile";

const API_RECIPE_DETAIL_URL = process.env.NEXT_PUBLIC_API_ARTICLE_DETAIL_PAGE_URL || '/api/article-detail';

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

export default function ArticleDetail({ recipe }) {
    const { t, i18n } = useTranslation('common');
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState(recipe?.data || null);
    const [articlesSlide, setArticlesSlide] = useState([]);

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
        const fetchArticle = async () => {
            if (!recipe && id) {
                try {
                    const response = await axios.get(`${API_RECIPE_DETAIL_URL}/${id}`);
                    setDetail(response.data.data);
                    setLoading(false);
                    console.log('Fetched product:', response.data.data);
                } catch (error) {
                    console.error('Error fetching product:', error);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id, recipe]);

    if (router.isFallback || loading) {
        return <div className="loading_interface">
        <img src="/images/loading_image.png"/>
      </div>;
    }

    if (!detail) {
        return <p>Product not found</p>;
    }

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

    const getProductCategory = (detail) => {
        switch (i18n.language) {
            case 'en':
                return detail.category.name_en || detail.category.name;
            case 'zh':
                return detail.category.name_chi || detail.category.name;
            default:
                return detail.category.name;
        }
    };

    const getProductDesc = (detail) => {
        switch (i18n.language) {
            case 'en':
                return detail.text_en || detail.text;
            case 'zh':
                return detail.text_chi || detail.text;
            default:
                return detail.text;
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
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('id-ID', options);
        return formattedDate.replace(/\b(\w)/g, char => char.toUpperCase());
    };

    const modifyImageURLs = (html) => {
        const imgRegex = /<img\s+([^>]*src=['"]([^'"]+)['"][^>]*)>/gi;
        return html.replace(imgRegex, (match, p1, p2) => {
            const newSrc = `https://prahwa.net/storage/${p2}`;
            return match.replace(p2, newSrc);
        });
    };

    const pageTitle = detail ? `House Kari | ${stripH1Tags(getProductName(detail), 'h1')}` : 'House Kari';

    const formattedMeta = `POSTED BY : ${detail.penulis} / ON : ${formatDate(detail.date)} / IN : ${getProductCategory(detail)}`;

    const stripPTags = (html) => {
        if (typeof html === 'string') {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          return tempDiv.textContent || tempDiv.innerText || '';
        } else {
          return '';
        }
      };

    const modifiedContent = modifyImageURLs(getProductDesc(detail));

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content="Learn more about us" />
            </Head>
            <div className={banner.bannerStyle}>
                <img src="/images/recipe_banner.png" alt="House Kari Website" />
            </div> 
            <div className={banner.breadcrumbs}>
                <p>{t('menu.home')} / {t('menu.article')} / <span>{stripH1Tags(getProductName(detail), 'h1')}</span></p>
            </div>
            <div className={styles.sectionDetail}>
                <img src="/images/article_detail_icon_2.png" alt="House Kari" className={styles.article_detail_icon_2} />
                <div className={styles.sectionDetail_image}>
                    <img src={`https://prahwa.net/storage/${detail.image}`} alt={detail.name} />
                </div>
                <h1>{stripH1Tags(getProductName(detail), 'h1')}</h1>
                <h5 className={styles.articleDate}>{t('postedBy')} {detail.penulis} / {t('on')} {formatDate(detail.date)} / {t('in')} {(getProductCategory(detail))}</h5>
                <div className={styles.sectionDetail_content}>
                    <div dangerouslySetInnerHTML={{ __html: modifiedContent }}></div>
                </div> 
            </div>
            <div className={styles.sectionSlide}>
                <div className={styles.space_between_heading}>
                    <h1 className={styles.heading_main_white}>{t('otherRecipeList')}</h1>
                </div>
                <SlideArticlesSecond items={articlesSlide.map(detail => ({
                ...detail,
                    title: stripH1Tags(getProductName(detail)),
                }))} />
                <SlideArticlesSecondMobile items={articlesSlide.map(detail => ({
                    ...detail,
                    title: stripH1Tags(getProductName(detail)),
                }))} /> 
            </div>  
        </>
    );
}
