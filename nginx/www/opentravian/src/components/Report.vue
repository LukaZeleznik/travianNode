<template>
    <div class="container">
        <div class="row">
            <table class="table table-bordered" aria-describedby="report">
                <tbody>
                    <tr>
                        <th scope="col" class="text-center">Attacker</th>
                        <th scope="col" colspan="10" class="text-center">User AAA from village BBB</th>
                    </tr>
                    <tr>
                        <th scope="col" class="text-center"></th>
                        <th scope="col" class="text-center" v-for="index in 10" :key="index"><img :src="'/images/troops/'+reportData.tribeAttacker+'/'+index+'.gif'" :alt="index" /></th>
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
                            <img style="width: 1.2rem;height: 0.9rem;" :src="'/images/resources/'+resource+'.gif'" :alt="resource"> {{reportData["bounty"+resource]}}
                        </td>
                        <td class="text-center" colspan="2">0/0 (0%)</td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-bordered" aria-describedby="report">
                <tbody>
                    <tr>
                        <th scope="col" class="text-center">Defender</th>
                        <th scope="col" colspan="10" class="text-center">User XXX from village ZZZ</th>
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
</template>


<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { toolsMixins } from '@/mixins/toolsMixins'


export default {
    data() {
        return {
            
        };
    },

    props: ["reportData"],

    mixins: [toolsMixins,fetchMixins],

    created() {
    },

    methods: {
    }
}
</script>

<style>


</style>