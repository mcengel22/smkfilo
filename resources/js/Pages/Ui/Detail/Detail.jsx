import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";

import Header from "../../../Components/UI/Header/Header";
import Breadcrumb from "../../../Components/UI/Misc/Breadcrumb";
import AdvertCard from "../../../Components/UI/Misc/AdvertCard";
import Gallery from "./Misc/Gallery";
import TabsMenu from "./Misc/TabsMenu";
import TabStatus from "./Misc/Calendar/General/Status";
import TabCategory from "./Misc/Calendar/General/Category";
import TabDesc from "./Misc/Calendar/General/Description";
import TabService from "./Misc/Calendar/General/Service";
import TabFeature from "./Misc/Calendar/General/Feature";
import Price from "./Misc/Rules/Price";
import TabRules from "./Misc/Rules/Rules";
import TabOtherInfo from "./Misc/Rules/OtherInfo";
import TabNearby from "./Misc/Nearby/Nearby";
import Comments from "./Misc/Comment/Comments";
import CommentForm from "./Misc/Comment/CommentForm";
import DatePicker from "./Misc/Calendar/Calendar";
import ReservationCard from "./Misc/ReservationCard";

import SkeletonDetail from "./SkeletonDetail";
import { useFavorite } from "../../../ServerSide/Hooks/useFavorite";
import Swal from "sweetalert2";
import { usePost } from "../../../ServerSide/Hooks/usePost";
import {
    setReservationData,
    setSelectedPackage,
    setSelectedExtraKm,
} from "../../../Repo/Redux/Modules/ReservationSlice.jsx";
import { ROUTES } from "../../../Libs/Routes/config";
import ReservationModal from "./Misc/ReservationModal.jsx";

const mapDetailsToReservationData = (details) => {
    const mapping = {
        prepayment: "prePaymentRate",
        cleaning_fee_days: "cleaningDays",
        cleaning_fee: "cleaningFee",
        deposit: "deposit",
    };

    return details.reduce((acc, item) => {
        const reduxKey = mapping[item.key];
        if (reduxKey && item.value !== null) {
            let parsedValue = parseFloat(item.value);
            if (item.key === "prepayment") parsedValue = parsedValue / 100;
            acc[reduxKey] = parsedValue;
        }
        return acc;
    }, {});
};

const Detail = () => {
    const MapsButton = ({ address }) => {
        if (!address) return null;
        const encoded = encodeURIComponent(address);
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full md:w-auto gap-2
                       bg-orange-600 hover:bg-orange-700 text-white
                       px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all"
            >
                Yol Tarifi Al
            </a>
        );
    };

    const dispatch = useDispatch();
    const swiperRef = useRef(null);
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("packages");
    const { slug } = useParams();
    const { setPostBySlug } = usePost();
    const postDetail = useSelector((state) => state.post.detail);
    const postIsLoading = useSelector((state) => state.post.loading);
    const reservation = useSelector((state) => state.reservation);
    const user = useSelector((state) => state.auth.user);
    const [isFavorite, setIsFavorite] = useState(postDetail?.favorite ?? false);
    const { processFavorite } = useFavorite();
    const [selectedDates, setSelectedDates] = useState({
        start: null,
        end: null,
    });
    const navigate = useNavigate();

    const [modalItem, setModalItem] = useState(null);

    const data = useMemo(
        () => ({
            reservations: postDetail?.unavailable_dates,
            prices: postDetail?.prices,
            details: postDetail?.details,
        }),
        [postDetail],
    );

    const getPostBySlug = useCallback(async () => {
        try {
            const response = await setPostBySlug(slug);
            const details = response.data.details;
            const reservationData = {
                postSlug: slug,
                ...mapDetailsToReservationData(details),
            };
            dispatch(setReservationData(reservationData));
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    }, [dispatch, setPostBySlug, slug]);

    useEffect(() => {
        (async () => {
            await getPostBySlug();
            window.scrollTo(0, 0);
        })();
    }, [slug]);

    const tabs = [
        { id: "genel", label: "Genel" },
        { id: "rules", label: "Fiyatlar ve Kurallar" },
        { id: "nearby", label: "Ulaşım Bilgisi" },
        { id: "packages", label: "Yıllık Paketler" },
        { id: "comments", label: "Yorumlar" },
    ];

    const handleToggleFavorite = async () => {
        if (!user) {
            const sonuc = await Swal.fire({
                title: t("Favorilere eklemek ister misiniz?"),
                text: t(
                    "Bu özelliği kullanabilmek için önce giriş yapmanız gerekiyor.",
                ),
                icon: "info",
                showCancelButton: true,
                confirmButtonText: t("Giriş Yap"),
                cancelButtonText: t("Vazgeç"),
            });
            if (sonuc.isConfirmed) navigate(ROUTES.AUTH.LOGIN);
            return;
        }
        try {
            await processFavorite({ post_id: postDetail.id });
            await getPostBySlug();
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Favori toggle hatası", error);
        }
    };

    useEffect(() => {
        setIsFavorite(postDetail?.favorite ?? false);
    }, [postDetail?.favorite]);

    const handleReservationConfirm = ({ item, selectedAddons, totalPrice }) => {
        // Buraya ileride rezervasyon API çağrısı gelecek
        console.log("REZERVASYON ONAYLANDI", {
            item,
            selectedAddons,
            totalPrice,
        });
        setModalItem(null);
    };

    return (
        <div className="detail-page">
            <Header />

            {/* Rezervasyon Modalı */}
            {modalItem && (
                <ReservationModal
                    item={modalItem}
                    onClose={() => setModalItem(null)}
                    onConfirm={handleReservationConfirm}
                />
            )}

            <div className="max-w-8xl mx-auto sm:px-2 md:px-2 flex justify-between my-6">
                <Breadcrumb name={`Kiralık Araç`} />
                <div className="other-pages">
                    <button
                        className={`favorite ${isFavorite ? "favorited" : ""}`}
                        onClick={handleToggleFavorite}
                    >
                        <i
                            className={`icon ${isFavorite ? "heart-fill" : "heart"} me-2`}
                        ></i>
                        {isFavorite ? t("Favorilerde") : t("Favorilere Ekle")}
                    </button>
                </div>
            </div>

            {!postIsLoading ? (
                <div className="detail">
                    <div className="max-w-8xl mx-auto sm:px-2 md:px-2 flex flex-wrap mb-9">
                        <div className="w-full lg:w-2/3 px-3">
                            <div className="page-title mb-5">
                                <div className="ilan-inf">
                                    <h1>{postDetail?.title}</h1>
                                </div>
                                <div className="ilan-infs">
                                    <p className="location">
                                        {postDetail?.region?.name}
                                    </p>
                                    <p>
                                        <span>{t("İlan No")}:</span> #
                                        {postDetail?.code}
                                    </p>
                                </div>
                            </div>

                            <div className="gallery-area">
                                <Gallery
                                    gallery={postDetail?.gallery}
                                    cover={postDetail?.cover}
                                />
                            </div>

                            <div className="detail-nav">
                                <TabsMenu
                                    tabs={tabs}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                />
                                <div className="tab-content">
                                    {activeTab === "genel" && (
                                        <div className="tab-pane fade show active">
                                            <div className="card">
                                                <h2>{t("Açıklama")}</h2>
                                                <TabDesc
                                                    desc={
                                                        postDetail?.description
                                                    }
                                                />
                                            </div>
                                            <div className="card possibility">
                                                <h3>{t("Özellikler")}</h3>
                                                <ul>
                                                    {Array.isArray(
                                                        postDetail?.attributes
                                                            ?.features,
                                                    ) &&
                                                        postDetail.attributes.features.map(
                                                            (
                                                                feature,
                                                                index,
                                                            ) => (
                                                                <TabFeature
                                                                    key={index}
                                                                    iconClass={
                                                                        feature
                                                                            ?.info
                                                                            ?.icon_class ||
                                                                        "info"
                                                                    }
                                                                    feature={
                                                                        feature?.title ||
                                                                        "Başlık yok"
                                                                    }
                                                                    sub={
                                                                        feature?.value ||
                                                                        "yok"
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "rules" && (
                                        <div className="tab-pane fade">
                                            <div className="card">
                                                <h2>Fiyatlar</h2>
                                                <ul className="price-table">
                                                    {postDetail?.prices?.map(
                                                        (prices_, index) => (
                                                            <Price
                                                                key={index}
                                                                price={
                                                                    prices_.price
                                                                }
                                                                minday={
                                                                    prices_.min_days
                                                                }
                                                                cleanDay="4"
                                                                cleanPrice="5000"
                                                                start={
                                                                    prices_.start_date
                                                                }
                                                                end={
                                                                    prices_.end_date
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                            <div className="card rules">
                                                <ul className="ilan-rules">
                                                    {postDetail?.attributes?.rules?.map(
                                                        (rule, index) => (
                                                            <TabRules
                                                                key={index}
                                                                iconClass={
                                                                    rule?.info
                                                                        ?.icon_class ||
                                                                    "info"
                                                                }
                                                                service={
                                                                    rule?.title ||
                                                                    "bilinmiyor"
                                                                }
                                                                className={
                                                                    rule?.value ||
                                                                    "suitable"
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "nearby" && (
                                        <div className="tab-pane fade">
                                            <div className="card p-6 border border-orange-200 shadow-sm rounded-xl bg-white">
                                                <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                                                    <i className="icon map text-orange-500 text-3xl"></i>
                                                    Ulaşım & Yol Tarifi
                                                </h3>
                                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
                                                    <p className="text-gray-600 leading-relaxed">
                                                        {postDetail?.neighborhood ||
                                                            postDetail
                                                                ?.attributes
                                                                ?.neighborhood ||
                                                            "Adres bilgisi bulunamadı."}
                                                    </p>
                                                </div>
                                                <MapsButton
                                                    address={
                                                        postDetail?.neighborhood ||
                                                        postDetail?.attributes
                                                            ?.neighborhood
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "packages" && (
                                        <div className="card">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h2 className="text-2xl font-bold">
                                                        {t("Yıllık Paketler")}
                                                    </h2>
                                                    <p className="text-gray-500 mt-1">
                                                        {t(
                                                            "Size uygun yıllık kullanım paketini seçin",
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {postDetail?.prices?.map(
                                                    (item, index) => (
                                                        <div
                                                            key={index}
                                                            className={`border rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 transition ${
                                                                reservation
                                                                    .selectedPackage
                                                                    ?.id ===
                                                                item.id
                                                                    ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
                                                                    : "border-gray-200 hover:border-orange-300"
                                                            }`}
                                                        >
                                                            <div className="flex flex-col">
                                                                <h3 className="text-xl font-bold text-gray-800">
                                                                    {item.years}{" "}
                                                                    {t("Yıl")} ·{" "}
                                                                    {Number(
                                                                        item.km,
                                                                    ).toLocaleString(
                                                                        "tr-TR",
                                                                    )}{" "}
                                                                    KM
                                                                </h3>
                                                                <p className="text-gray-500 mt-1">
                                                                    {t(
                                                                        "Yıllık kullanım paketi",
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                                                <div className="text-3xl font-bold text-orange-600">
                                                                    {Number(
                                                                        item.price,
                                                                    ).toLocaleString(
                                                                        "tr-TR",
                                                                    )}{" "}
                                                                    ₺
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        dispatch(
                                                                            setSelectedPackage(
                                                                                item,
                                                                            ),
                                                                        )
                                                                    }
                                                                    className={`h-[52px] px-8 rounded-xl font-bold transition shadow-sm ${
                                                                        reservation
                                                                            .selectedPackage
                                                                            ?.id ===
                                                                        item.id
                                                                            ? "bg-orange-600 text-white"
                                                                            : "bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                                                                    }`}
                                                                >
                                                                    {reservation
                                                                        .selectedPackage
                                                                        ?.id ===
                                                                    item.id
                                                                        ? t(
                                                                              "Seçildi",
                                                                          )
                                                                        : t(
                                                                              "Paketi Seç",
                                                                          )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "comments" && (
                                        <div className="tab-pane fade">
                                            <div className="card">
                                                <Comments
                                                    comments={
                                                        postDetail?.comments
                                                    }
                                                    commentsCount={
                                                        postDetail?.comments_count
                                                    }
                                                />
                                                <hr className="my-4 border-1 border-orange-500" />
                                                <div className="add-comments">
                                                    <h3 className="mb-0">
                                                        {t("Yorum yaz")}
                                                    </h3>
                                                </div>
                                                <CommentForm />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3 px-3">
                            <ReservationCard
                                data={data}
                                setSelectedDates={setSelectedDates}
                                selectedDates={selectedDates}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <SkeletonDetail />
            )}
        </div>
    );
};

export default Detail;
