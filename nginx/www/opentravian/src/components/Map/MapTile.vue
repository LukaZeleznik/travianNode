<template>  
    <div v-if="checkIfLoggedIn(false)">  
        <div class="container mt-4" v-if="villageData['_id']">
            <div class="row">
                <div class="col-md-8 col-sm-12 col-12">
                    <div class="h2 text-center mb-5">
                        <div class="h5">
                            <div class="h3 mt-3 text-center">Field distribution:</div>
                            <div class="text-center">
                                <h5>
                                    <img src="/images/resources/wood.gif" /> {{ fieldDistribution[0] }}  
                                    <img src="/images/resources/clay.gif" /> {{ fieldDistribution[1] }}  
                                    <img src="/images/resources/iron.gif" /> {{ fieldDistribution[2] }}  
                                    <img src="/images/resources/crop.gif" /> {{ fieldDistribution[3] }}  
                                </h5>
                            </div>
                        </div>
                    </div>
                    <div class="outerGrid">
                        <div class="grid">
                            <ul id="hexGrid" style="padding-left: 0px;">
                                <li class="hex" v-for="index in 22" :key="index">
                                    <div class=" " v-if="index == 1 || index == 5 || index == 19"></div>
                                    <div class="hexIn" v-else-if="index == 12">
                                        <div class="hexLink"></div>
                                    </div>
                                    <div class="hexIn" v-else>
                                        <div class="hexLink">
                                            <div class='img' v-bind:style="'background-color:' + fieldsColors[realIndexes[index]-1]">
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 text-center mb-3 rightSide">
                    <div>
                        <img v-if="villageData['owner']" style="width: 5rem;height: 5rem;" class="mt-5" src="/images/map/village.png">
                        <img v-else style="width: 5rem;height: 5rem; opacity: 1;" class="mt-5" src="/images/map/trees.svg">
                        <div class="h3 mt-3 text-center" v-if="villageData">
                            <span v-if="villageData['owner']">{{ villageData.name }}</span> 
                            <span v-else>Abandoned valley</span>
                            ({{ villageData.xCoordinate }}|{{ villageData.yCoordinate }})
                        </div>
                        <div class="h5 text-center">
                            <div v-if="villageData.owner">
                                <h5 style="text-transform: capitalize;">Tribe: {{ userData.tribe }}</h5>
                                <h5>Owner: <router-link :to="{ path: '/profile/' + userData['_id'] }">{{ userData.nickname }} <i v-if="userData.group==9" class="bi bi-patch-check-fill"></i></router-link></h5>
                                <h5>Population: {{ villageData.population }}</h5>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3" v-if="villageData['_id'] != activeVillageId">
                        <router-link v-if="villageData['owner'] == '' && canSettle || villageData['owner'] != ''" class="btn btn-success" :to="{ path: '/sendTroops/' + $route.params.tileid }">Send troops</router-link>
                        <button v-else class="btn btn-secondary" style="cursor: default">No available units</button>
                    </div>
                    <div class="mt-3" v-if="villageData['_id'] != activeVillageId && villageData['owner'] != ''">
                        <router-link v-if="canSendResources" class="btn btn-success" :to="{ path: '/villageBuilding/'+marketplaceFieldId, query: { xCoordinate: villageData['xCoordinate'], yCoordinate: villageData['yCoordinate']}}">Send resources</router-link>
                        <button v-else class="btn btn-secondary" style="cursor: default">Missing Marketplace</button>
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
                realIndexes: [1,1,1,2,3,3,4,5,6,7,8,9,10,10,11,12,13,14,15,16,16,17,18],
                fields: [],
                fieldsColors: [],
                userData: [],
                villageData: [],
                fieldDistribution: [0,0,0,0],
                canSettle: false,
                canSendResources: false,
                marketplaceFieldId: 0,
            };
        },

        watch:{
            'villageOwnTroops': function() { this.hasSettlers(); }
        },

        mixins: [fetchMixins,toolsMixins],

        created(){
            this.getFieldData();
            this.fetchVillageOwnTroops();
            this.hasMarketplace();
        },
        methods: {
            async getFieldData(){
                this.villageData = await(await(await this.doApiRequest("villages/" + this.$route.params.tileid,"GET","",false)).json()).data;
                
                const woodCount = this.resFieldVariationsInfoLookup[this.villageData['fieldVariation']]['woodCount'];
                const clayCount = this.resFieldVariationsInfoLookup[this.villageData['fieldVariation']]['clayCount'];
                const ironCount = this.resFieldVariationsInfoLookup[this.villageData['fieldVariation']]['ironCount'];
                const cropCount = this.resFieldVariationsInfoLookup[this.villageData['fieldVariation']]['cropCount'];

                this.fields = this.resFieldVariationsInfoLookup[this.villageData['fieldVariation']]['variation'];
                this.fieldsColors = this.fields.map(type => {
                    switch(type) {
                        case 0: return "Green";
                        case 1: return "Orange"; 
                        case 2: return "Silver"; 
                        case 3: return "Gold";
                        default: return "White";
                    }
                });

                this.fieldDistribution = [woodCount,clayCount,ironCount,cropCount];

                if(this.villageData.owner){
                    this.userData = await(await(await this.doApiRequest("users/" + this.villageData.owner,"GET","",false)).json()).data;
                }
            },  
            hasSettlers(){
                this.canSettle = this.villageOwnTroops[9] >= 3 ? true : false;
            },
            async hasMarketplace(){
                const villageBuildingFields = await(await(await this.doApiRequest("villageBuildingFields/" + this.activeVillageId, "GET", "", false)).json()).data;
                for(let i = 1; i <= Object.keys(villageBuildingFields).length; i++){
                    if(villageBuildingFields['field'+i+'Type'] == 15){ //Marketplace
                        if (villageBuildingFields['field'+i+'Level']>0) {
                            this.marketplaceFieldId = i;
                            this.canSendResources = true;
                        }
                        break;
                    }
                }
            },
        }

    }
</script>