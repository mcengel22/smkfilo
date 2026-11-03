import React, {useState} from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    setFilters
}  from '../../../../Repo/Redux/Modules/FilterSlice';
import { ROUTES } from "../../../../Libs/Routes/config";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

function LocationCard({data}) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const filters = useSelector(state => state.filter.filters);
    const [filterData, setFilterData] = useState({
        ...filters,
        region:
            {
                id: data?.region?.id,
                name: data?.region?.name,
            }
    });
    const navigate = useNavigate();

    const onClick = (e) => {
        e.preventDefault();
        try {
            dispatch(setFilters(filterData));
            localStorage.setItem('filters', JSON.stringify(filterData));
            navigate(`${ROUTES.UI.LISTING}`);
        }catch (error){
            console.log(error);
        }

    }

  return (
    <div
      className="destination-list background-image"
      style={{ backgroundImage: `url(/img/banner/rentacar.png)` }}
>
      <div className="destination-content">
        <h4 className="box-title">{data?.region?.name}</h4>
      </div>
      <a onClick={onClick} className="th-btn style2">
        {t('İlanları Gör')}
      </a>
    </div>
  );
}

export default LocationCard;
