<template>
    <div class="container text-center">
        <form class="form-group w-50 m-auto" id="registerForm" action="#" onsubmit="return false">
            <h1 id="errorMessage" class="my-2"></h1>
            <h2 class="form-signin-heading" >Register</h2>
            <input type="email" id="inputEmail" name="email" class="form-control w-100 my-2 username-field input-lg" placeholder="test@test.com" required autofocus>
            <input type="password" id="inputPassword" name="password" class="form-control w-100 mb-2" placeholder="Password" required>
            <input type="text" id="inputNickname" name="nickname" class="form-control w-100 mb-2" placeholder="Nickname" required>
            <select id="inputTribe" name="tribe" class="form-control w-100 mb-2" placeholder="Teuton" required>
                <option value="teuton">Teuton</option>
            </select>
            <button class="btn btn-lg btn-primary btn-block" v-on:click="register()">Register</button>
            <router-link class="btn btn-lg btn-primary btn-block" :to="{ name: 'login' }">Login</router-link>
        </form>
        
    </div>
</template>

<script>
import { apiRequestMixins } from '@/mixins/apiRequestMixins' 
    export default {
        data() {
            return {
            }
        },

        mixins: [apiRequestMixins],

        methods: {
            async register() {
                let inputEmail  = document.querySelector('#inputEmail').value;
                let inputPassword  = document.querySelector('#inputPassword').value;
                let inputNickname  = document.querySelector('#inputNickname').value;
                let inputTribe  = document.querySelector('#inputTribe').value;

                if(!inputEmail || !inputPassword || !inputNickname || !inputTribe) return;

                let registerApiUrl = 'http://localhost/api/' + "register?email=" + inputEmail + "&password=" + inputPassword + "&nickname=" + inputNickname + "&tribe=" + inputTribe;

                let response = await(await(await fetch(registerApiUrl,{method: "POST"})).json());
                if(response.message == "Registration successful"){
                    this.$router.push({ name: 'login' });
                }
                else{
                    document.getElementById("errorMessage").innerText = response.message;
                }
            }
        }
    }

</script>
