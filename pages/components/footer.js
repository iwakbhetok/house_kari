import styles from '@/styles/Footer.module.css';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTiktok, FaLinkedin, FaYoutube } from "react-icons/fa";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; 
import axios from 'axios';
import { useState, useEffect } from 'react';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

const Footer = () => { 
  const { t } = useTranslation('common');
  const [themeHeader, setThemeHeader] = useState ([]);
  const [address, setAddress] = useState ([]);
  const [loading, setLoading] = useState(true);
  const [socialMedia, setSocialMedia] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/theme-image`);
        const data = await response.json();
        if (data && data.data && data.data.footer) {
          setThemeHeader(data.data.footer);
          console.log('Header image:', data.data.footer);
        } else {
          setThemeHeader(null); // Ensure themeHeader is null if no valid data
        }
      } catch (error) {
        console.error('Error fetching header image:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(`/api/address`);
        const data = await response.json();
        if (data && data.data) {
          setAddress(data.data);
        } else {
          console.error('Invalid response data format:', data);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };
  
    fetchAddress();
  }, []);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await fetch(`/api/social-media`);
        const data = await response.json();
        if (data && data.data) {
          setSocialMedia(data.data);
        } else {
          console.error('Invalid response data format:', data);
        }
      } catch (error) {
        console.error('Error fetching social media:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchSocialMedia();
  }, []);

  return (
    <>
    <footer className={styles.footer}>
      <div className={styles.identity}>
        <img src='/images/logo.png' alt='House Kari Logo' /> 
        <div className={styles.identity_layout}>
          <h1>PT HOUSE AND VOX INDONESIA</h1>
          <p>{address.address}</p>
          <Link href='/privacy-policy'>{t('privacyPolicy')}</Link>
        </div>
      </div>
      <div className={styles.social_footer}>
      {socialMedia.length > 0 ? (
        socialMedia.map((socialmedia, index) => (
          <Link 
            key={index} // Menambahkan key untuk setiap elemen
            href={socialmedia.link} 
            target='_blank' // Menggunakan '_blank' untuk membuka link di tab baru
            rel='noopener noreferrer' // Menambahkan rel untuk keamanan
          >
            <img 
              src={`https://prahwa.net/storage/${socialmedia.image}`} 
              alt={`Social media icon for ${socialmedia.name}`} // Menambahkan alt text
              className={styles.socialMediaIcon} // Menambahkan kelas jika diperlukan
            />
          </Link>
        ))
      ) : (
        <p>No social media links available.</p> // Menampilkan pesan jika tidak ada data
      )}
      </div>
      <div className={styles.img_footer}>
      {themeHeader ? (
        <img
          src={`https://prahwa.net/storage/${themeHeader}`}
          className="img_footer"
          alt="Theme Header"
        />
      ) : (
        // Show the fallback image if themeHeader is null
        <img
          src="/images/footer_img_product.png"
          className="img_footer"
          alt="Fallback"
        />
      )}
      </div>
    </footer>
    <div className={styles.copyright}>
      <span>{t('copyright')}</span>
    </div>
    </>
  );
};

export default Footer;
