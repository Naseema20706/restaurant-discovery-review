const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());


// ==========================================
// SERVE FRONTEND
// ==========================================

app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);


// ==========================================
// MYSQL CONNECTION
// ==========================================

const db = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "sriii1211",

    database: "restaurant_db"

});


db.connect(function (error) {

    if (error) {

        console.log(
            "MySQL connection error:",
            error
        );

        return;
    }

    console.log(
        "MySQL connected successfully!"
    );

});


// ==========================================
// HOME
// ==========================================

app.get("/", function (req, res) {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );

});


// ==========================================
// TEST API
// ==========================================

app.get("/test", function (req, res) {

    res.send(
        "API test is working!"
    );

});


// ==========================================
// GET ALL RESTAURANTS
// ==========================================

app.get(
    "/api/restaurants",
    function (req, res) {

        const sql =
            "SELECT * FROM restaurants";

        db.query(
            sql,
            function (error, results) {

                if (error) {

                    console.log(
                        "Database query error:",
                        error
                    );

                    return res.status(500).json({
                        error:
                            "Failed to fetch restaurants"
                    });

                }

                res.json(results);

            }
        );

    }
);


// ==========================================
// GET ONE RESTAURANT
// ==========================================

app.get(
    "/api/restaurants/:id",
    function (req, res) {

        const id = req.params.id;

        const sql =
            "SELECT * FROM restaurants WHERE id = ?";

        db.query(
            sql,
            [id],
            function (error, results) {

                if (error) {

                    console.log(
                        "Database query error:",
                        error
                    );

                    return res.status(500).json({
                        error:
                            "Failed to fetch restaurant"
                    });

                }

                if (results.length === 0) {

                    return res.status(404).json({
                        error:
                            "Restaurant not found"
                    });

                }

                res.json(results[0]);

            }
        );

    }
);


// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    function () {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);