export const API_CONFIG = {
    BASE_URL: "http://127.0.0.1:8000",
    //BASE_URL: 'https://tatilmerasi.com/',
    ENDPOINTS: {
        AUTH: {
            LOGIN: "/api/v1/Giris",
            LOGOUT: "/api/v1/Cikis",
            REFRESH_TOKEN: "/api/v1/TokenYenile",
            REGISTER: "/api/v1/KayitOl",
            VERIFY_EMAIL: "/api/v1/MailAktiflestir",
            FORGOT_PASSWORD: "/api/v1/SifremiUnuttum",
            RESET_PASSWORD: "/api/v1/SifreSifirla",
            ME: "/api/v1/me",
        },
        USER: {
            PROFILE: "/api/user/profile",
            UPDATE_PROFILE: "/api/v1/User/UpdateProfile",
            CHANGE_PASSWORD: "/api/user/change-password",
            RESETPASSWORD: "/api/v1/reset-password",
            USER: "api/v1/Kullanici",
            USER_UPDATE: "api/v1/Kullanici",
            ME: "/api/v1/Kullanici/me",
            ADMINREQUEST: "api/v1/admin-request",
            ADMINREQUESTAPPROVE: "api/v1/admin-request/approve",
            ADMINREQUESTREJECT: "api/v1/admin-request/reject",
        },
        ATTR: {
            ATTR: "api/v1/attr",
            CATEGORY: "/api/v1/attr/type/category",
            GET_W_TYPE: "/api/v1/attr/post",
            FEATURES: "/api/v1/attr/type/features",
            RULES: "/api/v1/attr/type/rules",
            OPERATION: "/api/v1/attr/type/operation",
            NEAR: "/api/v1/attr/type/near",
        },
        FAQ: {
            FAQ: "api/v1/faq",
        },
        BLOG: {
            BASE: "/v1/blog",
        },
        CAMPAIGN: {
            CAMPAIGN: "api/v1/campaign",
            CAMPAIGNEDIT: "api/v1/campaign",
        },
        POPULERREGION: {
            POPULERREGION: "api/v1/populerregions",
        },
        SHOWCASE: {
            SHOWCASE: "api/v1/showcase",
            SHOWCASESHASPOST: "api/v1/showcasehaspost",
        },
        POST: {
            POST: "api/v1/post",
            POSTUSER: "api/v1/post/user",
            POSTEDIT: "api/v1/post",
            FILTER: "api/v1/post/filter",
            DETAIL: "/api/v1/post",
            TYPE: "/api/v1/post/type",
            SUPER: {
                ALL: "api/v1/post/super",
                FILTER: "api/v1/post/super/filter",
            },
        },
        COMMENT: {
            COMMENT: "api/v1/comment/user",
            COMMENTS: "api/v1/comment/post",
            COMMENTREJECT: "api/v1/comment/reject",
            COMMENTAPPROVE: "api/v1/comment/approve",
            COMMENTPOST: "api/v1/comment/post",
            COMMENTADD: "api/v1/comment",
        },
        COUPON: {
            COUPON: "api/v1/coupon",
            VALIDATE: "api/v1/coupon/validate",
        },
        FAVORITE: {
            FAVORITE: "api/v1/favorite/only-ids",
            FAVORITEPROCESS: "api/v1/favorite",
        },
        CONTACT: {
            CONTACT: "api/v1/contactform",
        },
        REGIONS: {
            SELECT2: "api/v1/select2/regions",
        },
        ICONS: {
            SELECT2: "api/v1/select2/icons",
        },
        RESERVATION: {
            RESERVATION: "/api/v1/reservation",
            RESERVATIONSEARCH: "api/v1/reservation/search",
            UPDATE: "/api/v1/reservation", // ✅ PUT isteği buraya
            FILTER: "api/v1/reservation/filter",
            ROOTFILTER: "api/v1/reservation/root/by-post",
            USER_FILTER: "api/v1/reservation/user/filter",
            CONFIRMED: "api/v1/reservation/confirmed",
            CANCELED: "api/v1/reservation/canceled",
            SEARCH: "api/v1/reservation/search",
            MANUEL: "api/v1/reservation/manual",
            EXTERNAL: "api/v1/reservation/external",
            DELETE: "/api/v1/reservation", // id sonda eklenecek
        },
        SEARCH: {
            SELECT2: "api/v1/select2/search",
        },
        MEDIA: {
            MEDIA: "api/v1/media",
        },
        SEO: {
            BASE: "api/v1/seo",
            BY_TYPE_REGION: "api/v1/seo/byTypeRegion",
        },
        POLICIES: {
            POLICIES: "/api/policies",
        },
        PAYMENT: {
            PAYMENT: "/api/v1/payten",
            CREATE_PAYMENT: "/api/v1/payten/create-payment",
            FAIL: "/api/v1/payten/fail-reservation",
        },
        // Diğer endpoint grupları için json çağır.
    },
    HEADERS: {
        "Content-Type": "application/json",
    },
    PROJECT: undefined,
};

export default API_CONFIG;
