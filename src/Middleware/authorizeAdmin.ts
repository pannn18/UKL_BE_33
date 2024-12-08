import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: number;
    UserRole: string;
}

const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res.status(401).json({ message: "Unauthorized, token hilang" });
            return;
        }

        const token = authHeader.split("Bearer ")[1]; // Ambil token setelah "Bearer"
        const signature = process.env.SECRET || "admin" // Ganti dengan kunci rahasia JWT Anda

        // Verifikasi dan decode token
        const decoded = jwt.verify(token, signature) as JwtPayload;

        // Periksa role dari payload
        if (decoded.UserRole !== "ADMIN") {
            res.status(403).json({ message: "Dilarang, hanya admin yang bisa" });
            return;
        }

        // Lolos validasi, lanjut ke handler berikutnya
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error });
    }
};

export default authorizeAdmin;