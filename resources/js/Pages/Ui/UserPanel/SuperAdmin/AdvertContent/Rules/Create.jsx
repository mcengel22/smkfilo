import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from 'react-i18next';
import AttrCreate from "../Misc/Create";

const RulesCreate = () => {
    const { t } = useTranslation();


    return (
        <div className="attr-page">
            <div className="title">
                <h1>{t('Kurallar Yönetimi')}</h1>
                <span className="sub-title">{t('Yeni Kural')}</span>
            </div>
            <AttrCreate />
        </div>
    );
};

export default RulesCreate;
