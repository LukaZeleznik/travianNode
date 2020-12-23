<template>
    <div>
        <div class="container">
            <div class="row mb-2">
                <div class="col-1"><img style="width: 1.5rem;height: 1rem;" src="/images/resources/wood.gif" /></div>
                <div class="col-2">
                    <input type="number" name="resource" class="form-control mr-2" min="0" aria-label="Small" id="resource0" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="col-1">
                    <a @click="insertResources(0);" href="#" v-if="merchantInfoLookup[userTribe]" style="color:green"><strong>(<span id="traderCapacity">{{ merchantInfoLookup[userTribe]['capacity'] }}</span>)</strong></a>
                </div>
                <div class="col-1"></div>
                <div class="col-1">X:</div>
                <div class="col-2"><input type="number" class="form-control mr-2" min="0" aria-label="Small" id="xCoordinate" aria-describedby="inputGroup-sizing-sm"></div>
                <div class="col-5"></div>
            </div>
            <div class="row mb-2">
                <div class="col-1"><img style="width: 1.5rem;height: 1rem;" src="/images/resources/clay.gif" /></div>
                <div class="col-2">
                    <input type="number" name="resource" class="form-control mr-2" min="0" aria-label="Small" id="resource1" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="col-1">
                    <a @click="insertResources(1);" href="#" style="color:green"><strong>(<span id="traderCapacity">{{ merchantInfoLookup[userTribe]['capacity'] }}</span>)</strong></a>
                </div>
                <div class="col-1"></div>
                <div class="col-1">Y:</div>
                <div class="col-2"><input type="number" class="form-control mr-2" min="0" aria-label="Small" id="yCoordinate" aria-describedby="inputGroup-sizing-sm"></div>
                <div class="col-3">Merchants: {{ merchantsAvailable + " / " + merchantsTotal }}</div>
                <div class="col-3"></div>
            </div>
            <div class="row mb-2">
                <div class="col-1"><img style="width: 1.5rem;height: 1rem;" src="/images/resources/iron.gif" /></div>
                <div class="col-2">
                    <input type="number" name="resource" class="form-control mr-2" min="0" aria-label="Small" id="resource2" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="col-1">
                    <a @click="insertResources(2);" href="#" style="color:green"><strong>(<span id="traderCapacity">{{ merchantInfoLookup[userTribe]['capacity'] }}</span>)</strong></a>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-1"><img style="width: 1.5rem;height: 1rem;" src="/images/resources/crop.gif" /></div>
                <div class="col-2">
                    <input type="number" name="resource" class="form-control mr-2" min="0" aria-label="Small" id="resource3" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="col-1">
                    <a @click="insertResources(3);" href="#" style="color:green"><strong>(<span id="traderCapacity">{{ merchantInfoLookup[userTribe]['capacity'] }}</span>)</strong></a>
                </div>
                <div class="col-2"></div>
                <div class="col-2">
                    <button type="button" class="btn btn-success" @click="sendResources()">Send</button> 
                </div>
            </div>
        </div><br>
        <table class="table table-bordered m-auto" v-if="villageOutgoingResources.length > 0">
            <thead >
                <tr>
                    <th scope="col">Outgoing Merchants</th>
                    <th scope="col">To</th>
                    <th scope="col" style="max-width:150px">Time left</th>
                    <th scope="col">Arriving</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(outgoingResource, index) in villageOutgoingResources" :key="index">
                    <th scope="row" class="align-middle">
                        <img style="width: 1.5rem;height: 1rem;" src="/images/resources/wood.gif" /> {{ outgoingResource.wood }} | 
                        <img style="width: 1.5rem;height: 1rem;" src="/images/resources/clay.gif" /> {{ outgoingResource.clay }} |
                        <img style="width: 1.5rem;height: 1rem;" src="/images/resources/iron.gif" /> {{ outgoingResource.iron }} |
                        <img style="width: 1.5rem;height: 1rem;" src="/images/resources/crop.gif" /> {{ outgoingResource.crop }}
                    </th>
                    <td>{{ outgoingResource.villageToName }}</td>
                    <td class="align-middle">
                        <span class="trainCD" v-if="villageOutgoingResourcesTimeLeft>0">{{ secondsToTimeRemaining(villageOutgoingResourcesTimeLeft[index]*1000) }}</span>
                    </td>
                    <td class="align-middle">
                        {{ secondsToTimeCompleted(outgoingResource.timeArrived*1000) }}
                    </td>
                </tr>
            </tbody>
        </table><br>
        <table class="table table-bordered m-auto" v-if="villageIncomingResources.length > 0">
            <thead >
                <tr>
                    <th scope="col">Incoming Merchants</th>
                    <th scope="col">From</th>
                    <th scope="col" style="max-width:150px">Time left</th>
                    <th scope="col">Arriving</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(incomingResource, index) in villageIncomingResources" :key="index">
                    <th scope="row" class="align-middle">
                        <img style="width: 1.5rem;height: 1rem;" src="/images/resources/wood.gif" /> {{ incomingResource.wood }} | 
                        <img style="width: 1.5rem;height: 1rem;" src="/images/resources/clay.gif" /> {{ incomingResource.clay }} |
                        <img style="width: 1.5rem;height: 1rem;" src="/images/resources/iron.gif" /> {{ incomingResource.iron }} |
                        <img style="width: 1.5rem;height: 1rem;" src="/images/resources/crop.gif" /> {{ incomingResource.crop }}
                        <span v-if="incomingResource.return"> (return)</span>
                    </th>
                    <td>{{ incomingResource.villageFromName }}</td>
                    <td class="align-middle">
                        <span class="trainCD" v-if="villageIncomingResourcesTimeLeft>0">{{ secondsToTimeRemaining(villageIncomingResourcesTimeLeft[index]*1000) }}</span>
                    </td>
                    <td class="align-middle">
                        {{ secondsToTimeCompleted(incomingResource.timeArrived*1000) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { hasMixins } from '@/mixins/hasMixins'
import { upgradeMixins } from '@/mixins/upgradeMixins'
import { toolsMixins } from '@/mixins/toolsMixins'

export default {
    data() {
        return {
            villageOutgoingResourcesTimeLeft: [],
            villageIncomingResourcesTimeLeft: [],
            merchantsAvailable: 0,
            merchantsTotal: 0,
        };
    },

    mixins: [
        fetchMixins,
        hasMixins,
        upgradeMixins,
        toolsMixins
        ],
    
    watch: {
        '$store.getters.getVillageOutgoingResources': function (){
            this.villageOutgoingResources = this.$store.getters.getVillageOutgoingResources;
            for(let i = 0; i < this.villageOutgoingResources.length; i++){
                this.villageOutgoingResourcesTimeLeft[i] = this.villageOutgoingResources[i].timeArrived - Math.floor(new Date().getTime()/1000);
            }
        },
        '$store.getters.getVillageIncomingResources': function (){
            this.villageIncomingResources = this.$store.getters.getVillageIncomingResources;
            for(let i = 0; i < this.villageIncomingResources.length; i++){
                this.villageIncomingResourcesTimeLeft[i] = this.villageIncomingResources[i].timeArrived - Math.floor(new Date().getTime()/1000);
            }
        }
    },

    created() {
        this.fetchVillageResourceMovements();
        this.startCountdownIntervals();
        this.getMerchantAvailability();
    },

    methods: {
        insertResources(id){        
            document.getElementById("resource"+id).value = Number(document.getElementById("resource"+id).value) + Number(document.getElementById("traderCapacity").innerHTML);
        },
        async sendResources(){
            const idVillageFrom = this.activeVillageId;
            const xCoordinate = document.getElementById("xCoordinate").value;
            const yCoordinate = document.getElementById("yCoordinate").value;
            const wood = Number(document.getElementById("resource0").value);
            const clay = Number(document.getElementById("resource1").value);
            const iron = Number(document.getElementById("resource2").value);
            const crop = Number(document.getElementById("resource3").value);

            if (xCoordinate == "" || yCoordinate == "") {
                document.querySelector("#errorMessage").innerText = "Coordinates are required";
                return false;
            }

            const idVillageToResponse = await(await this.doApiRequest("villages/coords/" + xCoordinate + "/" + yCoordinate, "GET", "", false)).json();
            if (idVillageToResponse.status != 'success'){
                document.querySelector("#errorMessage").innerText = idVillageToResponse.message;
                return false;
            }
            const idVillageTo = idVillageToResponse.data._id;

            if(idVillageFrom == idVillageTo){
                document.querySelector("#errorMessage").innerText = "Cannot send resources to the same village";
                return false;
            }
    
            if (wood == 0 && clay == 0 && iron == 0 && crop == 0){
                document.querySelector("#errorMessage").innerText = "You need to send at least one resource";
                return false;
            }

            let sendResourcesData = {
                "sendType": "sendResources",
                "idVillageFrom": idVillageFrom,
                "idVillageTo": idVillageTo,
                "wood": wood,
                "clay": clay,
                "iron": iron,
                "crop": crop,
            }

            const sendResourcesDataJson = await(await this.doApiRequest('sendResources', 'POST', sendResourcesData, true)).json();

            if(sendResourcesDataJson.message == "sendResources success"){
                this.fetchVillageResourceMovements();
                this.resetFields();
                this.fetchVillageResources();
                this.getMerchantAvailability();
            }
            else{
                document.getElementById("errorMessage").innerText = sendResourcesDataJson.message;
            }
        },
        startCountdownIntervals(){
            var outgoingIntervals = setInterval( ()=> {
                for(let i = 0; i < this.villageOutgoingResourcesTimeLeft.length; i++){
                    this.$set(this.villageOutgoingResourcesTimeLeft, i, this.villageOutgoingResourcesTimeLeft[i] - 1);
                    if(this.villageOutgoingResourcesTimeLeft[i] <= 0){
                        this.fetchVillageResources();
                        this.fetchVillageResourceMovements();
                        this.getMerchantAvailability();
                        clearInterval(outgoingIntervals);
                    }
                }
            }, 1000);
            var incomingIntervals = setInterval ( ()=> {
                for(let i = 0; i < this.villageIncomingResourcesTimeLeft.length; i++){
                    this.$set(this.villageIncomingResourcesTimeLeft, i, this.villageIncomingResourcesTimeLeft[i] - 1);
                    if(this.villageIncomingResourcesTimeLeft[i] <= 0){
                        this.fetchVillageResources();
                        this.fetchVillageResourceMovements();
                        this.getMerchantAvailability();
                        clearInterval(incomingIntervals);
                    }
                }
            }, 1000);
        },
        resetFields(){
            document.getElementById("xCoordinate").value = "";
            document.getElementById("yCoordinate").value = "";
            document.getElementById("resource0").value = "";
            document.getElementById("resource1").value = "";
            document.getElementById("resource2").value = "";
            document.getElementById("resource3").value = "";
        },
        async getMerchantAvailability(){
            this.merchantsAvailable = await(await(await this.doApiRequest("villages/" + this.activeVillageId, "GET", "", false)).json()).data.merchantsAvailable;
            this.merchantsTotal = this.buildingInfoLookup[this.$parent.villageBuildingType]['buildingModifier'][this.$parent.villageBuildingLevel];
        }
    }
}
</script>