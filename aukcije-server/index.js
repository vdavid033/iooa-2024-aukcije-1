const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;


// Parser za JSON podatke
app.use(bodyParser.json());

// Parser za podatke iz formi
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());


const connection = mysql.createConnection({
  host: "student.veleri.hr",
  user: "iooa-aukcije",
  password: "11",
  database: "iooa-aukcije",
});

connection.connect();

// Registracija korisnika
app.post('/api/registracija', (req, res) => {
  const { ime_korisnika, prezime_korisnika, email, lozinka, adresa_korisnika } = req.body;

  // Provjera jesu li svi potrebni podaci poslani
  if (!ime_korisnika || !prezime_korisnika || !email || !lozinka || !adresa_korisnika) {
    return res.status(400).json({ message: 'Svi podaci moraju biti poslani.' });
  }

  // Provjera valjanosti e-mail adrese
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Unesena e-mail adresa nije valjana.' });
  }

  // Provjera imena i prezimena
  const nameRegex = /^[a-zA-ZčćžšđČĆŽŠĐ\s\-']+$/;
  if (!nameRegex.test(ime_korisnika) || !nameRegex.test(prezime_korisnika)) {
    return res.status(400).json({ message: 'Ime i prezime mogu sadržavati samo slova, razmake i neke posebne znakove (-, \', i šćčžđ).' });
  }

  // Provjera postojanja e-maila u bazi podataka
  connection.query('SELECT * FROM korisnik WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Greška prilikom provjere postojanja e-maila:', error);
      return res.status(500).json({ message: 'Došlo je do greške prilikom provjere postojanja e-maila.' });
    }

    // Ako već postoji korisnik s istom e-mail adresom, odbiti registraciju
    if (results.length > 0) {
      return res.status(409).json({ message: 'Korisnik s tom e-mail adresom već postoji.' });
    }

    // Hashiranje lozinke prije spremanja u bazu podataka
    bcrypt.hash(lozinka, 10, (error, hashedPassword) => {
      if (error) {
        console.error('Greška pri hashiranju lozinke:', error);
        return res.status(500).json({ message: 'Došlo je do greške prilikom hashiranja lozinke.' });
      }

      // Kreiranje novog korisnika s hashiranom lozinkom
      const noviKorisnik = { ime_korisnika, prezime_korisnika, email, lozinka: hashedPassword, adresa_korisnika };

      // Ubacivanje novog korisnika u bazu podataka
      connection.query('INSERT INTO korisnik SET ?', noviKorisnik, (error, result) => {
        if (error) {
          console.error('Greška prilikom upisa korisnika:', error);
          return res.status(500).json({ message: 'Došlo je do greške prilikom upisa korisnika u bazu podataka.' });
        }
        res.status(201).json({ message: 'Registracija uspješna.', korisnik: noviKorisnik });
      });
    });
  });
});



// Prijava korisnika
app.post('/api/prijava', (req, res) => {
  const { email, lozinka } = req.body;

  if (!email || !lozinka) {
    return res.status(400).json({ message: 'Svi podaci moraju biti poslani.' });
  }

  // Traženje korisnika prema e-mailu
  connection.query('SELECT * FROM korisnik WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Greška prilikom dohvaćanja korisnika:', error);
      return res.status(500).json({ message: 'Došlo je do greške prilikom prijave.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    const korisnik = results[0];

    bcrypt.compare(lozinka, korisnik.lozinka, (compareError, result) => {
      if (compareError) {
        console.error('Greška prilikom usporedbe lozinke:', compareError);
        return res.status(500).json({ message: 'Došlo je do greške prilikom prijave.' });
      }

      if (!result) {
        return res.status(401).json({ message: 'Neispravna lozinka.' });
      }

      // Uspješna prijava
      res.status(200).json({ message: 'Uspješna prijava.', korisnik });
    });
  });
});



// Ruta za dohvaćanje svih predmeta
app.get("/api/all-predmet", (req, res) => {
  connection.query(
    "SELECT sifra_predmeta, naziv_predmeta, slika, pocetna_cijena, vrijeme_zavrsetka, TIME_FORMAT( SEC_TO_TIME(TIMESTAMPDIFF(SECOND, NOW(), vrijeme_zavrsetka)), '%H:%i:%s' ) AS preostalo_vrijeme FROM predmet WHERE vrijeme_zavrsetka > NOW() ORDER BY preostalo_vrijeme DESC",
    (error, results) => {
      if (error) {
        console.error('Greška prilikom dohvaćanja predmeta:', error);
        return res.status(500).json({ message: 'Došlo je do greške prilikom dohvaćanja predmeta.' });
      }

      res.send(results);
    }
  );
});

app.get("/api/get-predmet/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "SELECT p.naziv_predmeta, p.sifra_predmeta, p.slika, p.pocetna_cijena, p.vrijeme_pocetka, p.vrijeme_zavrsetka, TIME_FORMAT( SEC_TO_TIME(TIMESTAMPDIFF(SECOND, p.vrijeme_pocetka, p.vrijeme_zavrsetka)), '%H:%i:%s' ) AS preostalo_vrijeme, p.svrha_donacije, p.opis_predmeta, COALESCE(MAX(po.vrijednost_ponude), p.pocetna_cijena) AS vrijednost_ponude FROM predmet p LEFT JOIN ponuda po ON p.sifra_predmeta = po.sifra_predmeta WHERE p.sifra_predmeta = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});
app.get("/api/get-kategorija-predmet/:id", (req, res) => {
    const { id } = req.params;

    connection.query(
        "SELECT sifra_predmeta, naziv_predmeta, slika, pocetna_cijena, vrijeme_zavrsetka, TIME_FORMAT( SEC_TO_TIME(TIMESTAMPDIFF(SECOND, NOW(), vrijeme_zavrsetka)), '%H:%i:%s' ) AS preostalo_vrijeme, svrha_donacije, opis_predmeta FROM predmet WHERE sifra_kategorije = ?",
        [id],
        (error, results) => {
            if (error) throw error;
            res.send(results);
        }
    );
});
app.get("/api/all-kategorija", (req, res) => {
  connection.query("SELECT * FROM kategorija", (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.get('/api/all-korisnik', (req, res) => {

    connection.query('SELECT * FROM korisnik', (error, results) => {
        if (error) throw error;

        res.send(results)
    })
})
//http://localhost:3000/api/get-predmet
app.get('/api/get-predmet/:id', (req, res) => {
    const { id } = req.params;

    connection.query('SELECT sifra_predmeta, naziv_predmeta, slika, pocetna_cijena, vrijeme_pocetka, vrijeme_zavrsetka, TIME_FORMAT( SEC_TO_TIME(TIMESTAMPDIFF(SECOND, NOW(), vrijeme_zavrsetka)), \'%H:%i:%s\' ) AS preostalo_vrijeme FROM predmet WHERE sifra_predmeta = ?', [id], (error, results) => {
        if (error) throw error;
        res.send(results)
    });
});

  app.get('/api/get-ponuda/:id', (req, res) => {
    const { id } = req.params;

    connection.query('SELECT id_ponude, vrijednost_ponude, DATE_FORMAT(vrijeme_ponude, "%Y-%m-%d %H:%i:%s") as vrijeme_ponude, id_korisnika FROM ponuda WHERE sifra_predmeta = ?', [id], (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});



  app.post('/unostrenutnaponuda', function (request, response) {
    const data = request.body;
    predmet = [[  data.id_ponude, data.vrijednost_ponude, data.vrijeme_ponude, data.id_korisnika, data.sifra_predmeta]]
    connection.query('INSERT INTO ponuda (id_ponude, vrijednost_ponude,  vrijeme_ponude, id_korisnika, sifra_predmeta) VALUES ?',
    [predmet], function (error, results, fields) {
      if (error) throw error;
      return response.send({ error: false, data: results, message: 'Dodali se trenutnu ponudu.' });
    });
  });
app.post("/api/unos-slike", function (req, res) {
  const data = req.body;
  const slika = data.slika;

  connection.query(
    "INSERT INTO predmet (slika) VALUES (?)",
    [slika],
    function (error, results, fields) {
      if (error) {
        console.error(error);
        return res.status(500).send({
          error: true,
          message: "Dogodila se greška prilikom dodavanja teksta.",
        });
      }
      return res.send({
        error: false,
        data: results,
        message: "Slika je dodana.",
      });
    }
  );
});
app.get('/api/all-korisnik', (req, res) => {

    connection.query('SELECT * FROM korisnik', (error, results) => {
        if (error) throw error;

        res.send(results)
    })
})

app.get("/api/all-predmet-with-current-price", (req, res) => {
  connection.query(
    "SELECT p.sifra_predmeta, p.naziv_predmeta, p.slika, p.pocetna_cijena, p.vrijeme_zavrsetka, TIME_FORMAT( SEC_TO_TIME(TIMESTAMPDIFF(SECOND, NOW(), p.vrijeme_zavrsetka)), '%H:%i:%s' ) AS preostalo_vrijeme, COALESCE(MAX(po.vrijednost_ponude), p.pocetna_cijena) AS trenutna_cijena FROM predmet p LEFT JOIN ponuda po ON p.sifra_predmeta = po.sifra_predmeta WHERE p.vrijeme_zavrsetka > NOW() GROUP BY p.sifra_predmeta ORDER BY preostalo_vrijeme DESC",
    (error, results) => {
      if (error) throw error;

      res.send(results);
    }
  );
});
app.get('/api/get-predmet-trenutna-cijena/:id', (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT p.sifra_predmeta, p.naziv_predmeta, p.opis_predmeta, p.svrha_donacije, p.slika, p.pocetna_cijena, p.vrijeme_pocetka, p.vrijeme_zavrsetka, TIME_FORMAT(SEC_TO_TIME(TIMESTAMPDIFF(SECOND, NOW(), p.vrijeme_zavrsetka)), '%H:%i:%s') AS preostalo_vrijeme, COALESCE(po.trenutna_cijena, p.pocetna_cijena) AS trenutna_cijena FROM predmet p LEFT JOIN (SELECT sifra_predmeta, MAX(vrijednost_ponude) AS trenutna_cijena FROM ponuda GROUP BY sifra_predmeta) po ON p.sifra_predmeta = po.sifra_predmeta WHERE p.sifra_predmeta = ?",
    [id],
    (error, results) => {
      if (error) throw error;

      res.send(results);
    }
  );
});

app.listen(port, () => {
  console.log('Server running at port: ' + port);
});
