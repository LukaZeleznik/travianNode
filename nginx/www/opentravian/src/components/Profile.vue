<template>
    <div v-if="!$route.params.uid">
        {{ userData['nickname'] }}
    </div>
    <div v-else>
        {{ userData['nickname'] }}
    </div>
</template>


<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { toolsMixins } from '@/mixins/toolsMixins'


export default {
    data() {
        return {
            userData: {},
        };
    },

    mixins: [toolsMixins,fetchMixins],

    created() {
        this.loadMethods();
    },

    methods: {
        async loadMethods(){
            if (this.checkIfLoggedIn(true)){
                console.log(this.$route.params.uid,this.getCookie('userId'));
                if (this.$route.params.uid){
                    this.userData = await this.getUser(this.$route.params.uid);
                } else {
                    this.userData = await this.getUser(this.getCookie('userId'));
                }                
                console.log(this.userData);
            }
        },
    }
}
</script>

