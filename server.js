const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

let votes = [];
const teachers = [
    "Ms. Sally O’Brien - Biology & Science",
    "Ms. Sarah Ryan - Art",
    "Mr. Coleman Quinn - Maths & English",
    "Ms. Zoe O’Keeffe - Secretary",
    "Ms. Julie O’Connor - Home Economics",
    "Mr. Sweeney - English and Geography",
    "Dominic O Sullivan",
    "Patrick Drislane",
    "Naoise O Sullivan",
    "Claire Downey",
    "Carol Carey",
    "Ciarain Meade",
    "Michael Walsh",
    "Mairead Foley",
    "Scott Fitzgerald",
    "Treasa Moher"
];

app.use(bodyParser.json());
app.use(cors());

// Serve static files (HTML, etc.)
app.use(express.static('public'));

// Endpoint to handle voting
app.post('/vote', (req, res) => {
    const { teacher } = req.body;

    if (!teacher || !teachers.includes(teacher)) {
        return res.status(400).json({ error: 'Invalid vote submission' });
    }

    // Check if the teacher has already been voted for today
    const alreadyVoted = votes.some(vote => vote.teacher === teacher);
    if (alreadyVoted) {
        return res.status(400).json({ error: 'This teacher has already been voted out for today' });
    }

    // Add the vote
    votes.push({ teacher });
    
    res.json(votes);
});

// Endpoint to get current results
app.get('/results', (req, res) => {
    res.json(votes);
});

// Reset votes every day at 8 AM
const resetVotes = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // If it's exactly 8:00 AM, reset the votes
    if (hours === 8 && minutes === 0) {
        votes = [];
        console.log("Votes have been reset for the day.");
    }
};

// Check every minute if it's time to reset votes
setInterval(resetVotes, 60 * 1000);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
