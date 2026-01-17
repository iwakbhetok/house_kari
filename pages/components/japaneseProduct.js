// components/JapaneseProduct.js
import Link from 'next/link';
import styles from '@/styles/Product.module.css';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; 

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

const JapaneseProduct = () => {
  const { t } = useTranslation('common');

    const productItems = [
        {
          id: 1,
          imageProduct: '/images/slide_product_1_box.png',
          headingProduct: 'Original Japanese Curry',
          weight: '935g',
        },
        {
          id: 2,
          imageProduct: '/images/slide_product_2_box.png',
          headingProduct: 'Spicy Japanese Curry',
          weight: '935g',
        },
        {
          id: 3,
          imageProduct: '/images/slide_product_2_box.png',
          headingProduct: 'Spicy Japanese Curry',
          weight: '935g',
        },
        {
          id: 4,
          imageProduct: '/images/slide_product_1_box.png',
          headingProduct: 'Original Japanese Curry',
          weight: '935g',
        },
        {
          id: 5,
          imageProduct: '/images/slide_product_2_box.png',
          headingProduct: 'Spicy Japanese Curry',
          weight: '935g',
        },
        {
          id: 6,
          imageProduct: '/images/slide_product_2_box.png',
          headingProduct: 'Spicy Japanese Curry',
          weight: '935g',
        }
      ]

  return (
    <>
    <div className={styles.productLayout}>
      {productItems.map((product, index) => (
        <div className={styles.boxProduct} key={index}>
            <div className={styles.imageProduct}>
                <img src={product.imageProduct} alt={product.headingProduct} />
            </div>
            <div className={styles.contentProduct}>
                <h1>{product.headingProduct}</h1>
                <span>{product.weight}</span>
                <Link href={`/product/${product.id}`}><button>{t('section1Home.learnMore')}</button></Link>
            </div> 
        </div>
      ))}
    </div>
    </>
  );
};

export default JapaneseProduct;
