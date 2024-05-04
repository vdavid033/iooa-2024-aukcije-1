<template>
  <div>
    <q-item class="q-pa-sm text-bold text-blue-7" style="font-size: 30px">
      Predmeti iz Kategorije
    </q-item>
    
    <div class="q-pa-sm row flex flex-center">
      <div
        v-for="item in items"
        :key="item.sifra_predmeta"
        class="q-pa-md item-container"
        @mouseover="hoverIn"
        @mouseleave="hoverOut"
      >
        <q-card @click="navigateToItem(item.sifra_predmeta)" class="item-card">
          <q-img :src="item.slika" no-native-menu class="item-image" />
          <q-item-section>
            <q-item class="q-pa-sm text-bold item-title">
              {{ item.naziv_predmeta }}
            </q-item>
            <q-item class="item-info">
              Početna cijena: {{ item.pocetna_cijena }}$
            </q-item>
            <q-item class="item-info">
              Vrijeme završetka: {{ formattedDate(item.vrijeme_zavrsetka) }}
            </q-item>
            <q-item class="item-info">
              Preostalo vrijeme aukcije: {{ isNegativeDatetime(item.preostalo_vrijeme) ? 'Isteklo' : item.preostalo_vrijeme + ' h' }}
            </q-item>
          </q-item-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

const baseUrl = 'http://localhost:3000/api/';

export default {
  computed: {
    sifra_kategorije() {
      return this.$route.query.sifra_kategorije;
    },
  },
  setup() {
    return {
      date: ref('2023-03-27 12:44'),
      date2: ref('2023-03-27 12:44'),
      dialog: ref(false),
      small: ref(false),
      model: ref(null),
    };
  },
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    axios
      .get(baseUrl + 'get-kategorija-predmet/' + this.sifra_kategorije, {})
      .then((response) => {
        this.items = response.data;
      });
  },

  methods: {
    isNegativeDatetime(datetimeStr) {
      return datetimeStr.charAt(0) === '-';
    },
    formattedDate(dateString) {
      return new Date(dateString).toLocaleString('hr-HR').replace(',', '');
    },
    navigateToItem(sifra_predmeta) {
      this.$router.push({ path: 'prikaz', query: { sifra_predmeta } });
    },
    hoverIn(e) {
      const card = e.currentTarget.querySelector('.item-card');
      card.style.transform = 'scale(1.05)';
      card.style.transition = 'transform 0.3s ease';
    },
    hoverOut(e) {
      const card = e.currentTarget.querySelector('.item-card');
      card.style.transform = 'scale(1)';
    },
  },
};
</script>

<style scoped>
/* Razmak i margine */
.item-container {
  margin: 10px; /* Dodatni razmak između kartica */
  
}

/* Visina slike i obrube */
.item-image {
  height: 300px;
  max-width: 400px;
  object-fit: cover; /* Prilagodba veličine slike */
  border-top-left-radius: 10px; /* Zaobljeni kutovi */
  border-top-right-radius: 10px;
}

/* Stil kartica i animacije */
.item-card {
  border: 4px solid #1976d2;
  border-radius: 10px; /* Zaobljeni kutovi */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); /* Sjene za dubinu */
  transition: box-shadow 0.3s ease; /* Animacija prilikom prelaska miša */
}

.item-card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.3); /* Povećajte sjenu prilikom hovera */
}

/* Veličina fonta i stilizacija */
.item-title {
  font-size: 20px; /* Veličina naslova */
}

.item-info {
  font-size: 16px; /* Veličina dodatnih informacija */
}

.item-info + .item-info {
  margin-top: 5px; /* Dodatni razmak između informacija */
}

.item-title {
  color: #1976d2; /* Tamnoplava boja za naslov */
}
</style>
