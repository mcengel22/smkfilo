import React, { useState, useRef, useEffect, useCallback } from "react";
import MainDatePicker from "../../../../Components/UI/Misc/MainDatePicker";
import { useTranslation } from "react-i18next";
import { debounce } from "@mui/material";
import { useRegions } from "../../../../ServerSide/Hooks/useRegions";
import { useDispatch, useSelector } from "react-redux";
import { updateFilters } from "../../../../Repo/Redux/Modules/FilterSlice";
import { usePost } from "../../../../ServerSide/Hooks/usePost";
import { ROUTES } from "../../../../Libs/Routes/config";
import { useLocation, useNavigate } from "react-router-dom";

const styles = `
  .hs-wrap {
    width: 100%;
  }

  .hs-card {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.10);
    padding: 10px 10px 10px 20px;
    gap: 0;
    border: 1.5px solid #f0f0f0;
    transition: box-shadow 0.2s;
  }

  .hs-card:hover {
    box-shadow: 0 4px 28px rgba(0,0,0,0.13);
  }

  .hs-field {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
    padding: 4px 0;
  }

  .hs-field-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #f0f5ff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .hs-field-icon .icon:before {
    width: 1.1rem;
    height: 1.1rem;
  }

  .hs-field-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .hs-field-label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    line-height: 1;
    margin-bottom: 3px;
  }

  .hs-sep {
    width: 1px;
    height: 40px;
    background: #e8ecf0;
    margin: 0 14px;
    flex-shrink: 0;
  }

  .hs-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #1a56db;
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 13px 26px;
    font-size: 0.92rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
    box-shadow: 0 2px 12px rgba(26,86,219,0.25);
    flex-shrink: 0;
    letter-spacing: 0.2px;
  }

  .hs-btn:hover {
    background: #1648c0;
    transform: translateY(-1px);
    box-shadow: 0 4px 18px rgba(26,86,219,0.32);
  }

  .hs-btn:active {
    transform: scale(0.97);
  }

  .hs-btn .icon:before {
    width: 1rem;
    height: 1rem;
    background-color: #fff !important;
  }

  /* DatePicker içi */
  .hs-wrap .search-datepicker {
    position: relative;
  }

  .hs-wrap .search-datepicker-header {
    cursor: pointer;
    user-select: none;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
  }

  .hs-wrap .search-dates-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .hs-wrap .search-date-section {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .hs-wrap .search-date-content {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .hs-wrap .search-date-label {
    font-size: 0.7rem;
    color: #94a3b8;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    line-height: 1;
  }

  .hs-wrap .search-date-value {
    font-size: 0.95rem;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.2;
    white-space: nowrap;
  }

  .hs-wrap .search-date-placeholder {
    font-size: 0.88rem;
    font-weight: 500;
    color: #c0cad6;
  }

  .hs-wrap .search-date-arrow {
    color: #cbd5e1;
    font-size: 1rem;
    flex-shrink: 0;
    line-height: 1;
  }

  .hs-wrap .search-datepicker-dropdown {
    position: absolute;
    top: calc(100% + 14px);
    left: 0;
    z-index: 1000;
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 10px 48px rgba(0,0,0,0.14);
    overflow: hidden;
  }

  .hs-wrap .datepicker-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 999;
  }

  /* Mobil */
  @media (max-width: 768px) {
    .hs-card {
      flex-direction: column;
      border-radius: 16px;
      padding: 14px;
      gap: 10px;
      align-items: stretch;
    }

    .hs-field {
      width: 100%;
    }

    .hs-sep {
      display: none;
    }

    .hs-btn {
      width: 100%;
      justify-content: center;
      border-radius: 12px;
      padding: 14px;
    }

    .hs-wrap .search-datepicker-dropdown {
      left: 50%;
      transform: translateX(-50%);
    }

    .hs-wrap .search-date-value {
      font-size: 0.88rem;
    }
  }
`;

const HomeTabs = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const dropdownRef = useRef(null);
    const { select2Regions } = useRegions();
    const filter = useSelector((state) => state.filter);

    const [selectedCity, setSelectedCity] = useState(null);
    const { setPostsByFilter } = usePost();

    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [inputValue, setInputValue] = useState("");

    const dateRange = filter?.filters?.dateRange;
    const [dates, setDates] = useState({
        start_date: dateRange?.start_date || null,
        end_date: dateRange?.end_date || null,
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const region = filter?.filters?.region;
        if (region?.id && region?.name) {
            setSelectedCity({ value: region.id, label: region.name });
        } else {
            setSelectedCity(null);
        }
    }, [filter?.filters?.region]);

    useEffect(() => {
        setDates({
            start_date: dateRange?.start_date || "",
            end_date: dateRange?.end_date || "",
        });
    }, [filter.filters?.dateRange]);

    const handleDateChange = (newRange) => {
        setDates(newRange);
        dispatch(
            updateFilters({
                dateRange: {
                    start_date: newRange.start_date,
                    end_date: newRange.end_date,
                },
            }),
        );
    };

    const handleCityChange = (city) => {
        setSelectedCity(city);
        dispatch(
            updateFilters({
                region: {
                    id: city?.value || "",
                    name: city?.label || "",
                },
            }),
        );
    };

    const handleInputChange = useCallback(
        debounce(async (val) => {
            setInputValue(val);
            if (val.length < 2) {
                setOptions([]);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const response = await select2Regions(val);
                setOptions(
                    response.map((city) => ({
                        value: city.id.toString(),
                        label: city.text,
                    })),
                );
            } catch {
                setError("Arama sırasında bir hata oluştu");
                setOptions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        [],
    );

    const getPostwFilter = async () => {
        if (location.pathname !== ROUTES.UI.LISTING) {
            navigate(ROUTES.UI.LISTING);
        } else {
            window.scrollTo(0, 0);
            // Tüm araçları getirmek için filtreleri temizleyebiliriz
            await setPostsByFilter({});
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="hs-wrap flex justify-center">
                <button
                    className="hs-btn"
                    onClick={getPostwFilter}
                    type="button"
                >
                    <i className="icon search"></i>
                    {t("Tüm Araçları İncele")}
                </button>
            </div>
        </>
    );
};

export default HomeTabs;
