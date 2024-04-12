<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
  <router-link to="/">
    <q-avatar>
      <img src="~assets\aukcije_logo.jpg" alt="Logo">
    </q-avatar>
  </router-link>
</q-toolbar-title>


        <q-space></q-space>

        <q-input
          v-model="search"
          filled
          placeholder="Pretraga"
          dense
          class="w-200"
          @keyup.enter="searchItems"
        />

        <q-btn
          icon="search"
          color="primary"
          class="q-mr-md"
          @click="searchItems"
        />

        <q-btn
          icon="clear"
          color="primary"
          @click="clearSearch"
        />

        <div class="q-pa-md">
            <q-btn-dropdown color="primary" :label="selectedCategory">
              <q-list>
                <q-item clickable v-close-popup @click="onItemClick('Photos')">
                  <q-item-section>
                    <q-item-label>Kategorija 1</q-item-label>
                  </q-item-section>
                </q-item>
          
                <q-item clickable v-close-popup @click="onItemClick('Videos')">
                  <q-item-section>
                    <q-item-label>Kategorija 2</q-item-label>
                  </q-item-section>
                </q-item>
          
                <q-item clickable v-close-popup @click="onItemClick('Articles')">
                  <q-item-section>
                    <q-item-label>Kategorija 3</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        <q-btn
          icon="refresh"
          color="primary"
          @click="refresh"
        />

        <q-space />

        <router-link v-if="!loggedIn" to="/prijava" class="link-style">
          <q-btn label="Prijava" color="primary" class="q-mr-md" />
        </router-link>
        <router-link v-if="loggedIn" to="/" class="link-style">
          <q-btn label="Odjava" color="negative" class="q-mr-md" />
        </router-link>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <!-- Sadržaj lijevog drawer-a -->
      <q-list>
        <q-item-label header class="text-bold text-black">
          Mogućnosti
        </q-item-label>
        
        <div class="q-pa-sm col">
          <div class="q-pa-sm col">
            <q-btn class="flex flex-center" style="width: 280px">
              <router-link to="/prijava" class="link-style">
                Prijava
              </router-link>
            </q-btn>
          </div>
          <div class="q-pa-sm col">
            <q-btn class="flex flex-center" style="width: 280px">
              <router-link to="/registracija" class="link-style">
                Registracija
              </router-link>
            </q-btn>
          </div>
          <div class="q-pa-sm col">
            <q-btn class="flex flex-center" style="width: 280px">
              <router-link to="/" class="link-style">
                Početna stranica
              </router-link>
            </q-btn>
          </div>
          <div class="q-pa-sm col">
            <q-btn class="flex flex-center" style="width: 280px">
              <router-link to="postavi" class="link-style">
                Dodaj aukciju
              </router-link>
            </q-btn>
          </div>
          <div class="q-pa-sm col">
            <q-btn class="flex flex-center" style="width: 280px">
              <router-link to="/Moj_profil" class="link-style">
                Moj profil
              </router-link>
            </q-btn>
          </div>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import axios from "axios";

const baseUrl = "http://localhost:3306/api/";

export default defineComponent({
  name: "MainLayout",

  data() {
    return {
      leftDrawerOpen: false,
      loggedIn: false,
      search: "",
      selectedCategory: "",
    };
  },

methods: {
    // Metode za obradu događaja

    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },

    refresh() {
      // Implementirajte logiku za osvežavanje
    },
  },
  mounted() {
    // Zatvori lijevi drawer prilikom prvog otvaranja stranice
    this.leftDrawerOpen = false;
  }
});
</script>
<style>
.q-avatar{
  height: 64px;
  width: 64px;
}
</style>



