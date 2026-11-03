import React from "react";
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';

const Price = ({ minday, price, cleanPrice, cleanDay, start, end }) => {
    const { t } = useTranslation();

    
    const formatTurkishDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const day = date.getDate();

        const turkishMonths = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];

        const month = turkishMonths[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    };

    return (
        <li className="mb-2">
            <div className="left-section">
                <span className="font-bold date">
                    {formatTurkishDate(start)} - {formatTurkishDate(end)}
                </span>
                <div className="flex items-center sub-title">
                    Minimum {minday} gece konaklama
                    <Tooltip title={`${cleanDay} Gece altındaki kiralamalarda ekstra ${cleanPrice}₺ temizlik ücreti alınmaktadır.`} arrow>
                        <i className="icon info ms-1"></i>
                    </Tooltip>
                </div>
            </div>
            <div className="flex">
                <div className="price">
                    <span>{t('Gecelik')}</span>
                    <strong>{price}₺</strong>
                </div>
            </div>
        </li>
    )
}

Price.propTypes = {
    minday: PropTypes.number.isRequired,
    price: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    cleanPrice: PropTypes.number.isRequired,
    cleanDay: PropTypes.number.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
};

export default Price;
