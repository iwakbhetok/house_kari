import Head from "next/head";
import styles from '@/styles/Contact.module.css'
import banner from '@/styles/Banner.module.css'
import { LuPhoneCall } from "react-icons/lu";
import { RxEnvelopeClosed } from "react-icons/rx";
import { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; 
import axios from "axios";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function Contact() {
  const { t } = useTranslation('common');

  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    inquiries: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/postForm', formData);
      setMessage('Form submitted successfully!');
      console.log(response.data)
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Failed to submit form');
    } finally {
      // Set loading state to false after request is completed
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOption1, setSelectedOption1] = useState(`${t('choose')}...`);
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [selectedOption2, setSelectedOption2] = useState(`${t('choose')}...`);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [selectedOption3, setSelectedOption3] = useState(`${t('choose')}...`);
  const [isDropdownOpen3, setIsDropdownOpen3] = useState(false);

  const handleSelect = (setSelectedOption, setIsDropdownOpen, option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleSubmitPartner = async (e) => {
    e.preventDefault();
  
    // Prepare form data
    const formData = {
      email,
      company_name: companyName,
      company_address: companyAddress,
      name,
      phone_number: phoneNumber,
      company_type: selectedOption1,
      found_housekari_form: selectedOption2,
      reason_to_become_reseller: selectedOption3,
    };
  
    // Set loading state to true
    setIsSubmitting(true);
  
    try {
      const response = await fetch('/api/postPartner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        // Handle success
        setMessage('Form submitted successfully!');
        // Optionally, you can clear the form fields here
      } else {
        // Handle error
        setMessage('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('An error occurred. Please try again later.');
    } finally {
      // Set loading state to false after request is completed
      setIsSubmitting(false);
    }
  };

  const pageTitle = `House Kari | ${t('menu.contact')}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Learn more about us" /> 
      </Head>
      <div className={banner.bannerStyle}>
          <img src="/images/banner_contact.png" alt="House Kari Website"/>
      </div>
      <div className={banner.breadcrumbs}>
          <p>{t('menu.home')} / <span>{t('menu.contact')}</span></p>
      </div>
      <div className={styles.section1}>
        <div className={styles.divider}></div>
        <div className={styles.maps}>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.378564532631!2d106.814869375868!3d-6.213702560864358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f40184a6f121%3A0x46d7568ff13f0ab9!2sPT%20HOUSE%20AND%20VOX%20INDONESIA!5e0!3m2!1sen!2sid!4v1719396203076!5m2!1sen!2sid" allowfullscreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <div className={styles.section1_layout}>
          <img src="/images/contact_icon.png" alt="House Kari" className={styles.contact_icon}/>
          <div className={styles.section1_form}>
            <h1>{t('contactUs')}</h1>
            <form onSubmit={handleSubmit}>
              <div className={styles.form_field_double}>
                <div className={styles.form_field}>
                  <label>{t('nameForm')}</label>
                  <input type="text" name="name" placeholder={t('nameForm')} onChange={handleInputChange} required />
                </div>
                <div className={styles.form_field}>
                  <label>{t('numberForm')}</label>
                  <input type="number" name="phone_number" placeholder={t('numberForm')} onChange={handleInputChange} required />
                </div>
              </div>
              <div className={styles.form_field}>
                <label>{t('emailForm')}</label>
                <input type="email" name="email" placeholder={t('emailForm')} onChange={handleInputChange} required />
              </div>
              <div className={styles.form_field}>
                <label>{t('inquiriesForm')}</label>
                <textarea name="inquiries" placeholder={t('inquiriesForm')} onChange={handleInputChange} required></textarea>
              </div>
              <label className={styles.customCheckbox}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className={styles.hiddenCheckbox}
                />
                <span className={styles.customCheckmark}></span>
                {t('haveAgree')}
              </label>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Loading...' : t('submitBtn')}
              </button>
              {message && <p className={styles.notifPost}>{message}</p>}
            </form>
          </div>
          <div className={styles.addressDetail}>
            <h3>PT HOUSE AND VOX INDONESIA</h3>
            <p>{t('address')}</p>
          </div>
          <div className={styles.contact_detail}>
            <h3>{t('menu.contact')}</h3>
            <div className={styles.contact_layout}>
              <div className={styles.contact_box}>
                  <LuPhoneCall/>
                  <h5>(+6221) 5745854</h5>
              </div>
              <div className={styles.contact_box}>
                  <RxEnvelopeClosed/>
                  <h5>info@housefoods.co.id</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section2}>
        <div className={styles.section2_layout}>
          <img src="/images/contact_icon_2.png" alt="House Kari" className={styles.contact_icon_2}/>
          <div className={`${styles.section1_form} ${styles.section1_form_second}`}>
            <h1>{t('bePartner')}</h1>
            <form onSubmit={handleSubmitPartner}>
              <div className={styles.form_field}>
                <label>{t('emailForm')}</label>
                <input
                  type="email"
                  placeholder={t('emailForm')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.form_field}>
                <label>{t('companyName')}</label>
                <input
                  type="text"
                  placeholder={t('companyName')}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.form_field}>
                <label>{t('nameForm')}</label>
                <input
                  type="text"
                  placeholder={t('nameForm')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.form_field}>
                <label>{t('numberForm')}</label>
                <input
                  type="tel"
                  placeholder={t('numberForm')}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className={styles.form_field}>
                <label>{t('choose')}...</label>
                <div className={styles.custom_select}>
                  <div
                    className={`${styles.select_value} ${isDropdownOpen1 ? styles.active : ''}`}
                    onClick={() => setIsDropdownOpen1(!isDropdownOpen1)}
                  >
                    {selectedOption1} <IoChevronDownOutline />
                  </div>
                  <div className={`${styles.options} ${isDropdownOpen1 ? styles.active : ''}`}>
                    {[t('tradingCompany'), t('onlineShop'), t('offlineDistributor'), 'HORECA'].map((option) => (
                      <div
                        key={option}
                        className={`${styles.option} ${selectedOption1 === option ? styles.activeOption : ''}`}
                        onClick={() => handleSelect(setSelectedOption1, setIsDropdownOpen1, option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.form_field}>
                <label>{t('companyAddress')}</label>
                <input
                  type="text"
                  placeholder={t('companyAddress')}
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  required
                />
              </div>

              <div className={styles.form_field}>
                <label>{t('howDo')}</label>
                <div className={styles.custom_select}>
                  <div
                    className={`${styles.select_value} ${isDropdownOpen2 ? styles.active : ''}`}
                    onClick={() => setIsDropdownOpen2(!isDropdownOpen2)}
                  >
                    {selectedOption2} <IoChevronDownOutline />
                  </div>
                  <div className={`${styles.options} ${isDropdownOpen2 ? styles.active : ''}`}>
                    {[t('onlineAdvertising'), t('offlineAdvertising'), t('supermarket'), t('ecommerce'), t('rekan'), t('other')].map((option) => (
                      <div
                        key={option}
                        className={`${styles.option} ${selectedOption2 === option ? styles.activeOption : ''}`}
                        onClick={() => handleSelect(setSelectedOption2, setIsDropdownOpen2, option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.form_field}>
                <label>{t('whyAre')}</label>
                <div className={styles.custom_select}>
                  <div
                    className={`${styles.select_value} ${isDropdownOpen3 ? styles.active : ''}`}
                    onClick={() => setIsDropdownOpen3(!isDropdownOpen3)}
                  >
                    <span>{selectedOption3}</span> <IoChevronDownOutline />
                  </div>
                  <div className={`${styles.options} ${isDropdownOpen3 ? styles.active : ''}`}>
                    {[t('whyAre1'), t('whyAre2'), t('whyAre3'), t('whyAre4')].map((option) => (
                      <div
                        key={option}
                        className={`${styles.option} ${selectedOption3 === option ? styles.activeOption : ''}`}
                        onClick={() => handleSelect(setSelectedOption3, setIsDropdownOpen3, option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Loading...' : t('submitBtn')}
              </button>
              {message && <p className={styles.notifPost}>{message}</p>}
            </form>
          </div>
        </div>
        <div className={styles.section2_image}>
          <img src="/images/partner_image.png" alt="House Kari"/>
        </div>
      </div>
    </>
  );
}
