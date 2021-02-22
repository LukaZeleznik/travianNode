<template>
<div class="card">
    <div class="card-header" :id="'heading'+reportDataIndex">
    <h2 class="mb-0">
        <button class="btn btn-link collapsed d-block m-auto text-success font-weight-bold" type="button" data-toggle="collapse" :data-target="'#collapse'+reportDataIndex" aria-expanded="false" aria-controls="collapseTwo">
            {{reportData.idVillageAttacker}} vs. {{reportData.idVillageDefender}}
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
                                <th scope="col" colspan="10" class="text-center">User AAA from village {{reportData.idVillageAttacker}}</th>
                            </tr>
                            <tr>
                                <th scope="col" class="text-center"></th>
                                <th scope="col" class="text-center" v-for="index in 10" :key="index"><img :src="'/images/troops/'+reportData.tribeAttacker.toLowerCase()+'/'+index+'.gif'" :alt="index" /></th>
                            </tr>
                            <tr>
                                <th scope="col" class="text-center">Troops</th>
                                <td class="text-center" v-for="index in 10" :key="index">{{reportData["attTroop"+index]}}</td>
                            </tr>
                            <tr>
                                <th scope="col" class="text-center">Casualties</th>
                                <td class="text-center" v-for="index in 10" :key="index">{{reportData["attTroop"+index+"Casualty"]}}</td>
                            </tr>
                            <tr>
                                <th scope="col" class="text-center">Bounty</th>
                                <td class="text-center" colspan="2" v-for="resource in ['Wood','Clay','Iron','Crop']" :key="resource">
                                    <img style="width: 1.2rem;height: 0.9rem;" :src="'/images/resources/'+resource.toLowerCase()+'.gif'" :alt="resource"> {{reportData["bounty"+resource]}}
                                </td>
                                <td class="text-center" colspan="2">0/0 (0%)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered mb-0" aria-describedby="report">
                        <tbody>
                            <tr>
                                <th scope="col" class="text-center">Defender</th>
                                <th scope="col" colspan="10" class="text-center">User XXX from village {{reportData.idVillageDefender}}</th>
                            </tr>
                            <tr>
                                <th scope="col" class="text-center"></th>
                                <th scope="col" class="text-center" v-for="index in 10" :key="index"><img :src="'/images/troops/'+reportData.tribeDefender+'/'+index+'.gif'" :alt="index" /></th>
                            </tr>
                            <tr>
                                <th scope="col" class="text-center">Troops</th>
                                <td class="text-center" v-for="index in 10" :key="index">{{reportData["defTroop"+index]}}</td>
                            </tr>
                            <tr>
                                <th scope="col" class="text-center">Casualties</th>
                                <td class="text-center" v-for="index in 10" :key="index">{{reportData["defTroop"+index+"Casualty"]}}</td>
                            </tr>
                        </tbody>
                    </table>
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

    props: ["reportData","reportDataIndex"],

    mixins: [toolsMixins,fetchMixins],

    created() {
    },

    methods: {
    }
}
</script>

<style>

.table td, .table th {
    padding: .3rem;
}
@media only screen and (max-width: 600px) {
    th:first-child {
        display: none;
    }
}

</style>