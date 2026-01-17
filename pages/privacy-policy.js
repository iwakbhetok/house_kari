import styles from '../styles/privacy.module.css'
import banner from '@/styles/Banner.module.css'
import Head from "next/head";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; 

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function PrivacyPolicy() {
    const { t } = useTranslation('common');
    const pageTitle = `House Kari | ${t('privacyPolicy')}`;
    return(
        <>
        <Head>
            <title>{pageTitle}</title> 
            <meta name="description" content="Learn more about us" />
        </Head>
        <div className={banner.bannerStyle}>
            <img src="/images/company_profile_banner.png" alt="House Kari Website"/> 
        </div>
        <div className={banner.breadcrumbs}>
            <p>{t('menu.home')}  /  <span>{t('privacyPolicy')}</span></p>
        </div>
        <div className={styles.privacy}>
            <h1>{t('privacyPolicy')}</h1>
            <ul>
                <li>{t('penggunaan')}
                    <ul>
                        <li>{t('teksPrivacy1')}</li>
                        <li>{t('teksPrivacy2')}</li>
                    </ul>
                </li>
                <li>
                    {t('pembatasan')}
                    <ul>
                        <li>{t('teksPrivacy3')}
                            <ul>
                                <li>{t('teksPrivacy4')}</li>
                                <li>{t('teksPrivacy5')}</li>
                                <li>{t('teksPrivacy6')}</li>
                                <li>{t('teksPrivacy7')}</li>
                                <li>{t('teksPrivacy8')}</li>
                                <li>{t('teksPrivacy9')}</li>
                                <li>{t('teksPrivacy10')}</li>
                                <li>{t('teksPrivacy11')}</li>
                            </ul>
                        </li>
                        <li>{t('teksPrivacy12')}</li>
                    </ul>
                </li>
                <li>{t('teksPrivacy13')}
                    <ul>
                        <li>{t('teksPrivacy14')}</li>
                        <li>{t('teksPrivacy15')}</li>
                        <li>{t('teksPrivacy16')}</li>
                        <li>{t('teksPrivacy17')}</li>
                    </ul>
                </li>
                <li>
                    {t('teksPrivacy18')}
                    <ul>
                        <li>{t('teksPrivacy19')}</li>
                        <li>{t('teksPrivacy20')}</li>
                        <li>{t('teksPrivacy21')}</li>
                    </ul>
                </li>
                <li>{t('teksPrivacy22')}
                    <ul>
                        <li>{t('teksPrivacy23')}</li>
                        <li>{t('teksPrivacy24')}</li>
                        <li>{t('teksPrivacy25')}</li>
                        <li>{t('teksPrivacy26')}</li>
                        <li>{t('teksPrivacy27')}</li>
                    </ul>
                </li>
                <li>{t('teksPrivacy28')}<br/>
                    <p>{t('teksPrivacy29')}</p>
                    <ul>
                            
                        <li>{t('teksPrivacy30')}</li>
                        <li>{t('teksPrivacy31')}</li>
                        <li>{t('teksPrivacy32')}</li>
                    </ul>
                </li>
                <li>{t('teksPrivacy33')} <br/> <p>{t('teksPrivacy34')}</p></li>
                <li>{t('teksPrivacy35')} <br/> <p>{t('teksPrivacy36')}</p>
                    <ul>
                        <li>{t('teksPrivacy37')}</li>
                        <li>{t('teksPrivacy38')}</li>
                    </ul>
                </li>
                <li>{t('teksPrivacy39')}
                    <ul>
                        <li>{t('teksPrivacy40')}</li>
                        <li>{t('teksPrivacy41')}</li>
                        <li>{t('teksPrivacy42')}</li>
                        <li>{t('teksPrivacy43')}</li>
                        <li>{t('teksPrivacy44')}</li>
                        <li>{t('teksPrivacy45')}</li>
                    </ul>
                </li>
                <li>{t('teksPrivacy46')} <br/>
                    <p>{t('teksPrivacy47')} <br/><br/>{t('teksPrivacy48')}  <br/><br/> 
                    {t('teksPrivacy49')}
                    </p>
                </li>
                <li>
                    {t('teksPrivacy50')} <br/> <p>{t('teksPrivacy51')} <br/><br/>{t('teksPrivacy52')} <br/>{t('phising')}  </p>
                </li>
            </ul>

            <ul className={styles.phising}>
                <li>{t('teksPrivacy53')}
                    <ul>
                        <li>{t('teksPrivacy54')}</li>
                        <li>{t('teksPrivacy55')}</li>
                    </ul>
                </li>
            </ul>

            <ul className={styles.kiat}>
                <li>{t('teksPrivacy56')}
                    <ul>
                        <li>{t('teksPrivacy57')}</li>
                        <li>{t('teksPrivacy58')}</li>
                        <li>{t('teksPrivacy59')} <br/> {t('teksPrivacy60')}</li>
                        <li>{t('teksPrivacy61')}
                            <ul>
                                <li>{t('teksPrivacy62')}</li>
                                <li>{t('teksPrivacy63')}</li>
                                <li>{t('teksPrivacy64')}</li>
                                <li>{t('teksPrivacy65')}</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>{t('teksPrivacy66')}
                    <ul>
                        <li>{t('teksPrivacy67')}</li>
                        <li>{t('teksPrivacy68')}</li>
                        <li>{t('teksPrivacy69')}</li>
                        <li>{t('teksPrivacy70')}</li>
                        <li>{t('teksPrivacy71')}</li>
                        <li>{t('teksPrivacy72')}</li>
                        <li>{t('teksPrivacy73')} <br/> 
                            <p>{t('teksPrivacy74')}</p>
                        </li>
                        <li>{t('teksPrivacy75')}</li>
                        <li>{t('teksPrivacy76')}</li>
                        <li>{t('teksPrivacy77')}
                            <ul>
                                <li>{t('teksPrivacy78')}</li>
                                <li>{t('teksPrivacy79')}</li>
                                <li>{t('teksPrivacy80')}</li>
                                <li>{t('teksPrivacy81')}</li>
                                <li>{t('teksPrivacy82')}</li>
                                <li>{t('teksPrivacy83')}</li>
                            </ul>
                        </li>
                        <li>{t('teksPrivacy84')}</li>
                        <li>{t('teksPrivacy85')}</li>
                        <li>{t('teksPrivacy86')}</li>
                    </ul>
                </li>
            </ul>

            <ul className={styles.kiat}>
                <li>
                    {t('teksPrivacy77')}
                    <ul>
                        <li>{t('teksPrivacy87')}</li>
                        <li>{t('teksPrivacy88')}</li>
                        <li>{t('teksPrivacy89')}</li>
                        <li>{t('teksPrivacy90')}</li>
                        <li>{t('teksPrivacy91')}</li>
                        <li>{t('teksPrivacy92')}</li>
                    </ul>
                </li>
            </ul>
        </div>
        </>
    )
}