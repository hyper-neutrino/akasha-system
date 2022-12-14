import {
    // Elements
    PYRO,
    HYDRO,
    ANEMO,
    ELECTRO,
    DENDRO,
    CRYO,
    GEO,
    OTHER,

    // Weapons
    SWORD,
    POLEARM,
    CLAYMORE,
    BOW,
    CATALYST,
    UNKNOWN,

    // Regions
    MONDSTADT,
    LIYUE,
    INAZUMA,
    SUMERU,
    SNEZHNAYA,
    OTHER_REGION,
} from "./emoji.js";

export const characters = {
    albedo: [GEO, SWORD, MONDSTADT, "Albedo"],
    alhaitham: [DENDRO, UNKNOWN, SUMERU, "Alhaitham"],
    aloy: [CRYO, BOW, OTHER_REGION, "Aloy"],
    amber: [PYRO, BOW, MONDSTADT, "Amber"],
    itto: [GEO, CLAYMORE, INAZUMA, "Arataki Itto"],
    barbara: [HYDRO, CATALYST, MONDSTADT, "Barbara"],
    beidou: [ELECTRO, CLAYMORE, LIYUE, "Beidou"],
    bennett: [PYRO, SWORD, MONDSTADT, "Bennett"],
    candace: [HYDRO, POLEARM, SUMERU, "Candace"],
    chongyun: [CRYO, CLAYMORE, LIYUE, "Chongyun"],
    collei: [DENDRO, BOW, SUMERU, "Collei"],
    cyno: [ELECTRO, POLEARM, SUMERU, "Cyno"],
    dainsleif: [OTHER, UNKNOWN, OTHER_REGION, "Dainsleif"],
    diluc: [PYRO, CLAYMORE, MONDSTADT, "Diluc"],
    diona: [CRYO, BOW, MONDSTADT, "Diona"],
    dori: [ELECTRO, CLAYMORE, SUMERU, "Dori"],
    eula: [CRYO, CLAYMORE, MONDSTADT, "Eula"],
    faruzan: [ANEMO, UNKNOWN, SUMERU, "Faruzan"],
    fischl: [ELECTRO, BOW, MONDSTADT, "Fischl"],
    ganyu: [CRYO, BOW, LIYUE, "Ganyu"],
    gorou: [GEO, BOW, INAZUMA, "Gorou"],
    hutao: [PYRO, POLEARM, LIYUE, "Hu Tao"],
    jean: [ANEMO, SWORD, MONDSTADT, "Jean"],
    kazuha: [ANEMO, SWORD, INAZUMA, "Kaedehara Kazuha"],
    kaeya: [CRYO, SWORD, MONDSTADT, "Kaeya"],
    ayaka: [CRYO, SWORD, INAZUMA, "Kamisato Ayaka"],
    ayato: [HYDRO, SWORD, INAZUMA, "Kamisato Ayato"],
    keqing: [ELECTRO, SWORD, LIYUE, "Keqing"],
    klee: [PYRO, CATALYST, MONDSTADT, "Klee"],
    sara: [ELECTRO, BOW, INAZUMA, "Kujou Sara"],
    shinobu: [ELECTRO, SWORD, INAZUMA, "Kuki Shinobu"],
    layla: [CRYO, SWORD, SUMERU, "Layla"],
    lisa: [ELECTRO, CATALYST, MONDSTADT, "Lisa"],
    mona: [HYDRO, CATALYST, MONDSTADT, "Mona"],
    nahida: [DENDRO, CATALYST, SUMERU, "Nahida"],
    nilou: [HYDRO, SWORD, SUMERU, "Nilou"],
    ningguang: [GEO, CATALYST, LIYUE, "Ningguang"],
    noelle: [GEO, CLAYMORE, MONDSTADT, "Noelle"],
    qiqi: [CRYO, SWORD, LIYUE, "Qiqi"],
    raiden: [ELECTRO, POLEARM, INAZUMA, "Raiden Shogun"],
    razor: [ELECTRO, CLAYMORE, MONDSTADT, "Razor"],
    rosaria: [CRYO, POLEARM, MONDSTADT, "Rosaria"],
    kokomi: [HYDRO, CATALYST, INAZUMA, "Sangonomiya Kokomi"],
    sayu: [ANEMO, CLAYMORE, INAZUMA, "Sayu"],
    shenhe: [CRYO, POLEARM, LIYUE, "Shenhe"],
    heizou: [ANEMO, CATALYST, INAZUMA, "Shikanoin Heizou"],
    sucrose: [ANEMO, CATALYST, MONDSTADT, "Sucrose"],
    tartaglia: [HYDRO, BOW, SNEZHNAYA, "Tartaglia"],
    thoma: [PYRO, POLEARM, INAZUMA, "Thoma"],
    tighnari: [DENDRO, BOW, SUMERU, "Tighnari"],
    traveler: [OTHER, SWORD, OTHER_REGION, "Traveler"],
    venti: [ANEMO, BOW, MONDSTADT, "Venti"],
    wanderer: [ANEMO, CATALYST, SUMERU, "Wanderer"],
    xiangling: [PYRO, POLEARM, LIYUE, "Xiangling"],
    xiao: [ANEMO, POLEARM, LIYUE, "Xiao"],
    xingqiu: [HYDRO, SWORD, LIYUE, "Xingqiu"],
    xinyan: [PYRO, CLAYMORE, LIYUE, "Xinyan"],
    yae: [ELECTRO, CATALYST, INAZUMA, "Yae Miko"],
    yanfei: [PYRO, CATALYST, LIYUE, "Yanfei"],
    yelan: [HYDRO, BOW, LIYUE, "Yelan"],
    yoimiya: [PYRO, BOW, INAZUMA, "Yoimiya"],
    yunjin: [GEO, POLEARM, LIYUE, "Yun Jin"],
    zhongli: [GEO, POLEARM, LIYUE, "Zhongli"],
};

export const character_images = {
    albedo: "https://static.wikia.nocookie.net/gensin-impact/images/0/00/Character_Albedo_Thumb.png",
    alhaitham: "https://i.imgur.com/k9YrEOj.png",
    aloy: "https://static.wikia.nocookie.net/gensin-impact/images/6/6a/Character_Aloy_Thumb.png",
    amber: "https://static.wikia.nocookie.net/gensin-impact/images/c/c6/Character_Amber_Thumb.png",
    itto: "https://static.wikia.nocookie.net/gensin-impact/images/7/79/Character_Arataki_Itto_Thumb.png",
    barbara:
        "https://static.wikia.nocookie.net/gensin-impact/images/7/72/Character_Barbara_Thumb.png",
    beidou: "https://static.wikia.nocookie.net/gensin-impact/images/6/61/Character_Beidou_Thumb.png",
    bennett:
        "https://static.wikia.nocookie.net/gensin-impact/images/7/7b/Character_Bennett_Thumb.png",
    candace:
        "https://static.wikia.nocookie.net/gensin-impact/images/b/bf/Character_Candace_Thumb.png",
    chongyun:
        "https://static.wikia.nocookie.net/gensin-impact/images/6/68/Character_Chongyun_Thumb.png",
    collei: "https://static.wikia.nocookie.net/gensin-impact/images/9/9e/Character_Collei_Thumb.png",
    cyno: "https://static.wikia.nocookie.net/gensin-impact/images/d/d1/Character_Cyno_Thumb.png",
    dainsleif:
        "https://static.wikia.nocookie.net/gensin-impact/images/7/70/Character_Dainsleif_Thumb.png",
    diluc: "https://static.wikia.nocookie.net/gensin-impact/images/0/02/Character_Diluc_Thumb.png",
    diona: "https://static.wikia.nocookie.net/gensin-impact/images/b/b9/Character_Diona_Thumb.png",
    dori: "https://static.wikia.nocookie.net/gensin-impact/images/9/90/Character_Dori_Thumb.png",
    eula: "https://static.wikia.nocookie.net/gensin-impact/images/d/d3/Character_Eula_Thumb.png",
    faruzan:
        "https://static.wikia.nocookie.net/gensin-impact/images/a/a1/Character_Faruzan_Thumb.png",
    fischl: "https://static.wikia.nocookie.net/gensin-impact/images/1/14/Character_Fischl_Thumb.png",
    ganyu: "https://static.wikia.nocookie.net/gensin-impact/images/0/0a/Character_Ganyu_Thumb.png",
    gorou: "https://static.wikia.nocookie.net/gensin-impact/images/5/56/Character_Gorou_Thumb.png",
    hutao: "https://static.wikia.nocookie.net/gensin-impact/images/a/a4/Character_Hu_Tao_Thumb.png",
    jean: "https://static.wikia.nocookie.net/gensin-impact/images/8/89/Character_Jean_Thumb.png",
    kazuha: "https://static.wikia.nocookie.net/gensin-impact/images/f/f0/Character_Kaedehara_Kazuha_Thumb.png",
    kaeya: "https://static.wikia.nocookie.net/gensin-impact/images/3/33/Character_Kaeya_Thumb.png",
    ayaka: "https://static.wikia.nocookie.net/gensin-impact/images/f/fd/Character_Kamisato_Ayaka_Thumb.png",
    ayato: "https://static.wikia.nocookie.net/gensin-impact/images/a/a2/Character_Kamisato_Ayato_Thumb.png",
    keqing: "https://static.wikia.nocookie.net/gensin-impact/images/0/06/Character_Keqing_Thumb.png",
    klee: "https://static.wikia.nocookie.net/gensin-impact/images/c/c3/Character_Klee_Thumb.png",
    sara: "https://static.wikia.nocookie.net/gensin-impact/images/9/96/Character_Kujou_Sara_Thumb.png",
    shinobu:
        "https://static.wikia.nocookie.net/gensin-impact/images/3/37/Character_Kuki_Shinobu_Thumb.png",
    layla: "https://static.wikia.nocookie.net/gensin-impact/images/9/93/Character_Layla_Thumb.png",
    lisa: "https://static.wikia.nocookie.net/gensin-impact/images/5/51/Character_Lisa_Thumb.png",
    mona: "https://static.wikia.nocookie.net/gensin-impact/images/a/a0/Character_Mona_Thumb.png",
    nahida: "https://static.wikia.nocookie.net/gensin-impact/images/c/cf/Character_Nahida_Thumb.png",
    nilou: "https://static.wikia.nocookie.net/gensin-impact/images/a/a5/Character_Nilou_Thumb.png",
    ningguang:
        "https://static.wikia.nocookie.net/gensin-impact/images/2/2b/Character_Ningguang_Thumb.png",
    noelle: "https://static.wikia.nocookie.net/gensin-impact/images/a/ab/Character_Noelle_Thumb.png",
    qiqi: "https://static.wikia.nocookie.net/gensin-impact/images/d/d5/Character_Qiqi_Thumb.png",
    raiden: "https://static.wikia.nocookie.net/gensin-impact/images/5/52/Character_Raiden_Shogun_Thumb.png",
    razor: "https://static.wikia.nocookie.net/gensin-impact/images/1/1d/Character_Razor_Thumb.png",
    rosaria:
        "https://static.wikia.nocookie.net/gensin-impact/images/f/f6/Character_Rosaria_Thumb.png",
    kokomi: "https://static.wikia.nocookie.net/gensin-impact/images/c/cc/Character_Sangonomiya_Kokomi_Thumb.png",
    sayu: "https://static.wikia.nocookie.net/gensin-impact/images/e/ec/Character_Sayu_Thumb.png",
    shenhe: "https://static.wikia.nocookie.net/gensin-impact/images/5/58/Character_Shenhe_Thumb.png",
    heizou: "https://static.wikia.nocookie.net/gensin-impact/images/e/e4/Character_Shikanoin_Heizou_Thumb.png",
    sucrose:
        "https://static.wikia.nocookie.net/gensin-impact/images/6/61/Character_Sucrose_Thumb.png",
    tartaglia:
        "https://static.wikia.nocookie.net/gensin-impact/images/5/53/Character_Tartaglia_Thumb.png",
    thoma: "https://static.wikia.nocookie.net/gensin-impact/images/8/8a/Character_Thoma_Thumb.png",
    tighnari:
        "https://static.wikia.nocookie.net/gensin-impact/images/9/91/Character_Tighnari_Thumb.png",
    traveler:
        "https://static.wikia.nocookie.net/gensin-impact/images/7/71/Character_Traveler_Thumb.png",
    unknown:
        "https://static.wikia.nocookie.net/gensin-impact/images/7/74/Character_Unknown_Thumb.png",
    venti: "https://static.wikia.nocookie.net/gensin-impact/images/8/8d/Character_Venti_Thumb.png",
    wanderer:
        "https://static.wikia.nocookie.net/gensin-impact/images/f/f2/Character_Wanderer_Thumb.png",
    xiangling:
        "https://static.wikia.nocookie.net/gensin-impact/images/a/a0/Character_Xiangling_Thumb.png",
    xiao: "https://static.wikia.nocookie.net/gensin-impact/images/b/b9/Character_Xiao_Thumb.png",
    xingqiu:
        "https://static.wikia.nocookie.net/gensin-impact/images/4/4a/Character_Xingqiu_Thumb.png",
    xinyan: "https://static.wikia.nocookie.net/gensin-impact/images/9/9d/Character_Xinyan_Thumb.png",
    yae: "https://static.wikia.nocookie.net/gensin-impact/images/5/57/Character_Yae_Miko_Thumb.png",
    yanfei: "https://static.wikia.nocookie.net/gensin-impact/images/1/1f/Character_Yanfei_Thumb.png",
    yelan: "https://static.wikia.nocookie.net/gensin-impact/images/a/a8/Character_Yelan_Thumb.png",
    yoimiya:
        "https://static.wikia.nocookie.net/gensin-impact/images/0/05/Character_Yoimiya_Thumb.png",
    yunjin: "https://static.wikia.nocookie.net/gensin-impact/images/c/cb/Character_Yun_Jin_Thumb.png",
    zhongli:
        "https://static.wikia.nocookie.net/gensin-impact/images/c/c2/Character_Zhongli_Thumb.png",
};
