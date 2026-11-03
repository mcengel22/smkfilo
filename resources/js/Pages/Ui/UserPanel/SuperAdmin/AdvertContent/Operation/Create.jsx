import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Header from "../../../../../../Components/UI/Header/Header";
import { useTranslation } from 'react-i18next';
import Aside from "../../../Aside";
import AttrCreate from "../Misc/Create";

const ServiceCreate = () => {
    const { t } = useTranslation();
    return (
        <div className="attr-page">
            <div className="title">
                <h1>{t('Yakıt Yönetimi')}</h1>
                <span className="sub-title">{t('Yeni Yakıt')}</span>
            </div>
            <AttrCreate />
        </div>
    );
};

export default ServiceCreate;
