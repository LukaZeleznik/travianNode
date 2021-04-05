<template>
    <div v-if="checkIfLoggedIn(false)">
        <div class="container mt-4 mb-4">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <div class="h2 text-center mb-5"><strong>Reports</strong></div>
                    <div class="accordion" id="accordion">
                        <template v-if="userReports.length>0">
                            <report v-bind:reportData="userReport" v-bind:reportDataIndex="index" v-for="(userReport, index) in userReports" v-bind:key="index"></report>
                        </template>
                        <template v-else>
                            <!-- Make it nicer.. -->
                            <center>No reports</center>
                        </template>
                    </div>
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
        };
    },

    mixins: [toolsMixins,fetchMixins],

    created() {
        this.loadMethods();
    },

    methods: {
        loadMethods(){
            if(this.checkIfLoggedIn(true)){
                this.fetchUserReports();
                this.fetchReportNotifications();
            }
        },
    }
}
</script>
