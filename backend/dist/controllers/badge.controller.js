import badgeModel from "../models/badge.model.js";
export const fetchBadges = async (req, res) => {
    try {
        const badges = await badgeModel.find();
        res.json({
            success: true,
            message: "Badges fetched successfully!",
            badges,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching badges." });
    }
};
