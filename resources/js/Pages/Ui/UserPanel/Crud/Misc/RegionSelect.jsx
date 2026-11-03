import React, { useState, useCallback, useEffect } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useRegions } from "../../../../../ServerSide/Hooks/useRegions";
import { useFormikContext } from 'formik';
import { debounce } from "@mui/material";

const RegionSelect = ({defaultRegion = null}) => {
    const { t } = useTranslation();
    const { select2Regions } = useRegions();
    const { values, setFieldValue } = useFormikContext();

    const [selectedRegion, setSelectedRegion] = useState(null);
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [inputValue, setInputValue] = useState("");


    useEffect(() => {
        // Varsayılan değer varsa onu yükle
        if (defaultRegion) {
            setSelectedRegion({
                value: defaultRegion.id.toString(),
                label: defaultRegion.name
            });
            setFieldValue('region_id', defaultRegion.id);
        }
    }, []);

    useEffect(() => {
        const initializeRegion = async () => {
            // Form değerinden yükle
            if (values.region_id && !selectedRegion) {
                try {
                    const response = await select2Regions(values.region_id);
                    if (response && response.length > 0) {
                        const region = {
                            value: response[0].id.toString(),
                            label: response[0].text
                        };
                        setSelectedRegion(region);
                    }
                } catch (error) {
                    console.error("Bölge getirme hatası:", error);
                }
            }
        };

        initializeRegion();
    }, [values.region_id]);


    const handleRegionChange = (region) => {
        setSelectedRegion(region);
        setFieldValue('region_id', region ? region.value : '');
    };

    const handleInputChange = useCallback(
        debounce(async (inputValue) => {
            setInputValue(inputValue);

            if (inputValue.length < 2) {
                setOptions([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await select2Regions(inputValue);
                const formattedOptions = response.map((region) => ({
                    value: region.id.toString(),
                    label: region.text,
                }));
                setOptions(formattedOptions);
            } catch (error) {
                console.error("Arama hatası:", error);
                setError(t("Arama sırasında bir hata oluştu"));
                setOptions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    return (
        <div>
            <label className="block text-gray-700 font-semibold">
                {t('Bölge')}<span className="text-red-500">*</span>
            </label>
            <Select
                value={selectedRegion}
                onChange={handleRegionChange}
                onInputChange={handleInputChange}
                options={options}
                isLoading={isLoading}
                placeholder={t("En az 2 karakter")}
                noOptionsMessage={() =>
                    inputValue.length < 2
                        ? t("En az 2 karakter girin")
                        : t("Sonuç bulunamadı")
                }
                isSearchable={true}
                isClearable={true}
                className="custom-select mt-1"
                classNamePrefix="select"
                filterOption={false}
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>
    );
};

export default RegionSelect;
