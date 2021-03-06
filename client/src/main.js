import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import 'materialize-css/dist/js/materialize.min'
import router from './router'
import store from './store'
import dateFilter from '@/filters/date.filter'
import messagePlugin from '@/utils/message.plugin'
import Loader from '@/components/app/Loader'
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(messagePlugin)
Vue.use(Vuelidate)
Vue.filter('date', dateFilter)
Vue.component('Loader', Loader)

store.commit('setToken', localStorage.getItem('auth-token'))
store.commit('setUser', localStorage.getItem('user'))

new Vue({
    router,
    store,
    render: h => h(App),
    created: () => {
        axios.interceptors.request.use((config) => {
                const token = store.getters.token;
                if (token) {
                    config.headers.Authorization = token;
                } else {
                    router.push('/login');
                }
                return config;
            })
        axios.interceptors.response.use(
            response => {
                return response;
            },
            function(error) {
                if (error.response.status === 401) {
                    router.push('/login');
                }
                return Promise.reject(error.response);
            }
        );

    }}
    ).$mount('#app')
