module.exports = function transliterate(text, engToRus) {
    const rus = 'щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь'.split(/ +/g);
    const eng = 'shh sh ch cz yu ya yo zh `` y` e` a b v g d e z i y k l m n o p r s t u f x `'.split(/ +/g);

    const replace = (str, charEn, charRu) => str
        .split(engToRus ? charEn : charRu)
        .join(engToRus ? charRu : charEn);

    let res = text;
    for (let x = 0; x < rus.length; x += 1) {
        res = replace(res, eng[x], rus[x]);
        res = replace(res, eng[x].toUpperCase(), rus[x].toUpperCase());
    }

    return res;
}
