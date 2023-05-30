import RadioPage from "@/components/RadioPage";
import HomePage from "@/components/HomePage";
import RadioByCCPage from "@/components/RadioByCCPage";

export const routes = [
    {
        name: 'home',
        path: '/',
        component: HomePage,
    },
    {
        name: 'radiopage',
        path: '/radio/:station/:sid',
        component: RadioPage
    },
    {
        name: 'radiobyccpage',
        path: '/radios/:countrycode',
        component: RadioByCCPage
    },
]