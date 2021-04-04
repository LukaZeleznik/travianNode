<template>
    <div>
        <div class="table-responsive center mt-5" style="width: 70%;">
            <table class="table table-striped table-hover table-bordered border-dark">
                <thead>
                <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">Username</th>
                    <th scope="col">Villages</th>
                    <th scope="col">Population</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in stats" :key="index">
                        <th scope="row">{{ index+1 }}.</th>
                        <td width="80%">
                                <router-link :to="{ path: '/profile/' + user['_id'] }">
                                    {{ user['nickname'] }} 
                                        <template v-if="user['group']==9">
                                            <i class="bi bi-patch-check"></i>
                                        </template>
                                </router-link>
                        </td>
                        <td>{{ user['villages'] }}</td>
                        <td>{{ user['population'] }}</td>
                    </tr>
                </tbody>

            </table>
        </div>
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
                this.fetchReportNotifications();
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

<style scoped>
.center {
  margin-left: auto;
  margin-right: auto;
}
</style>