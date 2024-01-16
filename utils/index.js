export function hasSpecialCharacter(data) {
    const pattern = /^[A-Za-z0-9\s]+$/;

    if(pattern.test(data)) {
        return false
    }
    return true
}