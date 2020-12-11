<template>
    <div>
        <span v-for="(user, index) in stats" :key="index"><router-link :to="{ path: '/profile/' + user['_id'] }">{{ index+1 + '. ' + user['nickname'] + ' ' + user['population']}}</router-link><br></span>
    </div>
</template>


<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { toolsMixins } from '@/mixins/toolsMixins'


export default {
    data() {
        return {
            stats: {},
        };
    },

    mixins: [toolsMixins,fetchMixins],

    created() {
        this.loadMethods();
    },

    methods: {
        loadMethods(){
            if(this.checkIfLoggedIn(true)){
                this.getUsers();
            }
        },
        async getUsers(){
            let usersList = await(await(await this.doApiRequest("users", "GET", "", false)).json()).data
            this.stats = usersList.sort(comparePop);
        }
    }
}

function comparePop(a, b) {
    if ( a['population'] > b['population'] ) return -1;
    if ( a['population'] < b['population'] ) return 1;
    return 0;
}
</script>

