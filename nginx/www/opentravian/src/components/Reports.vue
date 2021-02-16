<template>
    <div v-if="checkIfLoggedIn(false)">
        <div class="container mt-4">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <div class="h2 text-center mb-5"><strong>Reports</strong></div>
                    <report v-bind:reportsData="reportsData[0]"></report>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { toolsMixins } from '@/mixins/toolsMixins'


export default {
    data() {
        return {
            reportsData: []
        };
    },

    mixins: [toolsMixins,fetchMixins],

    created() {
        this.loadMethods();
    },

    methods: {
        loadMethods(){
            if(this.checkIfLoggedIn(true)){
                this.getReports();
            }
        },
        async getReports(){
            this.reportsData.push({"0":0,"1":1})
        }
    }
}
</script>

