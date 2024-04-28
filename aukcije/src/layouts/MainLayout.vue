<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <router-link to="/" class="link-style">
            <q-avatar>
              <img src="~assets\aukcije_logo.jpg" alt="Logo" />
            </q-avatar>
          </router-link>
        </q-toolbar-title>
        <q-space></q-space>
        <q-space /><q-space /><q-space /><q-space /><q-space /><q-space /><q-space /><q-space />

        <!-- Prijava i registracija samo ako korisnik nije prijavljen -->
         <!-- Prikazivanje gumba na temelju stanja autentikacije -->
         <template v-if="!isAuthenticated()">
          <router-link to="/prijava">
            <q-btn label="Prijava" color="primary" class="q-mr-md" />
          </router-link>

          <router-link to="/registracija">
            <q-btn label="Registracija" color="primary" class="q-mr-md" />
          </router-link>
        </template>

        <template v-if="isAuthenticated()">
          <q-btn label="Odjava" color="negative" class="q-mr-md" @click="confirmLogout" />
          <q-item-section avatar>
            <q-icon name="logout" color="negative" />
          </q-item-section>
        </template>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header class="text-bold text-black"> Mogućnosti </q-item-label>

        <div class="q-pa-sm col">
          <!--        Za navigaciju bez otvaranja novog tab-a-->
          <template v-if="!isAuthenticated()">
            <div class="q-pa-sm col">
              <router-link to="/prijava" class="link-style" @click="toggleLeftDrawerClose">
                <q-btn class="flex flex-center" style="width: 280px" icon= "login"> Prijava </q-btn>
              </router-link>
            </div>
            <div class="q-pa-sm col">
              <router-link to="/registracija" class="link-style" @click="toggleLeftDrawerClose">
                <q-btn class="flex flex-center" style="width: 280px" icon= "person_add"> Registracija </q-btn>
              </router-link>
            </div>
          </template>
          <div class="q-pa-sm col">
            <router-link to="/" class="link-style" @click="toggleLeftDrawerClose">
              <q-btn class="flex flex-center" style="width: 280px" icon= "home" color="primary"> Početna stranica </q-btn>
          
            </router-link>
          </div>
          <template v-if="isAuthenticated()">
          <div class="q-pa-sm col">
  <router-link to="/postavi" class="link-style" @click="toggleLeftDrawerClose">
    <q-btn
      icon="add_circle" 
      color= "primary" 
      label="Dodaj aukciju"  
      class="flex flex-center"
      style="width: 280px"
    />
  </router-link>
</div>
<div class="q-pa-sm col">
            <router-link to="/Moj_profil" class="link-style" @click="toggleLeftDrawerClose">
              <q-btn class="flex flex-center" style="width: 280px" icon= "account_circle"> Moj profil </q-btn>
            </router-link>
          </div>
</template>

          
          <template v-if="isAdmin()">
            <div class="q-pa-sm col">
              <router-link to="/admin/" class="link-style" @click="toggleLeftDrawer">
                <q-btn class="flex flex-center" color="primary" style="width: 280px">Admin Dashboard</q-btn>
              </router-link>
            </div>
          </template>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Logout Confirmation Dialog -->
    <q-dialog v-model="confirmLogoutDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Jeste li sigurni da želite se odjaviti?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" color="primary" v-close-popup />
          <q-btn flat label="Odjavi se" color="negative" @click="logoutAndReload" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>

  <section class="footer">
    <div class="footer-container container">
      <div class="footer-box">
        <a href="#" class="aukcije_logo"><span>Aukcije</span></a>
    
      </div>
      <div class="footer-box">
        <h3>Stranica</h3>
        <a href="#">Početna</a>
        <router-link to="/prijava" class="link-style">
            <div>Prijava</div>
        </router-link>
        <router-link to="/registracija" class="link-style">
            <div>Registracija</div>
        </router-link>
      </div>
      <div class="footer-box">
        <h3>Saznaj više</h3>
        <a href="#">FAQ</a>
        <a href="#">Refund policy</a>

      </div>
      <div class="footer-box">
        
        <p>Hrvatska</p>
      </div>

    </div>
  </section>

</template>


<script>
//import { defineComponent } from 'vue';
import axios from 'axios';

import { defineComponent, ref, computed } from "vue";
import { jwtDecode } from "jwt-decode";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const leftDrawerOpen = ref(false);
    const confirmLogoutDialog = ref(false);

    const token = ref(localStorage.getItem("token"));

    const decodeToken = (token) => {
      try {
        const decoded = jwtDecode(token);
        return decoded.uloga;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    };

    const isAdmin = () => {
      if (isAuthenticated() && token.value) {
        return decodeToken(token.value) === "admin";
      }
      return false;
    };

    const isAuthenticated = () => {
      const token = localStorage.getItem("token");
      return !!token;
    };

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const toggleLeftDrawerClose = () => {
      leftDrawerOpen.value = false;
    };

    const confirmLogout = () => {
      confirmLogoutDialog.value = true;
    };

    const logoutAndReload = () => {
      // Clear JWT token from local storage
      localStorage.removeItem("token");
      // Reload the page
      window.location.reload();
    };

    return {
      leftDrawerOpen,
      confirmLogoutDialog,
      isAuthenticated,
      isAdmin,
      toggleLeftDrawer,
      toggleLeftDrawerClose,
      confirmLogout,
      logoutAndReload,
    };
  },
});
</script>

<style scoped>

/* Osnovni stilovi za drawer */
.drawer-style {
  background-color: #fafafa;
  border-right: 1px solid #ddd;
  width: 280px;
}

/* Stil za zaglavlje izbornika */
.drawer-header {
  color: #3f51b5;
  padding: 10px;
  text-transform: uppercase;
  font-weight: bold;
}

/* Stilizacija stavki u draweru, s plavim linijama na dnu */
.q-item {
  padding: 18px;
  color: #5c5a5a;
  border: 1px solid #2479d9; /* Plava linija na dnu */
  
}
.q-item:hover {
  background-color: #e0e0e0; /* Svijetlo-siva boja prilikom hovera */
  color: #3f51b5; /* Plava boja teksta */
  cursor: pointer; /* Promjena pokazivača na ruku */
  transition: all 0.3s ease-in-out; /* Dodavanje glatke tranzicije */}

/* Stil za razdvajanje stavki (spacers) */
.spacer {
  height: 16px;
}

/* Stilizacija za avatar i logotip */
.q-avatar {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 0.3s, filter 0.3s; /* Efekti prijelaza za hover */
}

/* Efekt hovera za avatar/logotip */
.q-avatar:hover {
  transform: scale(1.1);
  filter: brightness(1.2); 
}

/* Stilovi za linkove */
.link-style {
  text-decoration: none;
  color: inherit;
}
.footer {
    background: #2479d9;
    color: #e0e3ec;
    border-top: 2px solid var(--main-color);
    padding: 0.1rem 2rem;
}

.footer-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
}

.footer-container .footer-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 250px;
}

.footer-box h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #ffffff;
}

.footer-box a,
.footer-box p {
    color: #e0e3ec;
    text-decoration: none;
    margin-bottom: 10px;
}

.footer-box a:hover {
    color: #ffffff;
    text-decoration: underline;
}

.footer-button {
    background: #1e5faa;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    
}

.footer-button:hover {
    background: #124b8b;
}

.footer-social {
    display: flex;
    gap: 1rem;
}

.footer-social a {
    color: #e0e3ec;
    font-size: 1.5rem;
}

.footer-social a:hover {
    color: #ffffff;
}



</style>
