
const lowerCaseTranlitLetters : Array<[string, string]> = [
    ["а","a"],
    ["б","b"],
    ["в","v"],
    ["г","g"],
    ["д","d"],
    ["е","e"],
    ["ё","yo"],
    ["ж","zh"],
    ["з","z"],
    ["и","i"],
    ["й","j"],
    ["к","k"],
    ["л","l"],
    ["м","m"],
    ["н","n"],
    ["о","o"],
    ["п","p"],
    ["р","r"],
    ["с","s"],
    ["т","t"],
    ["у","u"],
    ["ф","f"],
    ["х","h"],
    ["ц","c"],
    ["ч","ch"],
    ["ш","sh"],
    ["щ","shh"],
    ["ъ",""],
    ["ы","y"],
    ["ь",""],
    ["э","e"],
    ["ю","yu"],
    ["я","ya"]
]

export const translitLowercaseRuToEn = (str: string) : string => {
    let result = ""
    for (let i = 0; i < str.toLowerCase().length; i++) {
        const trasnlitLetter = lowerCaseTranlitLetters.find(letter => letter[0] === str[i])
        result += trasnlitLetter ? trasnlitLetter[1] : str[i] 
    }
    return result
}