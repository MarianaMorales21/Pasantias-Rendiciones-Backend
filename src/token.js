import jwt from "jsonwebtoken";

export function createAccesToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.PALABRASECRETA,
            {
                expiresIn: "1d",
            },
            (err, token) => {
                if (err) {
                    return reject(err);
                }
                resolve(token);
            }
        );
    });
}