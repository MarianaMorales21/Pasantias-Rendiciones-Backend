import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: "No hay token, autorización denegada" });

    jwt.verify(token, process.env.PALABRASECRETA || 'secret123', (err, user) => {
        if (err) return res.status(403).json({ message: "Token inválido" });
        req.user = user;
        next();
    });
};

// Middleware para restringir por rol y lógica de solo lectura
export const authorizeRoles = (rolesPermitidos) => {
    return (req, res, next) => {
        const userRole = req.user.rol; // 1: Admin, 2: Coordinator, 3: Accountant

        // 1. Administrador (1) siempre tiene acceso total
        if (userRole === 1) return next();

        // 2. Bloqueo de Módulo de Usuarios para No-Admins (Coordinador y Cuentadante)
        if (req.originalUrl.includes('/users') && userRole !== 1) {
            return res.status(403).json({ message: "Acceso denegado: Solo administradores pueden gestionar usuarios" });
        }

        // 3. Cuentadante (3) es Solo Lectura (Solo GET)
        if (userRole === 3 && req.method !== 'GET') {
            return res.status(403).json({ message: "Acceso denegado: El rol Cuentadante es de solo lectura" });
        }

        // 4. Verificar si el rol está en la lista de permitidos (opcional para rutas muy específicas)
        if (rolesPermitidos && !rolesPermitidos.includes(userRole)) {
            return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
        }

        next();
    };
};