<template>
<div>
    <div class="container mt-5">
        <div class="justify-content-center text-center">
            <h1 class="mb-5" v-if="villageData['owner'] == ''"> Settle new village at Abandoned valley
                {{ '(' + villageData['xCoordinate'] + '|' + villageData['yCoordinate'] + ')' }}
            </h1>
            <h1 class="mb-5" v-else> Send troops to
                {{ villageData['name'] }}
                {{ '(' + villageData['xCoordinate'] + '|' + villageData['yCoordinate'] + ')' }}
            </h1>
            
        </div>
        <div class="row justify-content-center">
            <div class="table-responsive col-lg-10 col-md-12 card">
                <table class="table" aria-describedby="report">
                    <tbody>
                        <tr>
                            <th scope="col" class="text-center" v-for="index in 5" :key="index"><img class="troopIcon" :src="'/images/troops/'+userTribe+'/'+index+'.gif'" :alt="index" /></th>
                        </tr>
                        <tr>
                            <td class="text-center" v-for="index in 5" v-bind:key="index">
                                <input :disabled="villageData['owner'] == ''" type="number" class="form-control mr-2 text-center" min="0" aria-label="Small" :id="'troop' + index" aria-describedby="inputGroup-sizing-sm">
                                <div class="pt-1" @click="insertTroops(index);" href="#" style="color:green; cursor: pointer"><strong>(<span :id="'maxTroops' + index">{{ villageOwnTroops[index-1] }}</span>)</strong></div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="col" class="text-center" v-for="index in 5" :key="index"><img class="troopIcon" :src="'/images/troops/'+userTribe+'/'+(index+5)+'.gif'" :alt="index" /></th>
                        </tr>
                        <tr>
                            <td class="text-center" v-for="index in 5" v-bind:key="index">
                                <input :disabled="villageData['owner'] == ''" type="number" class="form-control mr-2 text-center" min="0" aria-label="Small" :id="'troop' + (index+5)" aria-describedby="inputGroup-sizing-sm">
                                <div class="pt-1" @click="insertTroops(index+5);" href="#" style="color:green; cursor: pointer"><strong>(<span :id="'maxTroops' + (index+5)">{{ villageOwnTroops[index+4] }}</span>)</strong></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-responsive col-lg-10 col-md-12 card mt-3 p-3">
                <div class="row justify-content-left ml-1">
                    <div class="">
                        <div v-if="villageData['owner'] == ''" class="form-check">
                            <input class="form-check-input" type="radio" id="sendTroopsSettle" name="attackType" value="settle" :disabled="villageData['owner'] == ''">
                            <label class="form-check-label" for="sendTroopsSettle">
                                Settle new village
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" id="sendTroopsReinf" name="attackType" value="reinf" :disabled="villageData['owner'] == ''">
                            <label class="form-check-label" for="sendTroopsReinf">
                                Reinforcement
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" id="sendTroopsAttack" name="attackType" value="attack" :disabled="villageData['owner'] == ''" :checked="villageData['owner'] != ''">
                            <label class="form-check-label" for="sendTroopsAttack">
                                Attack: Full
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" id="sendTroopsRaid" name="attackType" value="raid" :disabled="villageData['owner'] == ''">
                            <label class="form-check-label" for="sendTroopsRaid">
                                Attack: Raid
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-group col-lg-10 col-md-12 px-0 mt-1" role="group" aria-label="SendTroops">
                <button type="button" class="btn btn-success" id="sendType" @click="sendTroops()">Send</button>
            </div>
        </div>
        
        <h5 class="mt-4 text-danger" id="errorMessage"></h5>
    </div>
</div>
</template>

<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { toolsMixins } from '@/mixins/toolsMixins'

export default {
    data() {
        return {
            villageOwnTroops: [],
            villageData: [],
            userTribe: undefined,
        };
    },

    mixins: [fetchMixins, toolsMixins],

    created() {
        this.getVillageFromData();
        this.getVillageToData();
        this.fetchVillageOwnTroops();
    },

    methods: {
        async getVillageToData() {
            this.villageData = await (await (await this.doApiRequest("villages/" + this.$route.params.tileid, "GET", "", false)).json()).data;
        },
        async getVillageFromData() {
            this.userTribe = await this.getTribeFromIdVillage(this.activeVillageId);
        },
        insertTroops(id) {
            if (this.villageData['owner'] == '' && id != 10) return;
            document.getElementById("troop" + id).value = document.getElementById("maxTroops" + id).innerHTML;
        },
        async sendTroops() {
            const idVillageFrom = this.activeVillageId;
            const idVillageTo = await this.mapTileIdToIdVillage(this.$route.params.tileid);
            const attackType = document.querySelector('input[name="attackType"]:checked').value;

            if (idVillageFrom == idVillageTo) {
                document.querySelector("#errorMessage").innerText = "Cannot send troops to the same village";
                return false;
            }

            let sendTroopsData = {
                'sendType': attackType,
                'idVillageFrom': idVillageFrom,
                'idVillageTo': idVillageTo,
                'troopTribe': this.userTribe,
            }

            for (let i = 1; i < 11; i++) {
                let inputValue = document.querySelector('#troop' + i).value;
                if (inputValue == '' || inputValue < 0) {
                    inputValue = 0
                }
                sendTroopsData['troop' + i + 'num'] = inputValue;
            }

            const sendTroopsDataJson = await (await this.doApiRequest('sendTroops', 'POST', sendTroopsData, true)).json();

            if (sendTroopsDataJson.message == "sendTroops success") {
                this.fetchVillageTroopMovements();
                this.$router.push({
                    name: 'resources'
                });
            } else {
                document.getElementById("errorMessage").innerText = sendTroopsDataJson.message;
            }
        },
        /*
        isMobile() {
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true;
            }
            return false;
        },
        */
    }
}
</script>

<style scoped>
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;

    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }

    .troopIcon{
        width: 21px;
        height: 21px;
    }

</style>
