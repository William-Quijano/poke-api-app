<template>
    <div>
    <div>
        <VueSidebarMenuAkahon
            :menu-items="items" :profile-img="'https://picsum.photos/200/300'"
            profileName="William Quijano"
            :is-exit-button="false"
            :isSearch="false"
            menuTitle="DIPARVEL"
            menu-icon="bxl-tux"
            bgColor="#000000"
        />
    </div>
        <router-view></router-view>
    </div>
</template>
<script>
import VueSidebarMenuAkahon from "vue-sidebar-menu-akahon";



export default {

    name: 'component.vue',
    components: {'VueSidebarMenuAkahon':VueSidebarMenuAkahon},


    data() {
        return {
            items : []
        }
    },
    mounted() {
         this.items =[
             {link: '/#/pokemon',name: 'pokemon', tooltip: 'pokemon', icon:'bx-run'},
             {link: '/',name: 'home', tooltip: 'home', icon:'bx-home'},
                

             ]
    },
    methods :{

    }
}
</script>