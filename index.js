const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(cors());
app.use(express.json());
let db;
(async () => {
  try {
    db = await open({
      filename: path.join(__dirname, 'database.sqlite'), // Make sure this path is writable
      // filename: './database.sqlite',
      driver: sqlite3.Database,
    });
    console.log('Database connection established.');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
})();
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});
const fetchGames = async () => {
  const sql = 'SELECT * FROM games';
  return db.all(sql, []);
};
app.get('/games', async (req, res) => {
  try {
    const games = await fetchGames();
    if (games.length === 0) {
      return res.status(404).json({ message: 'No games found.' });
    }
    res.status(200).json({ games });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchGameById = async (id) => {
  const sql = 'SELECT * FROM games WHERE id = ?';
  return db.get(sql, [id]);
};
app.get('/games/details/:id', async (req, res) => {
  const gameId = parseInt(req.params.id);

  try {
    // Fetch the game by ID
    const game = await fetchGameById(gameId);

    if (game) {
      res.status(200).json({ game });
    } else {
      res.status(404).json({ error: 'Game not found ' + gameId });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchGamesByGenre = async (genre) => {
  const sql = 'SELECT * FROM games WHERE genre = ?';
  return db.all(sql, [genre]);
};

app.get('/games/genre/:genre', async (req, res) => {
  const genre = req.params.genre;

  try {
    // Fetch games by the specified genre
    const games = await fetchGamesByGenre(genre);

    if (games.length === 0) {
      return res
        .status(404)
        .json({ message: `No games found for genre: ${genre}.` });
    }

    res.status(200).json({ games });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchGamesByPlatform = async (platform) => {
  const sql = 'SELECT * FROM games WHERE platform = ?';
  return db.all(sql, [platform]);
};

app.get('/games/platform/:platform', async (req, res) => {
  const platform = req.params.platform;

  try {
    const games = await fetchGamesByPlatform(platform);

    if (games.length === 0) {
      return res
        .status(404)
        .json({ message: `No games found for platform: ${platform}.` });
    }

    res.status(200).json({ games });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchGamesSortedByRating = async () => {
  const sql = 'SELECT * FROM games ORDER BY rating DESC';
  return db.all(sql, []);
};

app.get('/games/sort-by-rating', async (req, res) => {
  try {
    const games = await fetchGamesSortedByRating();

    if (games.length === 0) {
      return res.status(404).json({ message: 'No games found.' });
    }

    res.status(200).json({ games });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchAllPlayers = async () => {
  const sql = 'SELECT * FROM players';
  return db.all(sql, []);
};

app.get('/players', async (req, res) => {
  try {
    const players = await fetchAllPlayers();

    if (players.length === 0) {
      return res.status(404).json({ message: 'No players found.' });
    }

    res.status(200).json({ players });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchPlayerById = async (id) => {
  const sql = 'SELECT * FROM players WHERE id = ?';
  return db.get(sql, [id]);
};

app.get('/players/details/:id', async (req, res) => {
  const playerId = parseInt(req.params.id);

  try {
    const player = await fetchPlayerById(playerId);

    if (!player) {
      return res
        .status(404)
        .json({ message: `Player with ID ${playerId} not found.` });
    }

    res.status(200).json({ player });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchPlayersByPlatform = async (platform) => {
  const sql = 'SELECT * FROM players WHERE platform = ?';
  return db.all(sql, [platform]);
};

app.get('/players/platform/:platform', async (req, res) => {
  const platform = req.params.platform;

  try {
    const players = await fetchPlayersByPlatform(platform);

    if (players.length === 0) {
      return res
        .status(404)
        .json({ message: `No players found for platform: ${platform}.` });
    }

    res.status(200).json({ players });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchPlayersSortedByRating = async () => {
  const sql = 'SELECT * FROM players ORDER BY rating DESC';
  return db.all(sql, []);
};

app.get('/players/sort-by-rating', async (req, res) => {
  try {
    const players = await fetchPlayersSortedByRating();

    if (players.length === 0) {
      return res.status(404).json({ message: 'No players found.' });
    }

    res.status(200).json({ players });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchAllTournaments = async () => {
  const sql = 'SELECT * FROM tournaments';
  return db.all(sql, []);
};

app.get('/tournaments', async (req, res) => {
  try {
    const tournaments = await fetchAllTournaments();

    if (tournaments.length === 0) {
      return res.status(404).json({ message: 'No tournaments found.' });
    }

    res.status(200).json({ tournaments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchTournamentById = async (id) => {
  const sql = 'SELECT * FROM tournaments WHERE id = ?';
  return db.get(sql, [id]);
};

app.get('/tournaments/details/:id', async (req, res) => {
  const tournamentId = parseInt(req.params.id);

  try {
    const tournament = await fetchTournamentById(tournamentId);

    if (!tournament) {
      return res
        .status(404)
        .json({ message: `Tournament with ID ${tournamentId} not found.` });
    }

    res.status(200).json({ tournament });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchTournamentsByGameId = async (gameId) => {
  const sql = 'SELECT * FROM tournaments WHERE game_id = ?';
  return db.all(sql, [gameId]);
};

app.get('/tournaments/game/:id', async (req, res) => {
  const gameId = parseInt(req.params.id);

  try {
    const tournaments = await fetchTournamentsByGameId(gameId);

    if (tournaments.length === 0) {
      return res
        .status(404)
        .json({ message: `No tournaments found for game ID ${gameId}.` });
    }

    res.status(200).json({ tournaments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchTournamentsSortedByPrizePool = async () => {
  const sql = 'SELECT * FROM tournaments ORDER BY prize_pool DESC';
  return db.all(sql, []);
};

app.get('/tournaments/sort-by-prize-pool', async (req, res) => {
  try {
    const tournaments = await fetchTournamentsSortedByPrizePool();

    if (tournaments.length === 0) {
      return res.status(404).json({ message: 'No tournaments found.' });
    }

    res.status(200).json({ tournaments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
