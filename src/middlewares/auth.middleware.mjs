module.exports = {

    userIsLoggedIn: (req, res, next) => {
        // el usuario debe tener una sesión iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if (!isLoggedIn) {
            return res.status(401).json({ error: 'el usuario debe iniciar la sesion!' })
        }

        next()
    },

    userIsNotLoggedIn: (req, res, next) => {
        // cuando el usuario no debe tener una sesión iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if (isLoggedIn) {
            return res.status(401).json({ error: 'El usuario debe iniciar una sesion    !' })
        }

        next()
    }
}