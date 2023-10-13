//isso verifica se o email é realmente um email não sei como.
function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
}