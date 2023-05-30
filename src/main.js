import {createApp} from 'vue'
import AppX from './App.vue'
import axios from "axios";
import VueAxios from "vue-axios";
import {routes} from "./routes";
import {createRouter, createWebHistory} from "vue-router";
import './assets/css/sb-admin-2.css';
import './assets/fontawesome/css/all.css';
import { App } from '@capacitor/app';

const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
    history: createWebHistory(),
    routes: routes
});

let appV = createApp(AppX);
appV.use(router);
appV.use(VueAxios, axios);
appV.mount('#app');

axios.defaults.headers.common['App-Request-Header'] = 'RadioRPi/Application/VueJS/Flutter';
appV.config.globalProperties.$axios = axios;
appV.config.globalProperties.$router = router;
appV.config.globalProperties.$apiUrl = 'https://api.ra1g.eu/';
//appV.config.globalProperties.$apiUrl = 'http://localhost:3000/';

App.addListener('backButton', ({ canGoBack }) => {
    if(canGoBack){
        window.history.back();
    } else {
        App.exitApp();
    }
});
import "bootstrap"