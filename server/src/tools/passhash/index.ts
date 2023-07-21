import bcrypt from "bcrypt"

export const createHashPassword = (pass: string) : string => {
    const salt = bcrypt.genSaltSync(3) + "{$s$u$c$k$}"
    return bcrypt.hashSync(pass, salt)
};

export const checkHashPassword = (passHash: string, pass: string) : boolean => {
    return bcrypt.compareSync(pass, passHash)
}