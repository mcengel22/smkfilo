import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Header from "../../../../../../Components/UI/Header/Header";
import { useTranslation } from 'react-i18next';
import Aside from "../../../Aside";
import AttrEdit from "../Misc/Edit";

const ServiceEdit = () => {
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        name: Yup.string().required("Tip Adı Zorunlu"),
        type: Yup.string().required("Kategori Zorunlu"),
    });

    return (
        <div>
            <div className="title">
                <h1>{t('Yakıt Yönetimi')}</h1>
                <span className="sub-title">{t('Yakıt Düzenle')}</span>
            </div>


            <AttrEdit />
        </div>
    );
};

export default ServiceEdit;
