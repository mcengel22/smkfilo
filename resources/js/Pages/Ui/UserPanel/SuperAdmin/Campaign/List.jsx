import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { useTranslation } from 'react-i18next';
import {useCampaign} from "../../../../../ServerSide/Hooks/useCampaign";
import {useSelector} from "react-redux";
import Swal from "sweetalert2";
import {toast} from "react-toastify";

const CampaignList = () => {

    const {setCampaigns} = useCampaign();
    const {deleteCampaigns} = useCampaign();
    const { t } = useTranslation();
    const campaigns = useSelector(state => state.home.campaign.campaigns)
    useEffect(() => {
        const setCampaign = async () => {
            try {
                const data = await setCampaigns(); // burada da useAttr içinden gelen fonksiyonu çağırıyoruz
            } catch (err) {

            }
        };

        setCampaign();
    }, []);

    // Silme fonksiyonu
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu işlem geri alınamaz!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'Hayır, iptal et!',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                // Silme işlemine başla
                await deleteCampaigns(id);
                toast.success('Başarıyla silindi! 🎉'); // Başarı mesajı

                // Silme işlemi sonrası özellikleri tekrar çek
                await setCampaigns(); // Silme sonrası veriyi tekrar çek
            } catch (error) {
                console.error('Silme işlemi sırasında hata oluştu:', error);
                Swal.fire('Hata!', 'Silme işlemi sırasında bir sorun oluştu.', 'error');
            }
        } else {
            console.log('Silme işlemi iptal edildi.');
        }
    };
    return (

        <div>
            <div className="title">
                <h1>{t('Kampanyalar')}</h1>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="search-box">
                        <i className="icon search"></i>
                        <input type="text" id="searchInput" placeholder="Ad, e-posta veya telefon ile ara..." />
                    </div>
                    <button className="add-user-btn btn btn-primary">
                        <Link to={ROUTES.UI.CAMPAIGNADD}>
                            <span>{t('Yeni Kampanya')}</span>
                        </Link>
                    </button>
                </div>
                <div className="card-body">
                    <div className="users-content">
                        <div className="table-responsive table-area">
                            <table>
                                <thead>
                                <tr>
                                    <th>{t('Başlık')}</th>
                                    <th>{t('Açıklama')}</th>
                                    <th>{t('İşlemler')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {campaigns.map((campaign) => (<tr key={campaign.id}>

                                    <td>{campaign.title}</td>
                                    <td>{campaign.content}</td>
                                    {/* varsa model listesi */}
                                    <td className="actions">
                                        <div className="flex">
                                            <button className="btn-icon" title="Düzenle">
                                                <Link to={ROUTES.UI.CAMPAIGNEDIT + "/" + campaign.slug}>
                                                    <i className="icon edit"></i>
                                                </Link>
                                            </button>
                                            <button
                                                className="btn-icon delete"
                                                title="Sil"
                                                onClick={() => handleDelete(campaign.id)} // Buton tıklanırsa handleDelete çağrılır
                                            >
                                                <i className="icon trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

}

export default CampaignList;
