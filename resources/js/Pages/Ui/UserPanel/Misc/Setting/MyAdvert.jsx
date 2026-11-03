import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePost } from "../../../../../ServerSide/Hooks/usePost";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { ROUTES } from "@/Libs/Routes/config.jsx";
import PaginationNavigator from "@/Components/UI/Misc/PaginationNavigator.jsx";
import Skeleton from "@/Components/Skeleton.jsx";

const MyAdvert = () => {
    const currentUser = useSelector((state) => state.auth.user);
    const { t } = useTranslation();
    const { setSuperPostByFilter, deletePost } = usePost();
    const posts = useSelector((state) => state.post);
    const isLoading = useSelector((state) => state.post.loading);

    const [aramaMetni, setAramaMetni] = useState("");
    const [ilanDurumu, setIlanDurumu] = useState("Tümü");
    const [ilanTipi, setIlanTipi] = useState("Tümü");
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [localFilters, setLocalFilters] = useState({
        search: "",
        status: null,
        type: null,
        page: 1,
    });

    // 🔄 Filtreye göre ilanları çek
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                window.scrollTo({ top: 0, behavior: "smooth" });
                await setSuperPostByFilter(localFilters);
            } catch (err) {
                console.error("İlanlar çekilemedi 😢", err);
            }
        };
        fetchPosts();
    }, [localFilters]);

    // ✅ Local filtreleri güncelle
    useEffect(() => {
        const yeniFiltreler = {
            search: aramaMetni,
            status: ilanDurumu !== "Tümü" ? ilanDurumu.toLowerCase() : null,
            type: ilanTipi !== "Tümü" ? ilanTipi.toLowerCase() : null,
            page: currentPage,
        };
        setLocalFilters(yeniFiltreler);
    }, [aramaMetni, ilanDurumu, ilanTipi, currentPage]);

    // 🔁 Sayfa değiştiğinde yukarı kaydır
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    // --- RESİM HATA YÖNETİMİ (ZİNCİRLEME KONTROL) ---
    const handleImageError = (e, originalPath) => {
        const target = e.currentTarget;

        // Eğer resim zaten 'no-image.jpg' ise döngüye girmesin
        if (target.src.includes("no-image.jpg")) return;

        // Şu anki denenen kaynak 'benimtatilcim.com' içeriyor mu?
        const isAlreadyRemote = target.src.includes("benimtatilcim.com");

        if (!isAlreadyRemote && originalPath) {
            // SENARYO 1: Kendi sunucunda/localde bulamadı -> benimtatilcim.com'a bak
            // Path'in başındaki olası '/' işaretini temizleyelim
            const cleanPath = originalPath.startsWith('/') ? originalPath.substring(1) : originalPath;
            target.src = `https://benimtatilcim.com/${cleanPath}`;
        } else {
            // SENARYO 2: Orada da yoksa -> No Image göster
            target.src = "/img/no-image.jpg";
        }
    };
    // ------------------------------------------------

    const ilanDurumunuDegistir = async (id) => {
        if (currentUser?.type === "admin") {
            await Swal.fire({
                title: "Yetki Dışı İşlem",
                html: `İlanınızın durumunu değiştirmek için moderatörünüzle iletişime geçin:<br/><br/>
                   <a href="tel:+905013024242" class="bg-blue-500 text-white px-4 py-2 rounded mt-2 inline-block">
                     📞 +90 501 302 42 42
                   </a>`,
                icon: "info",
                showConfirmButton: false
            });
            return;
        }

        const result = await Swal.fire({
            title: "Emin misin?",
            text: "İlanın durumunu değiştirmek istiyor musun?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Evet, değiştir",
            cancelButtonText: "Vazgeç",
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`/api/v1/post/${id}/toggle-status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Sunucu hatası!");
            await setSuperPostByFilter(localFilters);
            Swal.fire("Başarılı!", "Durum başarıyla değiştirildi ✅", "success");
        } catch (err) {
            Swal.fire("Hata!", "Durum değiştirilemedi ❌", "error");
        }
    };

    const handleDelete = async (id) => {
        if (currentUser?.type === "admin") {
            await Swal.fire({
                title: "Yetki Dışı İşlem",
                html: `İlanınızı silmek için moderatörünüzle iletişime geçin:<br/><br/>
                   <a href="tel:+905451926202" class="bg-blue-500 text-white px-4 py-2 rounded mt-2 inline-block">
                     📞 +90 501 302 42 42
                   </a>`,
                icon: "info",
                showConfirmButton: false
            });
            return;
        }

        const result = await Swal.fire({
            title: "Emin misiniz?",
            text: "Bu işlem geri alınamaz!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Evet, sil!",
            cancelButtonText: "Hayır, iptal et!",
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            await deletePost(id);
            await setSuperPostByFilter(localFilters);
        } catch (error) {

            // ❌ Rezervasyon varsa buraya düşecek
            Swal.fire({
                title: "Silinemedi",
                text: "Bu ilan bir veya daha fazla rezervasyona sahip olduğu için silinemez.",
                icon: "error",
                confirmButtonText: "Tamam",
            });
        }
    };

    const validPagination = posts?.pagination && posts.pagination.last_page
        ? posts.pagination
        : null;

    return (
        <div className="musteri-ilan-listesi">
            <div className="ilan-header">
                <div className="sol-kisim">
                    <h2>İlanlar
                    </h2>
                    <div className="istatistikler">
                        <div className="istatistik-item">
                            <span className="sayi">{posts?.pagination?.total}</span>
                            <span className="etiket">Toplam İlan</span>
                        </div>
                    </div>
                </div>

                <div className="sag-kisim">
                    <div className="arama-filtre">
                        <div className="arama-kutusu">
                            <i className="icon search arama-ikonu"></i>
                            <input
                                type="text"
                                placeholder="Araç adı veya ilan kodu ile ara"
                                value={aramaMetni}
                                onChange={(e) => setAramaMetni(e.target.value)}
                            />
                        </div>

                        <select
                            value={ilanDurumu}
                            onChange={(e) => setIlanDurumu(e.target.value)}
                            className="durum-filtresi"
                        >
                            <option value="Tümü">Tüm İlanlar</option>
                            <option value="Aktif">Aktif</option>
                            <option value="Pasif">Pasif</option>
                        </select>

                        {/* <select
                            value={ilanTipi}
                            onChange={(e) => setIlanTipi(e.target.value)}
                            className="durum-filtresi"
                        >
                            <option value="Tümü">Tüm İlanlar</option>
                            <option value="villa">Villa</option>
                            <option value="bungalow">Bungalov</option>
                            <option value="boat">Yat</option>
                        </select> */}
                    </div>

                    <button className="yeni-ilan-btn" onClick={() => setModalOpen(true)}>
                        {t("Yeni İlan Oluştur")}
                    </button>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center modal-advert">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-xl">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">Yeni İlan Oluştur</h2>
                            <button
                                className="bg-red-500 p-2 rounded-full"
                                onClick={() => setModalOpen(false)}
                            >
                                <i className="icon xmark"></i>
                            </button>
                        </div>
                        <div className="flex flex-row">
                            <Link to={`${ROUTES.UI.POSTCREATE}?type=villa`} className="card me-2">
                                {/* <i className="icon -car"></i> */}
                                {t("Araç İlanı")}
                            </Link>
                            {/* <Link to={`${ROUTES.UI.POSTCREATE}?type=bungalow`} className="card me-2">
                                <i className="icon big-home"></i>
                                {t("Bungalov")}
                            </Link>
                            <Link to={`${ROUTES.UI.POSTCREATE}?type=boat`} className="card">
                                <i className="icon boat"></i>
                                {t("Yat")}
                            </Link> */}
                        </div>
                    </div>
                </div>
            )}

            <div className="tablo-container">
                <table className="ilan-tablosu">
                    <thead>
                    <tr>
                        <th>İlan No</th>
                        <th>Sahip</th>
                        <th>İlan Tipi</th>
                        <th>İlan Görseli</th>
                        <th>Günlük Fiyat</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <tr key={index} className="animate-pulse">
                                <td><Skeleton height="20px" width="60px" /></td>
                                <td><Skeleton height="20px" width="200px" /></td>
                                <td><div className="villa-gorsel"><Skeleton height="100px" width="100px" /></div></td>
                                <td><Skeleton height="20px" width="100px" /></td>
                                <td><Skeleton height="24px" width="80px" className="rounded-full" /></td>
                                <td><div className="islemler flex gap-2">
                                    <Skeleton height="30px" width="30px" className="rounded-full" />
                                    <Skeleton height="30px" width="30px" className="rounded-full" />
                                    <Skeleton height="30px" width="30px" className="rounded-full" />
                                    <Skeleton height="30px" width="30px" className="rounded-full" />
                                </div></td>
                            </tr>
                        ))
                    ) : (
                        posts?.posts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.code}</td>
                                <td>
                                    {post?.user?.name ?? "Misafir"}
                                    ({post?.user?.phone ?? "-"})
                                </td>
                                <td>{post.title}</td>
                                <td>
                                    {/* --- GÜNCELLENEN RESİM ALANI --- */}
                                    <div className="villa-gorsel">
                                        <img
                                            src={
                                                post.cover?.media_url
                                                    ? (post.cover.media_url.startsWith("http")
                                                        ? post.cover.media_url
                                                        : post.cover.media_url) // İlk deneme: Olduğu gibi (Local)
                                                    : "/img/no-image.jpg"
                                            }
                                            alt={post.cover?.media_alt || post.title}
                                            width={100}
                                            height={100}
                                            className="object-cover rounded"
                                            loading="lazy"
                                            onError={(e) => handleImageError(e, post.cover?.media_url)}
                                        />
                                    </div>
                                    {/* ------------------------------- */}
                                </td>
                                <td className="fiyat text-sm">₺{post.min_price.toLocaleString("tr-TR")}</td>
                                <td>
                                        <span className={`durum-badge ${post.status === 1 ? "active" : "passive"}`}>
                                            {post.status === 1 ? "Aktif" : "Pasif"}
                                        </span>
                                </td>
                                <td>
                                    <div className="islemler">

                                        {/* 👁 Görüntüle — Herkese açık */}
                                        <Link
                                            className="islem-btn goruntule"
                                            to={`/Detay/${post.slug}`}
                                            data-tooltip="Görüntüle"
                                        >
                                            👁
                                        </Link>

                                        <Link
                                            className="islem-btn duzenle"
                                            to={`${ROUTES.UI.POSTEDIT}/${post.slug}`}
                                            data-tooltip="Düzenle"
                                        >
                                            ✏
                                        </Link>

                                        {/* Eğer SUPER ADMIN ise tüm işlemler görünsün */}
                                        {currentUser?.type === "super_admin" ? (
                                            <>
                                                <button
                                                    className="islem-btn ayarlar"
                                                    onClick={() => ilanDurumunuDegistir(post.id)}
                                                    data-tooltip="Durumu Değiştir"
                                                >
                                                    ⚙️
                                                </button>

                                                <button
                                                    className="islem-btn sil"
                                                    onClick={() => handleDelete(post.id)}
                                                    data-tooltip="Sil"
                                                >
                                                    🗑
                                                </button>
                                            </>
                                        ) : (
                                            // ❌ Admin ise yalnızca UYARI İKONU gelsin
                                            <button
                                                className="islem-btn warning"
                                                onClick={() =>
                                                    Swal.fire({
                                                        title: "Bilgilendirme",
                                                        html: `
                            İlanınızı <b>düzenlemek</b>, <b>silmek</b> veya <b>aktif/pasif</b> duruma getirmek için<br/>
                            müşteri temsilcimizle iletişime geçebilirsiniz:<br/><br/>
                            <a href="tel:+905451926202"
                                class="bg-blue-500 text-white px-4 py-2 rounded inline-block">
                                📞 +90 501 302 42 42
                            </a>
                        `,
                                                        icon: "info",
                                                        confirmButtonText: "Tamam",
                                                        confirmButtonColor: "#3085d6",
                                                    })
                                                }
                                                data-tooltip="Bilgilendirme"
                                            >
                                                ℹ️
                                            </button>
                                        )}
                                    </div>
                                </td>

                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                <PaginationNavigator pagination={validPagination} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
};

export default MyAdvert;
