import {createApp} from 'vue'
import App from './App.vue'

//import axios
import axios from "axios";
import vueAxios from 'vue-axios'


//import router

import {createRouter,createWebHashHistory} from 'vue-router'
import {routes} from './router'

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
  })


// sliderbar configuration
import VueSidebarMenuAkahon from "vue-sidebar-menu-akahon";


//sweetalert import
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const app = createApp(App)
app.use(router)
app.use(vueAxios,axios)
app.use(VueSweetalert2)
app.component('vue-sidebar-menu-akahon', VueSidebarMenuAkahon);
app.mount('#app')

