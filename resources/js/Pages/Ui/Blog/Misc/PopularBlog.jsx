import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PopularBlog = () => {
    const { t } = useTranslation();

    return (
        <div className="mb-3">
            {/* <div className="popular-blog-item mb-4">
          <Link href="#">
            <img
              src="/img/fethiye.jpg"
              width={300}
              height={230}
              alt=""
              unoptimized
            />
            <p>{t('Fethiye’de Villa Tatili: Konfor ve Özgürlüğü Bir Arada Yaşayın')}</p>
          </Link>
        </div> */}
        </div>
    );
};

export default PopularBlog;
