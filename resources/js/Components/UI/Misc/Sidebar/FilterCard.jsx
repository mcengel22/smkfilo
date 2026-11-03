import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../../../Repo/Redux/Modules/FilterSlice'; // Redux aksiyonunu içe aktar

export default function FilterCard(props) {
    const dispatch = useDispatch(); // Redux dispatch fonksiyonunu kullan
    const filters = useSelector(state => state.filter.filters); // Aktif filtre durumunu al

    // Checkbox değişimi durumunda çağrılacak fonksiyon
    const handleCheckboxChange = (event, attrType) => {
        const { value, checked } = event.target;

        // State'in tamamen immutability'sini koruyarak klonla
        const updatedFilters = { ...filters, attrs: { ...(filters.attrs || {}) } };

        // Eğer checkbox işaretlendiyse:
        if (checked) {
            // AttrType içerisine yeni değer ekle
            if (!updatedFilters.attrs[attrType]) {
                // Eğer attrType boşsa, başlat
                updatedFilters.attrs[attrType] = [];
            }
            // Aynı slug yoksa ekle
            if (!updatedFilters.attrs[attrType].includes(value)) {
                updatedFilters.attrs[attrType] = [...updatedFilters.attrs[attrType], value];
            }
        } else {
            // Eğer checkbox kaldırıldıysa, attrType'dan ilgili slug'ı çıkar
            if (updatedFilters.attrs[attrType]) {
                updatedFilters.attrs[attrType] = updatedFilters.attrs[attrType].filter(
                    (item) => item !== value
                );

                // Eğer attrType tamamen boş ise, attrType dalını kaldır
                if (updatedFilters.attrs[attrType].length === 0) {
                    delete updatedFilters.attrs[attrType];
                }
            }
        }

        // Eğer attrs tamamen boşaldıysa, onu da kaldır
        if (Object.keys(updatedFilters.attrs).length === 0) {
            delete updatedFilters.attrs;
        }

        // Redux state'ini güncelle
        dispatch(setFilters(updatedFilters));
    };

    return (
        <div className="card">
            <div className="card-title">
                <h4>
                    <i className={`icon ${props.icon}`}></i> {props.title}
                </h4>
            </div>
            <div className="card-body">
                <div className={`${props.type} scroll`}>
                    {props.items.map((item, key) => (
                        <div key={key} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`${item.attr_type}-${key}`}
                                value={item.slug}
                                onChange={(e) => handleCheckboxChange(e, item.attr_type)}
                                checked={
                                    filters.attrs?.[item.attr_type]?.includes(item.slug) || false
                                }
                            />
                            <label
                                className="form-check-label"
                                htmlFor={`${item.attr_type}-${key}`}
                            >
                                {item.title}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
