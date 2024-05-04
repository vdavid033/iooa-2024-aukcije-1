<template>
  <q-card>
    <!-- Sekcija s kategorijama -->
    <q-item
      class="q-pa-sm text-bold text-blue-7 category-header"
    >
      Kategorije
    </q-item>
    <div class="q-pa-sm row flex flex-center category-section">
      <div
        v-for="item in kategorija"
        :key="item.sifra_kategorije"
        class="q-pa-md category-card"
        @mouseover="hoverIn"
        @mouseleave="hoverOut"
      >
        <q-card @click="navigateToItem1(item.sifra_kategorije)" class="category-card-content">
          <q-item-section>
            <q-item class="q-pa-sm text-bold text-blue-7 category-title"
            >
              {{ item.naziv_kategorije }}
            </q-item>
          </q-item-section>
        </q-card>
      </div>
    </div>

    <!-- Sekcija s aukcijama -->
    <q-item
      class="q-pa-sm text-bold text-blue-7 auction-header"
    >
      Zadnje ili trenutne aukcije
    </q-item>
    <div class="q-pa-sm row flex flex-center auction-section">
      <div
        v-for="item in items"
        :key="item.sifra_predmeta"
        class="q-pa-md auction-card"
        @mouseover="hoverIn"
        @mouseleave="hoverOut"
      >
        <q-card @click="navigateToItem(item.sifra_predmeta)" class="auction-card-content">
          <q-img :src="item.slika" no-native-menu class="auction-img" />
          <q-item-section>
            <q-item class="q-pa-sm text-bold text-blue-7 auction-title"
            >
              {{ item.naziv_predmeta }}
            </q-item>
            <q-item class="auction-info">Početna cijena: {{ item.pocetna_cijena }}$</q-item>
            <q-item class="auction-info"
            >
              Vrijeme završetka: {{ formattedDate(item.vrijeme_zavrsetka) }}
            </q-item>
            <q-item class="auction-info"
            >
              Preostalo vrijeme aukcije: {{ item.preostalo_vrijeme }} h
            </q-item>
            <q-item class="auction-info">Trenutna cijena: {{ item.trenutna_cijena }}$</q-item>
          </q-item-section>
        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script>
import axios from "axios";

const baseUrl = "http://localhost:3000/api/";

export default {
  setup() {
    return {};
  },
  data() {
    return {
    items: [],
    kategorija: [],
    };
  },
  mounted() {
    axios.get(baseUrl + "all-predmet-with-current-price").then((response) => {
      this.items = response.data;
    });
    axios.get(baseUrl + "all-kategorija").then((response) => {
      this.kategorija = response.data;
    });
  },

  methods: {
    formattedDate(dateString) {
      return new Date(dateString).toLocaleString("hr-HR").replace(",", "");
    },

    navigateToItem(sifra_predmeta) {
      this.$router.push({ path: "prikaz", query: { sifra_predmeta } });
    },
    navigateToItem1(sifra_kategorije) {
      this.$router.push({ path: "kategorija", query: { sifra_kategorije } });
    },
    hoverIn(e) {
      e.currentTarget.querySelector('.category-card-content, .auction-card-content').style.transform = "scale(1.05)";
      e.currentTarget.querySelector('.category-card-content, .auction-card-content').style.transition = "transform 0.3s ease";
    },
    hoverOut(e) {
      e.currentTarget.querySelector('.category-card-content, .auction-card-content').style.transform = "scale(1)";
    },
  },
};
</script>

<style>
/* Boje */
.category-section {
  background-color: #e0f7fa; /* Svjetlo plava pozadina za kategorije */
}

.auction-section {
  background-color: #fce4ec; /* Svjetlo ružičasta pozadina za aukcije */
}




/* Sjene */
.category-card-content,
.auction-card-content {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;
}

/* Efekti prilikom prelaska miša */
.category-card-content:hover,
.auction-card-content:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.3); /* Dodajte sjenu */
}

/* Dodatni razmak između kartica */
.category-card {
  margin: 10px;
}

.auction-card {
  margin: 10px;
}

/* Pozicioniranje slike */
.auction-img {
  height: 300px;
  max-width: 500px;
  object-fit: cover; /* Da slika zadrži proporcije */
}

/* Veličina fonta i boje */
.category-header,
.auction-header {
  font-size: 30px;
}

.category-title,
.auction-title {
  font-size: 20px;
}

.auction-info {
  font-size: 16px; /* Manji font za dodatne informacije */
}
</style>
