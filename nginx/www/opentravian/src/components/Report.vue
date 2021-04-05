<template>
<div class="card">
    <div class="card-header" :id="'heading'+reportDataIndex">
    <h2 class="mb-0">
        <button class="btn btn-link collapsed d-block m-auto text-success" v-bind:style="reportData.readFlag>0 ? '' : 'font-weight: bold;' " v-on:click="changeReadFlag(true)" type="button" data-toggle="collapse" :data-target="'#collapse'+reportDataIndex" aria-expanded="false" aria-controls="collapseTwo">
            <img style="width: 1rem;height: 1rem;" :src="'/images/reports/' + reportData.type + '.gif'"> {{villageDataAttacker.name}} {{reportTypeStr(reportData.type)}} {{villageDataDefender.name}} ({{date}} at {{time}})
        </button>
    </h2>
    </div>
    <div :id="'collapse'+reportDataIndex" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
        <div class="container">
            <div class="row">
                <div class="table-responsive">
                    <table class="table table-bordered" aria-describedby="report">
                        <tbody>
                            <tr>
                                <th scope="col" class="text-center">Attacker</th>
                                <th scope="col" colspan="10" class="text-center"><router-link :to="'/profile/'+ villageDataAttacker.owner" v-bind:class="'text-success'">{{userDataAttacker.nickname}}</router-link> from the village <router-link :to="'/map/'+ villageDataAttacker.mapTileId" v-bind:class="'text-success'">{{villageDataAttacker.name}}</router-link></th>
                            </tr>
                            <tr>
                                <th scope="col" class="text-center"></th>
                                <th scope="col" class="text-center" v-for="index in 10" :key="index"><img :src="'/images/troops/'+reportData.tribeSender.toLowerCase()+'/'+index+'.gif'" :alt="index" /></th>
                            </tr>
                            <tr>
                                <th scope="col" class="text-center">Troops</th>
                                <td class="text-center" v-bind:style="reportData['attTroop'+index]>0 ? '' : 'color: lightgrey;'" v-for="index in 10" :key="index">{{ reportData["attTroop"+index] }}</td>
                            </tr>
                            <tr v-if="reportData.type!='reinf'">
                                <th scope="col" class="text-center">Casualties</th>
                                <td class="text-center" v-bind:style="reportData['attTroop'+index+'Casualty']>0 ? '' : 'color: lightgrey;'" v-for="index in 10" :key="index">{{ reportData["attTroop"+index+"Casualty"] }}</td>
                            </tr>
                            <tr v-if="reportData.type!='reinf'">
                                <th scope="col" class="text-center">Survived</th>
                                <td class="text-center" v-bind:style="reportData['attTroop'+index]-reportData['attTroop'+index+'Casualty']>0 ? '' : 'color: lightgrey;'" v-for="index in 10" :key="index">{{ reportData['attTroop'+index]-reportData["attTroop"+index+"Casualty"] }}</td>
                            </tr>
                            <tr v-if="reportData.type!='reinf'">
                                <th scope="col" class="text-center">Bounty</th>
                                <td class="text-center" colspan="2" v-for="resource in ['Wood','Clay','Iron','Crop']" :key="resource">
                                    <img style="width: 1.2rem;height: 0.9rem;" :src="'/images/resources/'+resource.toLowerCase()+'.gif'" :alt="resource"> {{reportData["bounty"+resource]}}
                                </td>
                                <td v-if="reportData.bountyMax>0" class="text-center" colspan="2">{{reportData.bountyTotal}} / {{reportData.bountyMax}} ({{Math.round(reportData.bountyTotal/reportData.bountyMax*100)}}%)</td>
                                <td v-else class="text-center" colspan="2">0 / 0 (0%)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="table-responsive" v-if="reportData.type!='reinf'">
                    <table class="table table-bordered mb-0" aria-describedby="report">
                        <tbody>
                            <tr>
                                <th scope="col" class="text-center">Defender</th>
                                <th scope="col" colspan="10" class="text-center"><router-link :to="'/profile/'+ villageDataDefender.owner" v-bind:class="'text-success'">{{userDataDefender.nickname}}</router-link> from the village <router-link :to="'/map/'+ villageDataDefender.mapTileId" v-bind:class="'text-success'">{{villageDataDefender.name}}</router-link></th>
                            </tr>
                            <tr>
                                <th scope="col" class="text-center"></th>
                                <th scope="col" class="text-center" v-for="index in 10" :key="index"><img :src="'/images/troops/'+reportData.tribeReceiver+'/'+index+'.gif'" :alt="index" /></th>
                            </tr>
                            <tr>
                                <th scope="col" class="text-center">Troops</th>
                                <td class="text-center" v-bind:style="reportData['defTroop'+index]>0 ? '' : 'color: lightgrey;'" v-for="index in 10" :key="index">{{ reportData["defTroop"+index] }}</td>
                            </tr>
                            <tr>
                                <th scope="col" class="text-center">Casualties</th>
                                <td class="text-center" v-bind:style="reportData['defTroop'+index+'Casualty']>0 ? '' : 'color: lightgrey;'" v-for="index in 10" :key="index">{{ reportData["defTroop"+index+"Casualty"] }}</td>
                            </tr>
                            <tr>
                                <th scope="col" class="text-center">Survived</th>
                                <td class="text-center" v-bind:style="reportData['defTroop'+index]-reportData['defTroop'+index+'Casualty']>0 ? '' : 'color: lightgrey;'" v-for="index in 10" :key="index">{{ reportData["defTroop"+index]-reportData["defTroop"+index+"Casualty"] }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <h4 class="mt-1">
                    <span style="float: left;padding-right: 20px;padding-left: 10px;cursor: pointer;white-space: nowrap;" v-on:click="deleteReport(reportData['_id'])" class="bi bi-trash" title="Delete report"></span>
                    <span style="float: left;cursor: pointer;white-space: nowrap;" class="bi bi-envelope" v-on:click="changeReadFlag(false)" title="Mark report as unread" data-toggle="collapse" :data-target="'#collapse'+reportDataIndex"></span>
                </h4>
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
            villageDataAttacker: {},
            villageDataDefender: {},
            userDataAttacker: {},
            userDataDefender: {},
            date: null,
            time: null,
        };
    },

    props: ["reportData","reportDataIndex"],

    mixins: [toolsMixins,fetchMixins],

    created() {
        this.getVillageAndOwnerData();
        this.getDateTime();
    },

    methods: {
        async getVillageAndOwnerData(){
            this.villageDataAttacker = await this.getVillageData(this.reportData.idVillageSender);
            this.villageDataDefender = await this.getVillageData(this.reportData.idVillageReceiver);
            this.userDataAttacker = await this.getUser(this.villageDataAttacker.owner);
            this.userDataDefender = await this.getUser(this.villageDataDefender.owner);
        },
        getDateTime(){
            const currentDate = new Date();
            const date = new Date(this.reportData.time*1000);

            if (currentDate.getDate()==date.getDate() && currentDate.getMonth()==date.getMonth() && currentDate.getFullYear()==date.getFullYear()) {
                this.date = "Today";
            } else if (currentDate.getDate()+1==date.getDate() && currentDate.getMonth()==date.getMonth() && currentDate.getFullYear()==date.getFullYear()) {
                this.date = "Yesterday";
            } else {
                let dd = String(date.getDate()).padStart(2, '0');
                let mm = String(date.getMonth() + 1).padStart(2, '0');
                let yyyy = date.getFullYear();
                this.date = dd + '/' + mm + '/' + yyyy;
            }

            let h = (date.getHours()<10?'0':'') + date.getHours();
            let m = (date.getMinutes()<10?'0':'') + date.getMinutes();
            let s = (date.getSeconds()<10?'0':'') + date.getSeconds();
            this.time = h + ':' + m + ':' + s;
        },
        reportTypeStr(type){
            switch (type) {
                case "attack":  return "attacked";
                case "reinf":   return "reinforced";
                default:
                    break;
            }
        },
        async changeReadFlag(readFlag){
            this.reportData['readFlag'] = readFlag;
            await this.doApiRequest('reports/' + this.reportData._id, 'PATCH', this.reportData, true);
            this.fetchReportNotifications();
        },
        async deleteReport(report) {
            const deleteReport = await(await this.doApiRequest("reports/" + report, "DELETE", "", false)).json();

            if(deleteReport.status == "success"){
                this.fetchUserReports();
            }
        }
    }
}
</script>

<style scoped>

.table td, .table th {
    padding: .3rem;
}
@media only screen and (max-width: 600px) {
    th:first-child {
        display: none;
    }
}

</style>