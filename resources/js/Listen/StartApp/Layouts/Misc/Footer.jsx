import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useNavigate} from "react-router-dom";
import {usePopulerregion} from "../../../../ServerSide/Hooks/usePopulerregion";
import {useDispatch, useSelector} from "react-redux";
import {ROUTES} from "../../../../Libs/Routes/config";
import {useAttr} from "../../../../ServerSide/Hooks/useAttr";
import {setFilters} from "../../../../Repo/Redux/Modules/FilterSlice";
import { usePolicies } from "../../../../ServerSide/Hooks/usePolicies";


const Footer = () => {
    const dispatch = useDispatch();
    const {setPopulerregions} = usePopulerregion();
    const {setCategories} = useAttr();
    const regions = useSelector(state => state.home.populerregion.populerregions);
    const categories = useSelector(state => state.attr.categories);
    const navigate = useNavigate();
    const filters = useSelector(state => state.filter.filters);
    const { getPolicies } = usePolicies();
    const [policies, setPolicies] = useState([]);
    useEffect(() => {
        // Sayfa/layout değişiminde tekrar çekme
        if (regions?.length) return;

        const setPopulerRegion = async () => {
            try {
                const data = await setPopulerregions(); // burada da useUser içinden gelen fonksiyonu çağırıyoruz
            } catch (err) {

            }
        };

        setPopulerRegion();
    }, []);
    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const data = await getPolicies();
                setPolicies(data);
            } catch (error) {
                console.error("Politikalar getirilemedi:", error);
            }
        };
        fetchPolicies();
    }, []);
    const routeMap = {
        "gizlilik-sozlesmesi": ROUTES.UI.PRİVACY_AGREEMENTS,
        "iptal-sartlari": ROUTES.UI.CANCELLATİON_CONDİTİONS,
        "kiralama-sozlesmesi": ROUTES.UI.RENTAL_AGREEMENT,
        "kullanim-kosullari": ROUTES.UI.TERMS_OF_USE,
        "kvkk": ROUTES.UI.KVKK,
        "riza-metni": ROUTES.UI.CONSENT_TEXT,
    };


    useEffect(() => {
        if (categories?.length) return;

        const setCategorie = async () => {
            try {
                const data = await setCategories(); // burada da useUser içinden gelen fonksiyonu çağırıyoruz
            } catch (err) {

            }
        };

        setCategorie();
    }, []);

    const onClickPopularRegion = (e,region) => {
        e.preventDefault();
        try {
            const filterData = {
                ...filters,
                region:
                    {
                        id: region?.id,
                        name: region?.name,
                    }
            };
            dispatch(setFilters(filterData));
            localStorage.setItem('filters', JSON.stringify(filterData));
            navigate(`${ROUTES.UI.LISTING}`);
        }catch (error){
            console.log(error);
        }

    }
    const onClickCategory = (e,category) => {
        e.preventDefault();
        try {
            const filterData = {
                ...filters,
                attrs:
                    {
                        ...filters.attrs,
                        category: [category]
                    }
            };

            dispatch(setFilters(filterData));
            localStorage.setItem('filters', JSON.stringify(filterData));
            navigate(`${ROUTES.UI.LISTING}`);
        }catch (error){
            console.log(error);
        }

    }
    const {t} = useTranslation();
    const scrollToTop = () => window.scrollTo({top: 0, behavior: "auto"});
    return (<footer>
        <section className="footer">
            <div className="footer-top">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="section">
                        <div className="max-w-7xl mx-auto px-6 sm:px-8">
                            <div
                                className="flex flex-col lg:flex-row items-center justify-between gap-6 p-8 rounded-3xl shadow-lg bg-white">
                                <div
                                    className="grid grid-cols-3 gap-4 lg:flex lg:gap-4 justify-center social-links">
                                    <a href="https://instagram.com/" target="_blank">
                                        <div
                                            className={`bg-pink-500 w-12 h-12 flex items-center justify-center rounded-2xl text-white transition-all transform hover:scale-110 hover:brightness-110 shadow-lg hover:shadow-xl`}>
                                            <i className="icon instagram"></i>
                                        </div>
                                    </a>
                                    <a href="https://facebook.com/" target="_blank">
                                        <div
                                            className={`bg-blue-600 w-12 h-12 flex items-center justify-center rounded-2xl text-white transition-all transform hover:scale-110 hover:brightness-110 shadow-lg hover:shadow-xl`}>
                                            <i className="icon facebook"></i>
                                        </div>
                                    </a>
                                    <a href="https://youtube.com/@" target="_blank">
                                        <div
                                            className={`bg-red-500 w-12 h-12 flex items-center justify-center rounded-2xl text-white transition-all transform hover:scale-110 hover:brightness-110 shadow-lg hover:shadow-xl`}>
                                            <i className="icon youtube"></i>
                                        </div>
                                    </a>
                                    <a href="https://twitter.com/" target="_blank">
                                        <div
                                            className={`bg-black w-12 h-12 flex items-center justify-center rounded-2xl text-white transition-all transform hover:scale-110 hover:brightness-110 shadow-lg hover:shadow-xl`}>
                                            <i className="icon twitter"></i>
                                        </div>
                                    </a>
                                    <a href="https://tiktok.com/" target="_blank">
                                        <div
                                            className={`bg-gray-900 w-12 h-12 flex items-center justify-center rounded-2xl text-white transition-all transform hover:scale-110 hover:brightness-110 shadow-lg hover:shadow-xl`}>
                                            <i className="icon tiktok"></i>
                                        </div>
                                    </a>
                                    <a href="https://wa.me/" target="_blank">
                                        <div
                                            className={`bg-green-500 w-12 h-12 flex items-center justify-center rounded-2xl text-white transition-all transform hover:scale-110 hover:brightness-110 shadow-lg hover:shadow-xl`}>
                                            <i className="icon whatsapp"></i>
                                        </div>
                                    </a>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a href="tel:+905305421233"
                                          className="flex items-center gap-3 px-6 py-3 bg-white shadow-md rounded-lg hover:bg-gray-100 transition">
                                        <i className="icon support text-lg"></i>
                                        <span className="font-semibold text-lg">
                                                +90 530 542 12 33
                                            </span>
                                    </a>
                                    <a href="mailto:info@rentacar.com"
                                          className="flex items-center gap-3 px-6 py-3 bg-white shadow-md rounded-lg hover:bg-gray-100 transition">
                                        <i className="icon envelope-text text-lg"></i>
                                        <span className="font-semibold text-lg">
                                                info@rentacar.com
                                            </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-menu">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="flex flex-wrap mb-5">
                        <div className="w-full sm:w-1/2 lg:w-1/4 p-4">
                            <div className="logo mb-3">
                                <Link to="/">
                                    <img
                                        src="/img/logo/filologo.webp"
                                        alt=""
                                        width="180" height="100"
                                    />
                                </Link>
                            </div>
                            <div className="menu">
                                <ul>
                                    <li>
                                        <Link to={ROUTES.UI.CONTACT} onClick={scrollToTop}>{t("İletişim")}</Link>
                                    </li>
                                    <li>
                                        <Link to={ROUTES.UI.BLOG_LISTING}
                                              onClick={scrollToTop}>{t('Bloglar')}</Link>
                                    </li>
                                    <li>
                                        <Link to={ROUTES.UI.INSTITUTIONAL}
                                              onClick={scrollToTop}>{t('Kurumsal')}</Link>
                                    </li>
                                    <li>
                                        <Link to={ROUTES.UI.ABOUT} onClick={scrollToTop}>{t('Hakkımızda')}</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="w-full sm:w-1/2 lg:w-1/4 p-4">
                            <h4>{t("Önemli Bilgiler")}</h4>
                            <div className="menu">
                                <ul>
                                    {policies.length > 0 ? (
                                        policies.map((item) => {
                                            const path = routeMap[item.type] || "#";
                                            return (
                                                <li key={item.id}>
                                                    <Link to={path} onClick={scrollToTop}>
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <li className="text-gray-400 text-sm">{t("Henüz politika bulunamadı.")}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="w-full sm:w-1/2 lg:w-1/4 p-4">
                            <h4>{t("Araç Türleri")}</h4>
                            <div className="menu">
                                <ul>
                                    {categories?.map((item) => (<li key={item.id}>
                                        <Link to="#" onClick={(e) => onClickCategory(e,item?.slug)}>
                                            {item.title}
                                        </Link>
                                    </li>))}
                                </ul>
                            </div>
                        </div>
                        <div className="w-full sm:w-1/2 lg:w-1/6 p-4">
                            <h4>{t('Şubelerimiz')}</h4>
                            <div className="menu">
                                <ul>
                                    {regions && regions.length > 0 ? (regions.map((region, index) => (<li key={index}>
                                        <Link to="#" onClick={(e) => onClickPopularRegion(e,region?.region)}>
                                            {region?.region?.name}
                                        </Link>
                                    </li>))) : (<li>{t("Bölge bulunamadı")}</li>)}
                                </ul>
                            </div>
                        </div>

                    </div>
                 <div className="flex items-center flex-wrap md:justify-center">

    {/* SOL METİN */}
    <div className="w-full sm:w-full lg:w-1/2 p-4 text-center lg:text-left">

        <p>
            {t("Rentacar.com araç kiralama hizmetleri kapsamında faaliyet göstermekte olup, ilgili yasal mevzuatlara uygun şekilde hizmet sunmaktadır.")}
        </p>

        <p className="important mt-3">
            {t("Rentacar.com üzerinde yer alan tüm içerik, görseller ve bilgiler telif hakları kapsamında korunmaktadır. İzinsiz kopyalanamaz ve kullanılamaz. Araç bilgileri ve fiyatlar bilgilendirme amaçlıdır ve dönemsel olarak değişiklik gösterebilir. Oluşabilecek fiyat ve içerik farklılıklarından Rentacar.com sorumlu tutulamaz.")}
        </p>

        <div className="brand-logo flex justify-center lg:justify-start mt-4">
            <img
                src="/img/brand-logo/ssl-odeme.png"
                alt="Güvenli ödeme"
                className="ssl-odeme"
                width={300}
                height={50}
            />
        </div>

    </div>

    {/* SAĞ KISIM */}
    <div className="w-full sm:w-full lg:w-1/6 p-4">

        <div className="reservation flex flex-col items-center justify-center text-center">

            <span className="flex items-center gap-2 mb-2">
                <i className="icon briefcase"></i>
                {t('Rezervasyon Sorgulama')}
            </span>

            <Link
                to={ROUTES.UI.RESERVATİON_MANAGEMENT}
                onClick={scrollToTop}
                className="btn btn-primary px-4 py-2 rounded-lg"
            >
                {t('Sorgula')}
            </Link>

        </div>

    </div>

</div>
                </div>
            </div>
        </section>
        <section className="copyright">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="text">
                    <p>
                        {t("Tüm Telif Hakları Saklıdır")} © 2026 &nbsp;
                        <a href="https://www.msyyazilim.com" target="_blank" rel="noopener noreferrer">MSY YAZILIM</a>
                    </p>
                </div>
            </div>
        </section>
    </footer>);
}

export default Footer;
