import express from "express";
import { z } from "zod";

const router = express.Router();

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;

    // Convert degrees to radians
    const toRadians = (degree) => degree * (Math.PI / 180);

    // Calculate differences in coordinates
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    // Haversine formula
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}


export default (db) => {
    const querySchema = z.object({
        latitude: z
            .string()
            .min(1, "Latitude is required")
            .refine((val) => !isNaN(parseFloat(val)), {
                message: "Latitude must be a number",
            }),
        longitude: z
            .string()
            .min(1, "Longitude is required")
            .refine((val) => !isNaN(parseFloat(val)), {
                message: "Longitude must be a number",
            }),
    });

    router.get("/", (req, res) => {
        const { latitude, longitude } = req.query;

        const validationResult = querySchema.safeParse({ latitude, longitude });

        if (!validationResult.success) {
            return res
                .status(400)
                .json({
                    errors: validationResult.error.errors.map(
                        (e) => e.message
                    ),
                });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        const query = "SELECT * FROM schools";
        db.query(query, (err, results) => {
            if (err) return res.status(500).json({ error: "Database error." });

            const sortedSchools = results
                .map((school) => {
                    return {
                        ...school,
                        distance: calculateDistance(
                            lat,
                            lon,
                            school.latitude,
                            school.longitude
                        ),
                    };
                })
                // Using built-in JS sorting algorithm
                .sort((a, b) => a.distance - b.distance);

            res.json(sortedSchools);
        });
    });

    return router;
};
