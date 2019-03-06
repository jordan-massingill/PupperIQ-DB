const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const cors = require('cors');
const dbConfig = require('./knexfile');

const db = knex(dbConfig.development);
const server = express();

server.use(cors({ origin: "http://localhost:3000", credentials: true }));
server.use(express.json());
server.use(helmet());

server.get('/', (req, res) => {
  db('puppers').then(pups => {
    res.status(200).json(pups);
    console.log(pups);
  }).catch(err => {
    res.status(500).json(err)
  })
})

server.post('/results', (req, res) => {
  console.log(req.body, "\n\n ****HELLOOO THERE!****\n\n");


  const scores = req.body;
  let prevScore = 20;
  let currScore = 0;
  const result = [];
  db('puppers').then(pups => {
    pups.map(pup => {
      currScore = Math.abs(scores.sheds - pup.sheds) + Math.abs(scores.play - pup.playfulness) +
      Math.abs(scores.activity - pup.activity) + Math.abs(scores.affection - pup.affection) +
      Math.abs(scores.train - pup.trainability) + Math.abs(scores.size - pup.size) + Math.abs(scores.pets - pup.other_pets) +
      Math.abs(scores.maint - pup.maintenance) + Math.abs(scores.climate - pup.climate);
      // console.log("score:", currScore);
      if (currScore < prevScore) {
        const pupper = pup;
        pupper.score = currScore;
        result.push(pupper);
        // console.log('Pupper:', pupper);
        // prevScore = currScore;
      }
    });
    console.log("result: ", result);
    res.status(200).json(result)
  }).catch(err => {
    res.status(500).json(err.data)
  })
});

server.post('/add', (req, res) => {
  const pupper = req.body;
  console.log(pupper);
  db('puppers').insert(pupper).then(completed => {
    res.status(200).json(completed);
  }).catch(err => {
    console.log("Insert malfunctioned")
    res.status(500).json(err.data)
  })
})

server.delete('/puppers/:id', (req, res) => {
  db('puppers').where('id', req.params.id).del().then(rows => {
    console.log(rows, " rows deleted");
    res.status(204).json(rows);
  }).catch(err => {
    res.status(500).json(err.data)
  })
})

server.listen(8000, () => {
  console.log("Server listening on 8K");
})
