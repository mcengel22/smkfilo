import { applyMiddleware, combineReducers, compose, configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth/AuthSlice';
import attrSlice from "./Modules/AttrSlice";
import faqSlice from "./Modules/FaqSlice";
import blogSlice from "./Modules/BlogSlice";
import campaignSlice from "./Modules/CampaignSlice"
import populerregionSlice from "./Modules/PopulerregionSlice";
import showcaseSlice from "./Modules/ShowcaseSlice";
import postSlice from "./Modules/PostSlice";
import filterSlice from "./Modules/FilterSlice";
import reservationReducer from "./Modules/ReservationSlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import commentSlice from "../../Repo/Redux/Modules/CommentSlice";
import couponSlice from "../../Repo/Redux/Modules/CouponSlice";
import contactSlice from "@/Repo/Redux/Modules/ContactSlice.jsx";
import UserSlice from "@/Repo/Redux/Modules/UserSlice.jsx";
import favoriteSlice from "@/Repo/Redux/Modules/FavoriteSlice.jsx";
import mediaSlice from "@/Repo/Redux/Modules/MediaSlice.jsx";
import seoSlice from "@/Repo/Redux/Modules/SeoSlice.js";
import policiesSlice from "./Modules/PoliciesSlice";
import paymentReducer from "../../Repo/Redux/Modules/PaymentSlice";
import supportTicketSlice from "./Modules/SupportTicketSlice";
import kmPaketleriSlice from "./Modules/KmPaketleriSlice";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['reservation','post','payment'] // Persist reservation, post, and payment states
};
const homeReducers = combineReducers({
    faq: faqSlice,
    blog: blogSlice,
    campaign: campaignSlice,
    populerregion: populerregionSlice,
    showcase: showcaseSlice,
});

const rootReducer = combineReducers({
    auth: authReducer,
    home: homeReducers,
    post: postSlice,
    filter: filterSlice,
    attr: attrSlice,
    comment:commentSlice,
    coupon:couponSlice,
    contact:contactSlice,
    user: UserSlice,
    reservation: reservationReducer,
    payment: paymentReducer,
    favorite:favoriteSlice,
    medias:mediaSlice,
    seo:seoSlice,
    blog:blogSlice,
    policies: policiesSlice,
    supportTicket: supportTicketSlice,
    kmPaketleri: kmPaketleriSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);



export const Store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
}, composeEnhancers(applyMiddleware()));

export const persistor = persistStore(Store);
