<template>
   <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <button class="navbar-toggler hidden" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <router-link class="navbar-brand" :to="{ name: 'login' }">TRAVIAN</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-center" id="navbarNav" v-if="checkIfLoggedIn(false)">
            <ul class="navbar-nav ">
                <li class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'resources' }">Resources</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'village' }">Village</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'map' }">Map</router-link>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Stats</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Reports</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Messages</a>
                </li>
            </ul>
        </div>
        <a class="navbar-brand" href="#" @click="logout()" v-if="checkIfLoggedIn()">Logout</a>
    </nav>
</template>

<script>
import { toolsMixins } from '@/mixins/toolsMixins'

export default {
    created() {     
    },

    mixins: [toolsMixins],

    methods: {
        logout() {   
            let state = this.$store.state;
            let newState = {};

            Object.keys(state).forEach(key => {
                newState[key] = []; // or = 
            });

            this.$store.replaceState(newState);
            localStorage.removeItem('activeVillageId');
            document.cookie = 'jwt=; Max-Age=-99999999;domain=localhost;path=/;';
            document.cookie = 'userId=; Max-Age=-99999999;domain=localhost;path=/;';
            this.$router.push({ name: 'login' });
        }
    }
}
</script>

<style>
@media (max-width: 600px) {
    .nav-item {
        font-size: 2em;
        width: 50%;
        text-align: center;
    }

    body > .container{
        padding: 0;
    }

    ul.navbar-nav{
        flex-direction: row;
        flex-wrap: wrap;
    }

    .navbar-toggler.hidden{
        visibility: hidden;
    }

    .navbar-toggler.hidden.collapsed{
        display: none;
    }
}
</style>
