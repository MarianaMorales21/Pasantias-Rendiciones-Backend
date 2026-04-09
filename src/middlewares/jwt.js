import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No user is logged in" });
    }

    try {
        const decoded = jwt.verify(token, process.env.PALABRASECRETA || 'secret123');
        req.username = decoded.username;
        req.role = decoded.role;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(403).json({ message: "Invalid token" });
    }
};

export const verifyAdmin = (req, res, next) => {
    console.log("USER ROLE:", req.role);
    if (req.role === "Administrator") {
        return next();
    }

    return res.status(403).json({ error: "Unauthorized, only admin users are allowed" });
};

export const verifyDriver = (req, res, next) => {
    if (req.role === "Driver" || req.role === "Administrator") {
        return next();
    }
    return res.status(403).json({ error: "Unauthorized, only driver or administrator users are allowed" });
};

export const verifyClient = (req, res, next) => {
    if (req.role === "Client" || req.role === "Administrator") {
        return next();
    }

    return res.status(403).json({ error: "Unauthorized, only client or administrator users are allowed" });
};

/*{
    "username": "Marisca",
    "password": "marisca123"
}
{
    "name": "Mariana Morales",
    "username": "mariana123456",
    "email": "park68835-th@huskrm.com",
    "role": "Client",
    "status": "Active",
    "password": "mariana123456",
    "address": "sdfsdf",
    "phone": "04121617297",
    "dni": "30781815"
}*/