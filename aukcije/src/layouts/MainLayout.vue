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
              <img src="~assets/aukcije_logo.jpg" alt="Logo" />
            </q-avatar>
          </router-link>
        </q-toolbar-title>

        <q-space />

        <div class="row items-center">
          <!-- Pretraga -->
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
            @click="searchItems"
          />
          <q-btn
            icon="clear"
            color="primary"
            @click="clearSearch"
          />

          <!-- Odjava -->
          <q-btn
            v-if="authenticated"
            label="Odjava"
            color="negative"
            @click="odjavaAndClose"
          />
          <!-- Prijava i registracija -->
          <router-link
            v-if="!authenticated"
            to="/prijava"
            class="q-mr-md link-style"
          >
            <q-btn label="Prijava" color="primary" />
          </router-link>
          <router-link
            v-if="!authenticated"
            to="/registracija"
            class="q-mr-md link-style"
          >
            <q-btn label="Registracija" color="primary" />
          </router-link>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Lijevi izbornik s opcijama -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      width="280px"
      class="drawer-style"
    >
      <q-list padding>
        <!-- Glavni naslov s dekoracijom -->
        <q-item-label header class="text-bold drawer-header">
          Glavni izbornik
        </q-item-label>

        <div class="spacer"></div>

        <!-- Navigacijski linkovi s ikonama -->
        <router-link to="/" class="link-style">
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="home" color="primary" />
            </q-item-section>
            <q-item-section>
              Početna stranica
            </q-item-section>
          </q-item>
        </router-link>

        <router-link to="/postavi" class="link-style">
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="add_circle" color="green" />
            </q-item-section>
            <q-item-section>
              Dodaj aukciju
            </q-item-section>
          </q-item>
        </router-link>

        <router-link to="/Moj_profil" class="link-style">
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="account_circle" color="blue" />
            </q-item-section>
            <q-item-section>
              Moj profil
            </q-item-section>
          </q-item>
        </router-link>

        <router-link v-if="authenticated" to="/moji-predmeti" class="link-style">
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="inventory_2" color="orange" />
            </q-item-section>
            <q-item-section>
              Moji predmeti
            </q-item-section>
          </q-item>
        </router-link>

        <!-- Prijava i registracija samo ako korisnik nije prijavljen -->
        <router-link v-if="!authenticated" to="/prijava" class="link-style">
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="login" color="purple" />
            </q-item-section>
            <q-item-section>
              Prijava
            </q-item-section>
          </q-item>
        </router-link>
        <router-link v-if="!authenticated" to="/registracija" class="link-style">
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="person_add" color="red" />
            </q-item-section>
            <q-item-section>
              Registracija
            </q-item-section>
          </q-item>
        </router-link>

        <!-- Odjava za prijavljenog korisnika -->
        <q-item v-if="authenticated" clickable @click="odjavaAndClose">
          <q-item-section avatar>
            <q-icon name="logout" color="negative" />
          </q-item-section>
          <q-item-section>
            Odjava
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <section class="footer">
    <div class="footer-container container">
      <div class="footer-box">
        <a href="#" class="aukcije_logo"><span>Aukcije</span></a>
    
      </div>
      <div class="footer-box">
        <h3>Stranica</h3>
        <a href="#">Početna</a>
        <router-link to="/Moj_profil" class="link-style">
            <div>Moj Profil</div>
        </router-link>
        <router-link to="/postavi" class="link-style">
            <div>Dodaj aukciju</div>
        </router-link>
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
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      leftDrawerOpen: false,
      authenticated: false,
      search: '',
    };
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    searchItems() {
      // Logika za pretragu
    },
    clearSearch() {
      this.search = '';
    },
    mounted() {
      // Zatvori lijevi drawer prilikom prvog otvaranja stranice
      this.leftDrawerOpen = false;
    },
    odjava() {
      this.authenticated = false;
      // Logika za odjavu
    },
    odjavaAndClose() {
      this.odjava(); // Odjava i zatvaranje izbornika
      this.closeLeftDrawer();
    },
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



