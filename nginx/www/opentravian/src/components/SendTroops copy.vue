<template>
  <div>
    <div class="container mt-5">
      <div class="justify-content-center text-center">
          <h1> Send Troops to VillageName2 1/1</h1><br />
          <br />
          <table class="table table-bordered w-100 m-auto" v-if="!isMobile()">
              <thead >
                  <tr>
                    <th scope="col">Clubswinger</th>
                    <th scope="col">Spearman</th>
                    <th scope="col">Axeman</th>
                    <th scope="col">Scout</th>
                    <th scope="col">Paladin</th>
                    <th scope="col">Teutonic Knight</th>
                    <th scope="col">Ram</th>
                    <th scope="col">Catapult</th>
                    <th scope="col">Chief</th>
                    <th scope="col">Settler</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-if="villageOwnTroops.length > 0">
                      <td class="align-middle" v-for="(villageOwnTroop, index) in villageOwnTroops" v-bind:key="index"> 
                          <div class="input-group input-group-sm align-middle">
                              <input :id="'troopInput'+index" type="number" class="form-control mr-2" min="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
                              <a href="#" v-on:click="insertTroopData(index)" style="color:green"><strong>({{villageOwnTroop}})</strong></a>
                          </div>
                      </td>
                  </tr>
              </tbody>
          </table>
          <div v-else>
            <table class="table table-bordered w-100 m-auto">
                <thead>
                    <tr>
                      <th scope="col">Clubswinger</th>
                      <th scope="col">Spearman</th>
                      <th scope="col">Axeman</th>
                      <th scope="col">Scout</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="align-middle">
                            <div class="input-group input-group-sm align-middle">
                                <input type="number" class="form-control mr-2" min="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
                                <a href="#" style="color:green"><strong>({{villageOwnTroops[0]}})</strong></a>
                            </div>
                        </td>
                        <td class="align-middle">
                            <div class="input-group input-group-sm align-middle">
                                <input type="number" class="form-control mr-2" min="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
                                <a href="#" style="color:green"><strong>({{villageOwnTroops[1]}})</strong></a>
                            </div>
                        </td>
                        <td class="align-middle">
                            <div class="input-group input-group-sm align-middle">
                                <input type="number" class="form-control mr-2" min="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
                                <a href="#" style="color:green"><strong>({{villageOwnTroops[2]}})</strong></a>
                            </div>
                        </td>
                        <td class="align-middle">
                            <div class="input-group input-group-sm align-middle">
                                <input type="number" class="form-control mr-2" min="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
                                <a href="#" style="color:green"><strong>({{villageOwnTroops[3]}})</strong></a>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-bordered w-100 m-auto">
                <thead>
                    <tr>
                      <th scope="col">Paladin</th>
                      <th scope="col">Teutonic Knight</th>
                      <th scope="col">Ram</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="align-middle">
                            <div class="input-group input-group-sm align-middle">
                                <input type="number" class="form-control mr-2" min="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
                                <a href="#" style="color:green"><strong>({{villageOwnTroops[4]}})</strong></a>
                            </div>
                        </td>
                        <td class="align-middle">
                            <div class="input-group input-group-sm align-middle">
                                <input type="number" class="form-control mr-2" min="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
                                <a href="#" style="color:green"><strong>({{villageOwnTroops[5]}})</strong></a>
                            </div>
                        </td>
                        <td class="align-middle">
                            <div class="input-group input-group-sm align-middle">
                                <input type="number" class="form-control mr-2" min="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
                                <a href="#" style="color:green"><strong>({{villageOwnTroops[6]}})</strong></a>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-bordered w-100 m-auto">
                <thead>
                    <tr>
                      <th scope="col">Catapult</th>
                      <th scope="col">Chief</th>
                      <th scope="col">Settler</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="align-middle">
                            <div class="input-group input-group-sm align-middle">
                                <input type="number" class="form-control mr-2" min="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
                                <a href="#" style="color:green"><strong>({{villageOwnTroops[7]}})</strong></a>
                            </div>
                        </td>
                        <td class="align-middle">
                            <div class="input-group input-group-sm align-middle">
                                <input type="number" class="form-control mr-2" min="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
                                <a href="#" style="color:green"><strong>({{villageOwnTroops[8]}})</strong></a>
                            </div>
                        </td>
                        <td class="align-middle">
                            <div class="input-group input-group-sm align-middle">
                                <input type="number" class="form-control mr-2" min="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
                                <a href="#" style="color:green"><strong>({{villageOwnTroops[9]}})</strong></a>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>
          <div class="dropdown mt-3 w-100">
              <button class="btn btn-danger dropdown-toggle w-50" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Full Attack
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <!--<a class="dropdown-item" id="ddItem1" href="#">Reinforcement</a>-->
                  <a class="dropdown-item" id="ddItem2" href="#">Full Attack</a>
                  <!--<a class="dropdown-item" id="ddItem3" href="#">Raid Attack</a>-->
              </div>                    
              <div class="btn-group w-50" role="group" aria-label="Train">
                  <button type="button" class="btn btn-success w-75 m-auto" id="sendType" @click="sendTroops()">Full Attack</button>
              </div>
          </div>
          <h5 class="mt-4 text-danger" id="errorMessage">
          </h5>
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
      villageOwnTroops : []
    };
  },

  mixins: [fetchMixins,toolsMixins],

  created() {
    this.fetchVillageOwnTroops();
  },

  methods: {
    async sendTroops(){

      let idVillageFrom = this.activeVillageId;
      let idVillageTo = await this.mapTileIdToIdVillage(this.$route.params.vid);

      if(idVillageFrom == idVillageTo){
        document.querySelector("#errorMessage").innerText = "Cannot send troops to the same village";
        return false;
      }

      console.log("idVillageFrom", idVillageFrom);
      console.log("idVillageTo", idVillageTo);

      let sendTroopsData = {
        "sendType": "full",
        "idVillageFrom": idVillageFrom,
        "idVillageTo": idVillageTo,
        "troopTribe": "teuton",
        "troop1num": 0,
        "troop2num": 0,
        "troop3num": 0,
        "troop4num": 0,
        "troop5num": 0,
        "troop6num": 0,
        "troop7num": 0,
        "troop8num": 0,
        "troop9num": 0,
        "troop10num": 0
      }

      let inputs = document.querySelectorAll("input[type=number]");

      for(let i = 1; i < 11; i++){
        if(inputs[i-1].value == "" || inputs[i-1].value < 0){ inputs[i-1].value = 0 }
        sendTroopsData["troop"+i+"num"] = inputs[i-1].value;
      }

      console.log(sendTroopsData);


      let sendTroopsResponse = await fetch('http://localhost:8080/api/sendTroops', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(sendTroopsData),
      });

      let sendTroopsDataJson = await sendTroopsResponse.json();

      console.log(sendTroopsDataJson);

      if(sendTroopsDataJson.message == "sendTroops success"){
        this.fetchVillageTroopMovements();
        this.$router.push({ name: 'resources' });
      }
      else{
        document.getElementById("errorMessage").innerText = sendTroopsDataJson.message;
      }
    },
    fetchVillageOwnTroops(){
      this.villageOwnTroops = this.$store.getters.getVillageOwnTroops;

      this.$store.dispatch('fetchVillageOwnTroops')
      .then( () => {
        this.villageOwnTroops = this.$store.getters.getVillageOwnTroops;
      });
    },
    isMobile() {
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
      }
      return false;
    },
    insertTroopData(index){
        document.querySelector("#troopInput"+index).value = this.villageOwnTroops[index];
    }
  }
}
</script>


<style>

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

</style>