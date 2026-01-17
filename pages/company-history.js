import Head from "next/head";
import styles from '@/styles/CompanyHistory.module.css'
import banner from '@/styles/Banner.module.css'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; 

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function CompanyHistory() {
  const { t } = useTranslation('common');
  const pageTitle = `House Kari | ${t('menu.companyHistory')}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title> 
        <meta name="description" content="Learn more about us" />
      </Head>
      <div className={banner.bannerStyle}>
        <img src="/images/company_history_banner.png" alt="House Kari Website"/> 
      </div>
      <div className={banner.breadcrumbs}>
        <p>{t('menu.home')}  / {t('menu.ourStory')} / <span>{t('menu.companyHistory')}</span></p>
      </div>
      <div className={styles.bg_history}>
        <div className={styles.divider}></div>
        <img src="/images/pattern_history.png" alt="House Kari" className={styles.pattern_history} />
        <div className={styles.section1}>
          <div className={styles.section1_image}>
            <img src="/images/history_1.png" alt="House Kari"/>
          </div>
          <div className={styles.section1_content}>
            <h1 className={styles.historyHeading}>{t('history.periodeTaisho')}</h1>
            <h3 className={styles.historySubHeading}>{t('history.budayaMakanan')}</h3>
            <p className={styles.historyDesc}>{t('history.zamanTaisho')}</p>
          </div>
        </div>
        <div className={styles.section_history}>
          <img src="/images/history_border.png" alt="House Kaei" className={styles.history_border}/>
          <div className={styles.section_history_box_left}>
            <div className={styles.history_content_right}>
              <div className={styles.history_circle}>
                <div className={styles.history_circle_in}></div>
              </div>
              <h1 className={styles.historyHeading}>{t('history.1913')}</h1>
              <h3 className={styles.historySubHeading}>{t('history.tahunKe2')}</h3>
              <img src="/images/history_2.png" alt="House Kari" className={styles.image_history_mobile}/>
              <p className={styles.historyDesc}>{t('history.descTahunKe2')}</p>
            </div>
          </div>
          <div className={styles.section_history_box_right}>
            <img src="/images/history_2.png" alt="House Kari"/>
          </div>
        </div>
        <div className={styles.section_history}>
          <img src="/images/history_border.png" alt="House Kaei" className={styles.history_border}/>
          <div className={styles.section_history_box_left}>
            <img src="/images/history_3.png" alt="House Kari"/>
          </div>
          <div className={styles.section_history_box_right}>
            <div className={styles.history_content}>
              <div className={styles.history_circle_right}>
                <div className={styles.history_circle_in}></div>
              </div>
              <h1 className={styles.historyHeading}>{t('history.1913')}</h1>
              <h3 className={styles.historySubHeading}>{t('history.tahunKe2')}</h3>
              <img src="/images/history_3.png" alt="House Kari" className={styles.image_history_mobile}/>
              <p className={styles.historyDesc}>{t('history.descTahunKe2')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bg_history_second}>
        <div className={styles.divider}></div>
        <img src="/images/history_border_left.png" alt="House Kari" className={styles.history_border_left} />
        <img src="/images/history_border_right.png" alt="House Kari" className={styles.history_border_right} />
        <img src="/images/history_icon_1.png" alt="House Kari" className={styles.history_icon_1} />
        <img src="/images/history_icon_2.png" alt="House Kari" className={styles.history_icon_2} />
        <div className={styles.section1}>
          <img src="/images/history_border.png" alt="House Kaei" className={`${styles.history_border} ${styles.history_border_mobile}`}/>
          <div className={styles.section1_image}>
            <img src="/images/history_4.png" alt="House Kari"/>
          </div>
          <div className={styles.section1_content}>
            <h1 className={`${styles.historyHeading} ${styles.historyHeadingWhite}`}>{t('history.periodeShowa')}</h1>
            <h3 className={`${styles.historySubHeading} ${styles.historySubHeadingWhite}`}>{t('history.budayaLayanan')}</h3>
            <p className={`${styles.historyDesc} ${styles.historyDescWhite}`}>{t('history.descBudayaLayanan')}</p>
          </div>
        </div>
        <div className={styles.section_history}>
          <img src="/images/history_border.png" alt="House Kaei" className={styles.history_border}/>
          <div className={styles.section_history_box_left}>
            <div className={styles.history_content_right}>
              <div className={`${styles.history_circle} ${styles.history_circle_white}`}>
                <div className={`${styles.history_circle_in} ${styles.history_circle_in_white}`}></div>
              </div>
              <h1 className={`${styles.historyHeading} ${styles.historyHeadingWhite}`}>{t('history.1928')}</h1>
              <h3 className={`${styles.historySubHeading} ${styles.historySubHeadingWhite}`}>{t('history.tahunke3')}</h3>
              <img src="/images/history_5.png" alt="House Kari" className={styles.image_history_mobile}/>
              <p className={`${styles.historyDesc} ${styles.historyDescWhite}`}>{t('history.descTahunKe3')}</p>
            </div>
            <div className={styles.history_content_right}>
              <div className={`${styles.history_circle} ${styles.history_circle_white}`}>
                <div className={`${styles.history_circle_in} ${styles.history_circle_in_white}`}></div>
              </div>
              <h1 className={`${styles.historyHeading} ${styles.historyHeadingWhite}`}>{t('history.1947')}</h1>
              <p className={`${styles.historyDesc} ${styles.historyDescWhite}`}>{t('history.desc2TahunKe3')}</p>
            </div>
            <div className={styles.history_content_right}>
              <div className={`${styles.history_circle} ${styles.history_circle_white}`}>
                <div className={`${styles.history_circle_in} ${styles.history_circle_in_white}`}></div>
              </div>
              <h1 className={`${styles.historyHeading} ${styles.historyHeadingWhite}`}>{t('history.1949')}</h1>
              <p className={`${styles.historyDesc} ${styles.historyDescWhite}`}>{t('history.desc3TahunKe3')}</p>
            </div>
          </div>
          <div className={styles.section_history_box_right}>
            <img src="/images/history_5.png" alt="House Kari"/>
          </div>
        </div>
        <div className={styles.section_history}>
          <img src="/images/history_border.png" alt="House Kaei" className={styles.history_border}/>
          <div className={styles.section_history_box_left}>
            <img src="/images/history_6.png" alt="House Kari"/>
          </div>
          <div className={styles.section_history_box_right}>
            <div className={styles.history_content}>
              <div className={`${styles.history_circle_right} ${styles.history_circle_white}`}>
                <div className={`${styles.history_circle_in} ${styles.history_circle_in_white}`}></div>
              </div>
              <h1 className={`${styles.historyHeading} ${styles.historyHeadingWhite}`}>{t('history.1952')}</h1>
              <h3 className={`${styles.historySubHeading} ${styles.historySubHeadingWhite}`}>{t('history.heading1952')}</h3>
              <img src="/images/history_6.png" alt="House Kari" className={styles.image_history_mobile}/>
              <p className={`${styles.historyDesc} ${styles.historyDescWhite}`}>{t('history.desc1952')}</p>
            </div>
          </div>
        </div>
        <div className={styles.section_history}>
          <img src="/images/history_border.png" alt="House Kaei" className={styles.history_border}/>
          <div className={styles.section_history_box_left}>
            <div className={styles.history_content_right}>
              <div className={`${styles.history_circle} ${styles.history_circle_white}`}>
                <div className={`${styles.history_circle_in} ${styles.history_circle_in_white}`}></div>
              </div>
              <h1 className={`${styles.historyHeading} ${styles.historyHeadingWhite}`}>{t('history.1959')}</h1>
              <img src="/images/history_7.png" alt="House Kari" className={styles.image_history_mobile}/>
              <p className={`${styles.historyDesc} ${styles.historyDescWhite}`}>{t('history.desc1959')}</p>
              
            </div>
            <div className={styles.history_content_right}>
              <div className={`${styles.history_circle} ${styles.history_circle_white}`}>
                <div className={`${styles.history_circle_in} ${styles.history_circle_in_white}`}></div>
              </div>
              <h1 className={`${styles.historyHeading} ${styles.historyHeadingWhite}`}>{t('history.1960')}</h1>
              <p className={`${styles.historyDesc} ${styles.historyDescWhite}`}>{t('history.desc1960')}</p>
            </div>
          </div>
          <div className={styles.section_history_box_right}>
            <img src="/images/history_7.png" alt="House Kari"/>
          </div>
        </div>
        <div className={styles.section_history}>
          <img src="/images/history_border.png" alt="House Kaei" className={styles.history_border}/>
          <div className={styles.section_history_box_left}>
            <img src="/images/history_8.png" alt="House Kari"/>
          </div>
          <div className={styles.section_history_box_right}>
            <div className={styles.history_content}>
              <div className={`${styles.history_circle_right} ${styles.history_circle_white}`}>
                <div className={`${styles.history_circle_in} ${styles.history_circle_in_white}`}></div>
              </div>
              <h1 className={`${styles.historyHeading} ${styles.historyHeadingWhite}`}>{t('history.1963')}</h1>
              <h3 className={`${styles.historySubHeading} ${styles.historySubHeadingWhite}`}>{t('history.heading1963')}</h3>
              <img src="/images/history_8.png" alt="House Kari" className={styles.image_history_mobile}/>
              <p className={`${styles.historyDesc} ${styles.historyDescWhite}`}>{t('history.desc1963')}</p>
            </div>
            <div className={styles.history_content}>
              <div className={`${styles.history_circle_right} ${styles.history_circle_white}`}>
                <div className={`${styles.history_circle_in} ${styles.history_circle_in_white}`}></div>
              </div>
              <h1 className={`${styles.historyHeading} ${styles.historyHeadingWhite}`}>{t('history.1968')}</h1>
              <p className={`${styles.historyDesc} ${styles.historyDescWhite}`}>{t('history.desc1968')}</p>
            </div>
          </div>
        </div>
        <div className={styles.section_history}>
          <img src="/images/history_border.png" alt="House Kaei" className={styles.history_border}/>
          <div className={styles.section_history_box_left}>
            <div className={styles.history_content_right}>
              <div className={`${styles.history_circle} ${styles.history_circle_white}`}>
                <div className={`${styles.history_circle_in} ${styles.history_circle_in_white}`}></div>
              </div>
              <h1 className={`${styles.historyHeading} ${styles.historyHeadingWhite}`}>{t('history.1971')}</h1>
              <h3 className={`${styles.historySubHeading} ${styles.historySubHeadingWhite}`}>{t('history.heading1971')}</h3>
              <img src="/images/history_9.png" alt="House Kari" className={styles.image_history_mobile}/>
              <p className={`${styles.historyDesc} ${styles.historyDescWhite}`}>{t('history.desc1971')}</p>
            </div>
          </div>
          <div className={styles.section_history_box_right}>
            <img src="/images/history_9.png" alt="House Kari"/>
          </div>
        </div>
      </div>
      <div className={styles.bg_history_third}>
        <img src="/images/history_icon_3.png" alt="House Kari" className={styles.history_icon_3} />
        <img src="/images/history_icon_4.png" alt="House Kari" className={styles.history_icon_4} />
        <img src="/images/pattern_center.png" alt="House Kari" className={styles.pattern_center_history} />
        <div className={styles.section1}>
          <img src="/images/history_border.png" alt="House Kaei" className={`${styles.history_border} ${styles.history_border_mobile}`}/>
          <div className={styles.section1_image}>
            <img src="/images/history_10.png" alt="House Kari"/>
          </div>
          <div className={styles.section1_content}>
            <h1 className={`${styles.historyHeading}`}>{t('history.2007')}</h1>
            <h3 className={`${styles.historySubHeading}`}>{t('history.heading2007')}</h3>
            <p className={`${styles.historyDesc}`}>{t('history.desc2007')}</p>
          </div>
        </div>
        <div className={styles.section_history}>
          <img src="/images/history_border.png" alt="House Kaei" className={styles.history_border}/>
          <div className={styles.section_history_box_left}>
            <div className={styles.history_content_right}>
              <div className={styles.history_circle}>
                <div className={styles.history_circle_in}></div>
              </div>
              <h1 className={styles.historyHeading}>{t('history.2011')}</h1>
              <h3 className={styles.historySubHeading}>{t('history.heading2011')}</h3>
              <img src="/images/history_11.png" alt="House Kari" className={styles.image_history_mobile}/>
              <p className={styles.historyDesc}>{t('history.desc2011')}</p>
            </div>
          </div>
          <div className={styles.section_history_box_right}>
            <img src="/images/history_11.png" alt="House Kari"/>
          </div>
        </div>
        <div className={styles.section_history}>
          <img src="/images/history_border.png" alt="House Kaei" className={styles.history_border}/>
          <div className={styles.section_history_box_left}>
            <img src="/images/history_12.png" alt="House Kari"/>
          </div>
          <div className={styles.section_history_box_right}>
            <div className={styles.history_content}>
              <div className={styles.history_circle_right}>
                <div className={styles.history_circle_in}></div>
              </div>
              <h1 className={styles.historyHeading}>{t('history.2013')}</h1>
              <h3 className={styles.historySubHeading}>{t('history.heading2013')}</h3>
              <img src="/images/history_9.png" alt="House Kari" className={styles.image_history_mobile}/>
              <p className={styles.historyDesc}>{t('history.desc1963')}</p>
            </div>
          </div>
        </div>
        <div className={styles.section_history}>
          <img src="/images/history_border.png" alt="House Kaei" className={styles.history_border}/>
          <div className={styles.section_history_box_left}>
            <div className={styles.history_content_right}>
              <div className={styles.history_circle}>
                <div className={styles.history_circle_in}></div>
              </div>
              <h1 className={styles.historyHeading}>{t('history.2016')}</h1>
              <img src="/images/history_13.png" alt="House Kari" className={styles.image_history_mobile}/>
              <p className={styles.historyDesc}>{t('history.desc2016')}</p>
            </div>
          </div>
          <div className={styles.section_history_box_right}>
            <img src="/images/history_13.png" alt="House Kari"/>
          </div>
        </div>
        <div className={styles.section_history}>
          <img src="/images/history_border.png" alt="House Kaei" className={styles.history_border}/>
          <div className={styles.section_history_box_left}>
            <img src="/images/history_14.png" alt="House Kari"/>
          </div>
          <div className={styles.section_history_box_right}>
            <div className={styles.history_content}>
              <div className={styles.history_circle_right}>
                <div className={styles.history_circle_in}></div>
              </div>
              <h1 className={styles.historyHeading}>{t('history.2019')}</h1>
              <img src="/images/history_14.png" alt="House Kari" className={styles.image_history_mobile}/>
              <p className={styles.historyDesc}>{t('history.desc2019')}</p>
            </div>
          </div>
        </div>
        <div className={styles.section_history}>
          <div className={styles.section_history_box_left}>
            <div className={styles.history_content_right}>
              <div className={styles.history_circle}>
                <div className={styles.history_circle_in}></div>
              </div>
              <h1 className={styles.historyHeading}>{t('history.2020')}</h1>
              <img src="/images/history_15.png" alt="House Kari" className={styles.image_history_mobile}/>
              <p className={styles.historyDesc}>{t('history.desc2020')}</p>
            </div>
          </div>
          <div className={styles.section_history_box_right}>
            <img src="/images/history_15.png" alt="House Kari"/>
          </div>
        </div>
      </div>
    </>
  );
}
