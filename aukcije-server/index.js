const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { join } = require("path");
const path = require("path");
const multer = require("multer");
const upload = multer();
const jwt = require("jsonwebtoken");
const config = require("../aukcije-server/auth.config.js");
const authJwt = require("../aukcije-server/authJwt.js");
const verifyToken = require('./verifyToken');
const { sign } = require("crypto");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: "*" }));


const connection = mysql.createConnection({
  host: "student.veleri.hr",
  user: "iooa-aukcije",
  password: "11",
  database: "iooa-aukcije",
});


connection.connect();

app.get("/api/check-login", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  jwt.verify(token, 'tajni_kljuc', (err, decoded) => {
    if (err) {
      return res.status(401).json({ authenticated: false });
    }

    res.status(200).json({ authenticated: true });
  });
});

app.post("/api/odjava", (req, res) => {
  res.status(200).json({ message: "Odjava uspješna." });
});

app.post('/api/registracija', (req, res) => {
  const { ime_korisnika, prezime_korisnika, email, lozinka, adresa_korisnika } = req.body;

  if (!ime_korisnika || !prezime_korisnika || !email || !lozinka || !adresa_korisnika ) {
    return res.status(400).json({ message: 'Svi podaci moraju biti poslani.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Unesena e-mail adresa nije valjana.' });
  }

  connection.query('SELECT * FROM korisnik WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Greška prilikom provjere postojanja e-maila:', error);
      return res.status(500).json({ message: 'Došlo je do greške prilikom provjere postojanja e-maila.' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Korisnik s tom e-mail adresom već postoji.' });
    }

    bcrypt.hash(lozinka, 10, (error, hashedPassword) => {
      if (error) {
        console.error('Greška pri hashiranju lozinke:', error);
        return res.status(500).json({ message: 'Došlo je do greške prilikom hashiranja lozinke.' });
      }

      const noviKorisnik = { ime_korisnika, prezime_korisnika, email, lozinka: hashedPassword, adresa_korisnika };

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

app.post("/api/prijava", (req, res) => {
  const { email, lozinka, data } = req.body;

  if (!email || !lozinka) {
    return res.status(400).json({ message: "Svi podaci moraju biti poslani." });
  }

  connection.query("SELECT * FROM korisnik WHERE email = ?", [email], (error, results) => {
    if (error) {
      console.error("Greška prilikom dohvaćanja korisnika:", error);
      return res.status(500).json({ message: "Došlo je do greške prilikom prijave." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    const korisnik = results[0];

    bcrypt.compare(lozinka, korisnik.lozinka, (compareError, isMatch) => {
      if (compareError) {
        console.error("Greška prilikom usporedbe lozinke:", compareError);
        return res.status(500).json({ message: "Došlo je do greške prilikom prijave." });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Neispravna lozinka." });
      }

      const token = jwt.sign({ id: results[0].id_korisnika, email: results[0].email_korisnika, uloga: results[0].uloga }, config.secret);
      res.status(200).json({ success: true, message: "Prijava uspješna.", token: token, korisnik: { id: korisnik.id_korisnika, ime: korisnik.ime_korisnika, prezime: korisnik.prezime_korisnika } });
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

//unos staro
app.post('/unosPredmeta', function (request, response) {
  const data = request.body;
    predmet = [[data.sifra_predmeta, data.naziv_predmeta,  data.opis_predmeta, data.slika, data.vrijeme_pocetka, data.vrijeme_zavrsetka, data.pocetna_cijena, data.svrha_donacije, data.id_korisnika, data.sifra_kategorije]]
    connection.query('INSERT INTO predmet (sifra_predmeta, naziv_predmeta,  opis_predmeta, slika, vrijeme_pocetka, vrijeme_zavrsetka, pocetna_cijena, svrha_donacije, id_korisnika, sifra_kategorije) VALUES ?',
    [predmet], function (error, results, fields) {
      if (error) throw error;
      console.log('data', data)
      return response.send({ error: false, data: results, message: 'Predmet je dodan.' });
    });
});

// unos novo
// Kod za unos predmeta
//app.post('/unosPredmeta', verifyToken, (request, response) => {
 // const data = request.body;
 // const id_korisnika = request.user.id; // Dobivanje ID-a korisnika iz JWT tokena

  // Provjera da li su svi potrebni podaci poslani
 // if (!data.sifra_predmeta || !data.naziv_predmeta || !data.opis_predmeta || !data.slika || !data.vrijeme_pocetka || !data.vrijeme_zavrsetka || !data.pocetna_cijena || !data.svrha_donacije || !data.sifra_kategorije) {
//    return response.status(400).json({ message: "Svi podaci moraju biti poslani." });
//  }

 // const predmet = [[data.sifra_predmeta, data.naziv_predmeta, data.opis_predmeta, data.slika, data.vrijeme_pocetka, data.vrijeme_zavrsetka, data.pocetna_cijena, data.svrha_donacije, id_korisnika, data.sifra_kategorije]];

 // connection.query('INSERT INTO predmet (sifra_predmeta, naziv_predmeta, opis_predmeta, slika, vrijeme_pocetka, vrijeme_zavrsetka, pocetna_cijena, svrha_donacije, id_korisnika, sifra_kategorije) VALUES ?',
 //   [predmet], (error, results) => {
   //   if (error) {
 //       console.error('Greška prilikom unosa predmeta:', error);
  //      return response.status(500).json({ error: true, message: 'Došlo je do greške prilikom unosa predmeta.' });
 //     }
 //     console.log('Data:', data);
 //     return response.status(201).json({ error: false, data: results, message: 'Predmet je dodan.' });
 //   });
//});


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

// ponuda staro

 // app.post('/unostrenutnaponuda', function (request, response) {
 //   const data = request.body;
 //   predmet = [[  data.id_ponude, data.vrijednost_ponude, data.vrijeme_ponude, data.id_korisnika, data.sifra_predmeta]]
 //   connection.query('INSERT INTO ponuda (id_ponude, vrijednost_ponude,  vrijeme_ponude, id_korisnika, sifra_predmeta) VALUES ?',
 //   [predmet], function (error, results, fields) {
  //    if (error) throw error;
  //    return response.send({ error: false, data: results, message: 'Dodali se trenutnu ponudu.' });
  //  });
 // });

 //ponuda novo
 app.post("/api/unostrenutnaponuda", verifyToken, (req, res) => {
  const { vrijednost_ponude, sifra_predmeta } = req.body;
  const id_korisnika = req.user.id; // Dobivanje ID-a korisnika iz JWT tokena

  if (!vrijednost_ponude || !sifra_predmeta || !id_korisnika) {
    return res.status(400).json({ message: "Svi podaci moraju biti poslani." });
  }

  // Dohvaćanje trenutne cijene proizvoda iz baze podataka
  connection.query('SELECT trenutna_cijena FROM predmet WHERE sifra_predmeta = ?', [sifra_predmeta], (error, results) => {
    if (error) {
      console.error('Greška prilikom dohvaćanja trenutne cijene proizvoda:', error);
      return res.status(500).json({ error: true, message: 'Došlo je do greške prilikom dohvaćanja trenutne cijene proizvoda.' });
    }

    const trenutna_cijena = results[0].trenutna_cijena;

    if (vrijednost_ponude <= trenutna_cijena) {
      return res.status(400).json({ message: "Ponuđena cijena mora biti veća od trenutne cijene." });
    }

    const vrijeme_ponude = new Date().toISOString().slice(0, 19).replace('T', ' '); // Generiranje trenutnog vremena

    const ponuda = [[vrijednost_ponude, vrijeme_ponude, id_korisnika, sifra_predmeta]];

    connection.query('INSERT INTO ponuda (vrijednost_ponude, vrijeme_ponude, id_korisnika, sifra_predmeta) VALUES ?', [ponuda], (error, results) => {
      if (error) {
        console.error('Greška prilikom dodavanja nove ponude:', error);
        return res.status(500).json({ error: true, message: 'Došlo je do greške prilikom dodavanja nove ponude.' });
      }

      // Ažuriranje trenutne cijene predmeta
      connection.query('UPDATE predmet SET trenutna_cijena = ? WHERE sifra_predmeta = ?', [vrijednost_ponude, sifra_predmeta], (error, results) => {
        if (error) {
          console.error('Greška prilikom ažuriranja trenutne cijene predmeta:', error);
          return res.status(500).json({ error: true, message: 'Došlo je do greške prilikom ažuriranja trenutne cijene predmeta.' });
        }

        res.json({ error: false, message: 'Dodali ste trenutnu ponudu.' });
      });
    });
  });
});

  //Unos slike
app.post("/api/unos-slike", function (req, res) {
  const data = req.body;
  const slika = data.compressedFile;

  connection.query(
    "INSERT INTO predmet (slika) VALUES (?)",
    [slika],
    function (error, results, fields) {
      if (error) {
        console.error("Pogreška unosa slike u bazu", error);
        return res.status(500).send({
          message: "Dogodila se greška prilikom unosa slike u bazu."
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
app.get("/api/korisnikinfo/:id", authJwt.verifyTokenAdmin, (req, res) => {
  const id = req.params.id;

  connection.query("SELECT ime_korisnika, prezime_korisnika, email, adresa_korisnika, lozinka FROM korisnik WHERE id_korisnika = ?", [id], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.get("/api/korisnikinfo1/:id", (req, res) => {
  const id = req.params.id;

  connection.query("SELECT ime_korisnika, prezime_korisnika, email, adresa_korisnika, lozinka FROM korisnik WHERE id_korisnika = ?", [id], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});



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