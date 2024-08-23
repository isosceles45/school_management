import express from "express";
import { z } from "zod";

const router = express.Router();

export default (db) => {
    const schoolSchema = z.object({
        name: z.string().min(1, "Name is required"),
        address: z.string().min(1, "Address is required"),
        latitude: z
            .number()
            .min(-90)
            .max(90, "Latitude must be between -90 and 90"),
        longitude: z
            .number()
            .min(-180)
            .max(180, "Longitude must be between -180 and 180"),
    });

    router.post("/", (req, res) => {
        const { name, address, latitude, longitude } = req.body;

        const validationResult = schoolSchema.safeParse({
            name,
            address,
            latitude,
            longitude,
        });

        if (!validationResult.success) {
            return res
                .status(400)
                .json({
                    errors: validationResult.error.errors.map((e) => e.message),
                });
        }

        const query =
            "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
        db.query(query, [name, address, latitude, longitude], (err, result) => {
            if (err) return res.status(500).json({ error: "Database error." });

            res.status(201).json({
                message: "School added successfully!",
                schoolId: result.insertId,
            });
        });
    });

    return router;
};
