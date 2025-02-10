const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://Sperky:QLFvegthwbKXOg0w@cluster0.kglzhgp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const visitSchema = new mongoose.Schema({
    profile: String,
    count: { type: Number, default: 0 }
});

const Visit = mongoose.model("Visit", visitSchema);

app.get("/profile", async (req, res) => {
    const profile = req.params.profile;

    let visit = await Visit.findOne({ profile });

    if (!visit) {
        visit = new Visit({ profile, count: 1 });
    } else {
        visit.count += 1;
    }

    await visit.save();

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="50">
        <rect width="200" height="50" fill="black" rx="5"/>
        <text x="50%" y="50%" fill="white" font-size="20px" font-family="Arial" text-anchor="middle" dominant-baseline="middle">
            Visits: ${visit.count}
        </text>
    </svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
