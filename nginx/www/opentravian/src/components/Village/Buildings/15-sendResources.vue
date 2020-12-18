<template>
    <div>
        <div class="container">
            <div class="row mb-2">
                <div class="col-1"><img style="width: 1.5rem;height: 1rem;" src="/images/resources/wood.gif" /></div>
                <div class="col-2">
                    <input type="number" name="resource" class="form-control mr-2" min="0" aria-label="Small" id="resource0" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="col-1">
                    <a @click="insertResources(0);" href="#" style="color:green"><strong>(<span id="traderCapacity">3000</span>)</strong></a>
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
                    <a @click="insertResources(1);" href="#" style="color:green"><strong>(<span id="traderCapacity">3000</span>)</strong></a>
                </div>
                <div class="col-1"></div>
                <div class="col-1">Y:</div>
                <div class="col-2"><input type="number" class="form-control mr-2" min="0" aria-label="Small" id="yCoordinate" aria-describedby="inputGroup-sizing-sm"></div>
                <div class="col-1"></div>
                <div class="col-5"></div>
            </div>
            <div class="row mb-2">
                <div class="col-1"><img style="width: 1.5rem;height: 1rem;" src="/images/resources/iron.gif" /></div>
                <div class="col-2">
                    <input type="number" name="resource" class="form-control mr-2" min="0" aria-label="Small" id="resource2" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="col-1">
                    <a @click="insertResources(2);" href="#" style="color:green"><strong>(<span id="traderCapacity">3000</span>)</strong></a>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-1"><img style="width: 1.5rem;height: 1rem;" src="/images/resources/crop.gif" /></div>
                <div class="col-2">
                    <input type="number" name="resource" class="form-control mr-2" min="0" aria-label="Small" id="resource3" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="col-1">
                    <a @click="insertResources(3);" href="#" style="color:green"><strong>(<span id="traderCapacity">3000</span>)</strong></a>
                </div>
                <div class="col-2"></div>
                <div class="col-2">
                    <button type="button" class="btn btn-success" @click="sendResources()">Send</button> 
                </div>
            </div>
        </div>
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
        };
    },

    mixins: [
        fetchMixins,
        hasMixins,
        upgradeMixins,
        toolsMixins
        ],
    
    watch: {
    },

    created() {
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
                document.querySelector("#errorMessage").innerText = "Cannot send troops to the same village";
                return false;
            }
    
            if (wood == 0 && clay == 0 && iron == 0 && crop == 0){
                document.querySelector("#errorMessage").innerText = "You need to send at least one resource";
                return false;
            }

            let sendResourcesData = {
                "idVillageFrom": idVillageFrom,
                "idVillageTo": idVillageTo,
                "wood": wood,
                "clay": clay,
                "iron": iron,
                "crop": crop,
            }

            const sendResourcesDataJson = await(await this.doApiRequest('sendResources', 'POST', sendResourcesData, true)).json();

            if(sendResourcesDataJson.message == "sendResources success"){
                this.fetchVillageResources();
            }
            else{
                document.getElementById("errorMessage").innerText = sendResourcesDataJson.message;
            }
        },
    }
}
</script>