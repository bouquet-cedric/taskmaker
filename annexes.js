var left;
var right;
var tasks = [];
var liens = [];

const Etat = {
    FINI: "F",
    COMMENCE: "C",
    ATTENTE: "A",
    SKIP: "S",
    DEFAULT : "D";
    get(letter) {
        switch (letter) {
            case "F":
                return FINI;
            case "A":
                return ATTENTE;
            case "C":
                return COMMENCE;
            case "S":
                return SKIP;
            case "D":
                return DEFAULT;
            default:
                return DEFAULT;
        }
        return DEFAULT;
    }
}

class Tache {
    constructor(intitule, etat) {
        this.en = intitule;
        this.etat = etat;
    }
    getEtat() {
        return this.etat;
    }
    getColor() {
        let tmp = this.getEtat();
        if (tmp != null) {
            let res = Etat.get(tmp);
            return res;
        }
    }
}

function init(id, id2) {
    var fl = document.getElementById(id);
    if (fl != null) {
        var h2 = document.createElement("h2");
        var hr = document.createElement("hr");
        hr.classList.add("titre");
        fl.appendChild(h2);
        fl.appendChild(hr);
        h2.textContent = "Liens utiles";
        var div = document.createElement("div");
        div.id = LINK_ID;
        fl.appendChild(div);

    }
    var ft = document.getElementById(id2);
    if (ft != null) {
        ACTIF_TASK = 1;
        NB_PAGES = Math.ceil(nbDays() / NB_DAY_BY_PAGE);
        left = document.createElement("input");
        right = document.createElement("input");
        left.classList.add("move");
        right.classList.add("move");
        left.id = B_LEFT_ID;
        right.id = B_RIGHT_ID;
        left.type = "button";
        right.type = "button";
        left.addEventListener('click', function() { move('-') });
        right.addEventListener('click', function() { move('+') });
        var div = document.createElement("div");
        div.classList.add("btns");
        div.appendChild(left);
        div.appendChild(right);
        ft.appendChild(div);


        var titre = document.createElement("h2");
        var hr = document.createElement("hr");
        hr.classList.add("titre");
        titre.textContent = "Tâches";
        ft.appendChild(titre);
        ft.appendChild(hr);

        for (let i = 1; i <= NB_PAGES; i++) {
            var ul = document.createElement("ul");
            ft.appendChild(ul);
            ul.id = "t" + i;
        }
    }
}

function move(dir) {
    var tmp = ACTIF_TASK;
    var d = document.getElementById("t" + tmp);
    if (dir == '-') {
        if (ACTIF_TASK != 1) {
            ACTIF_TASK--;
        }
    } else if (dir == '+') {
        if (ACTIF_TASK != NB_PAGES) {
            ACTIF_TASK++;
        }
    }
    var d2 = document.getElementById("t" + ACTIF_TASK);
    d.style.display = "none";
    d2.style.display = "inherit";
    gereNum();
}

function add(elt, src) {
    var d = document.getElementById(LINK_ID);
    var li = document.createElement("span");
    var a = document.createElement("a");
    d.appendChild(li);
    li.appendChild(a);
    li.classList.add("menu");
    a.href = src;
    a.target = "_blank";
    a.textContent = elt;
}


function IllegalValue(variable, correct, type) {
    this.variable = variable;
    this.corr = correct;
    this.type = type;
    this.name = "Illegal_Value"
    this.get = function() {
        let res = "";
        for (let i in correct) {
            res += correct[i] + ", ";
        }
        res = res.slice(0, -2);
        return this.name + "\n" + variable + " isn't a " + type + "\nAttendu : " + res + "\nType attendu : " + type + "\nType reçu : " + typeof(variable);
    }
};

function IllegalId(id) {
    this.ID = id;
    this.name = "Illegal_Id"
    this.get = function() {
        return this.name + "\n" + "The id '" + this.ID + "' doesn't exists";
    }
}

function checkType(v, type, exp) {
    if (typeof(v) == type) return true;
    throw new IllegalValue(v, exp, type);
}

function checkBoolean(v) {
    checkType(v, "boolean", [true, false]);
}

function checkInt(v) {
    checkType(v, "number", [0, 2, 3, 5]);
}

function checkString(v) {
    checkType(v, "string", "une_chaine");
}

function checkOnOff(v) {
    checkString(v);
    if (v === "on") return true;
    if (v === "off") return true;
    if (v === "ON") return true;
    if (v === "OFF") return true;
    throw new IllegalValue(v, ["on", "off", "ON", "OFF"], "string");
}

function checkColor(v) {
    var tmp = document.createElement("span");
    tmp.style.color = "black";
    tmp.style.color = v;
    if (v != "black" && tmp.style.color == "black")
        throw new IllegalValue(v, ["rgb(0,0,0)", "blue"], "color");
    return true;
}

function checkId(id) {
    checkString(id);
    if (document.getElementById(id) == null)
        throw new IllegalId(id);

}

function UndefinedVar(v) {
    this.name = "Undefined_Variable";
    this.get = function() {
        return this.name + " " + v;
    }
}

function test(va, f) {
    if (va in window) {} else {
        let e = new UndefinedVar(va);
        console.log("* " + va + " " + e.name + " \u274C");
        throw e.get();
    }
    try {
        f(window[va]);
        console.log("* " + va + " \u2705");
    } catch (e) {
        console.log("* " + va + " " + e.name + " \u274C");
        throw e.get();
    }
}


function testConfig() {
    console.log("Test de la configuration ...");
    test("NB_DAY_BY_PAGE", checkInt);
    test("ACTIVE_PAGE", checkBoolean);
    test("LOGO", checkOnOff);
    test("DIV_LINK_ID", checkId);
    test("DIV_TASK_ID", checkId);
    test("LINK_ID", checkString);
    test("B_LEFT_ID", checkString);
    test("B_RIGHT_ID", checkString);
    test("FOND_TASK", checkColor);
    test("BG_LEFT", checkColor);
    test("BG_RIGHT", checkColor);
    test("LOGO_COLOR", checkColor);
    test("COMMENCE", checkColor);
    test("ATTENTE", checkColor);
    test("SKIP", checkColor);
    test("DEFAULT", checkColor);
    test("JOUR", checkColor);
    test("FLECHE", checkColor);
}

function gereNum() {
    if (ACTIVE_PAGE) {
        left.value = "< " + (ACTIF_TASK - 1);
        right.value = (ACTIF_TASK + 1) + " >";
    } else {
        left.value = "< ";
        right.value = " >";
    }
    if (ACTIF_TASK - 1 == 0)
        left.style.display = "none";
    else
        left.style.display = "inherit";
    if (ACTIF_TASK == NB_PAGES)
        right.style.display = "none";
    else
        right.style.display = "inherit";
}

function where(jour, taches, bln = false) {
    gereNum();
    if (bln == true) {
        var old = document.getElementById("t" + ACTIF_TASK);
        old.style.display = "none";
        ACTIF_TASK++;
        gereNum();
    }
    var d = document.getElementById("t" + ACTIF_TASK);
    var li = null;
    for (let i in taches) {
        var sp = document.createElement("span");
        var sp2 = document.createElement("span");
        var ol = document.createElement("ol");
        sp.classList.add("day");
        sp2.classList.add("task");
        if (li == null) {
            li = document.createElement("li");
            li.appendChild(sp);
            d.appendChild(li);
        }
        var arrow = document.createElement("span");
        ol.appendChild(arrow);
        arrow.textContent = "\u2B9A ";
        arrow.style.color = FLECHE;
        ol.appendChild(sp2);
        li.appendChild(ol);
        sp.textContent = jour + " : ";
        sp2.textContent = taches[i].en;
        sp2.id = jour + "_" + i;
    }
}

function apply(tab, whats) {
    var cpt = 0;
    if (tab == []) return;
    for (let i in tab) {
        if (whats == "liens") add(i, tab[i]);
        if (whats == "tasks") {
            if (cpt < NB_DAY_BY_PAGE) where(i, tab[i]);
            else {
                where(i, tab[i], true);
                cpt = 0;
            }
            cpt++;
        }
    }
    if (tab == tasks) color();
}

function end(id, color = "green") {
    var sp = document.getElementById(id);
    sp.style.color = color;
}

function color() {
    for (let i in tasks) {
        for (let j in tasks[i]) {
            var tache = tasks[i][j];
            if (tache.getEtat() != undefined) {
                end(i + "_" + j, tache.getColor());
            }
        }
    }
}

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 37) {
        e.preventDefault();
        move('-');
    }
    if (e.keyCode == 39) {
        e.preventDefault();
        move('+');
    }
})

function nbDays() {
    let cpt = 0;
    for (let _ in tasks) {
        cpt++;
    }
    return cpt;
}

function styleTitre(titreTag) {
    var titre = document.getElementsByTagName(titreTag);
    for (let i = 0; i < titre.length; i++) {
        titre[i].style.textAlign = "center";
        if (titreTag == "h2") {
            titre[i].style.marginTop = "0";
            titre[i].style.marginBottom = "0";
        }
    }
}

function styleUl() {
    var uls = document.getElementsByTagName("ul");
    for (let i = 0; i < uls.length; i++) {
        uls[i].style.listStyle = "none";
    }
}

function styleJour() {
    var days = document.getElementsByClassName("day");
    for (let i = 0; i < days.length; i++) {
        days[i].style.color = JOUR;
        days[i].style.fontFamily = "cursive";
        days[i].style.textDecoration = "underline solid black";
    }
}

function styleTask() {
    var tasks = document.getElementsByClassName("task");
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].style.fontFamily = "monospace";
        tasks[i].style.fontWeight = "bolder";
        tasks[i].style.letterSpacing = "-1px";
        tasks[i].style.fontSize = "large";
    }
}

function styleInputButton() {
    var inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        let elt = inputs[i];
        if (elt.type == "button") {
            elt.style.borderRadius = "50px";
            elt.style.width = "1cm";
            elt.style.color = "whitesmoke";
            elt.style.fontFamily = "cursive";
            elt.style.cursor = "pointer";
        }
    }
}

function styleLeft() {
    left.style.backgroundColor = BG_LEFT;
    left.style.left = "0";
    left.style.position = "absolute";
    left.style.marginTop = "0";
}

function styleRight() {
    right.style.backgroundColor = BG_RIGHT;
    right.style.right = "0";
    right.style.position = "absolute";
    right.style.marginTop = "0";
}

function styleHrTitre() {
    var hrs = document.getElementsByTagName("hr");
    for (let i = 0; i < hrs.length; i++) {
        let elt = hrs[i];
        if (elt.classList.contains("titre")) {
            elt.style.width = "15%";
            elt.style.height = "2px";
            elt.style.marginTop = "0";
            elt.style.backgroundColor = "black";
        }
    }
}

function styleLien() {
    var d = document.getElementsByClassName("menu");
    for (let i = 0; i < d.length; i++) {
        d[i].style.border = "1px solid black";
        d[i].style.marginRight = "10px";
        d[i].style.padding = "2px 10px";
        d[i].style.backgroundColor = "grey";
        for (let j = 0; j < d[i].children.length; j++) {
            if (d[i].children[j].tagName = "A") {
                d[i].children[j].style.color = "yellow";
            }
        }
    }
}

function stylize() {
    let task = document.getElementById(DIV_TASK_ID);
    let link = document.getElementById(LINK_ID);

    if (task != null) {
        task.style.backgroundColor = FOND_TASK;
        task.style.overflowY = "auto";
        task.style.width = "100%";
    }
    if (link != null) {
        link.style.justifyContent = "center";
        link.style.alignItems = "center";
        link.style.marginTop = "2%";
    }

    styleTitre("h1");
    styleTitre("h2");
    styleTitre("h3");
    styleUl();
    styleJour();
    styleTask();
    styleInputButton();
    styleLeft();
    styleRight();
    styleHrTitre();
    styleLien();
}

function nameProduct() {
    let res = "";
    res += "  ___________               ___  ___                       \n"
    res += " |____   ____|        _    |   \\/   |      _              \n"
    res += "      | |            | |   | |\\  /| |     | |             \n"
    res += "      | |_____  ____ | | __| | \\/ | |_____| | __ __  ____ \n"
    res += "      | |  _  |/ ___|| |/ /| |    | |  _  | |/ / _ \\| _  |\n"
    res += "      | |  _  |\\___ \\|   < | |    | |  _  |   <| __/|   <\n"
    res += "      |_|_| |_||____/|_|\\_\\|_|    |_|_| |_|_|\\_\\___||_|\\_\\\n\n"
    return res;
}

function welcome() {
    // let res = "";
    // res += " ________             \n"
    // res += "| ______ |  _          \n"
    // res += "| |    | | |_|            \n"
    // res += "| |___/ /   _   ___   _  _  __   __  ___   _  _   _   _   ___           \n"
    // res += "| |   \\ \\  | | / _ \\ | \\| | \\ \\ / / / _ \\ | \\| | | | | | / _ \\         \n"
    // res += "| |____| | | | | __/ |    |  \\ v /  | __/ |    | | |_| | | __/                 \n"
    // res += "|________| |_| \\___| |_|\\_|   \\_/   \\___| |_|\\_|  \\___/  \\___|    \n"
    // res += ""
    let res = "";
    res += " ________             \n"
    res += "| ______ |_          \n"
    res += "| |    | |_|            \n"
    res += "| |___/ / _  ___  _  _ __   _____  _  _ _   _  ___           \n"
    res += "| |   \\ \\| |/ _ \\| \\| |\\ \\ / / _ \\| \\| | | | |/ _ \\         \n"
    res += "| |____| | |  __/|    | \\ v /| __/|    | |_| |  __/                 \n"
    res += "|________|_|\\___||_|\\_|  \\_/ \\___||_|\\_|\\___/ \\___|    \n"
    return res;
}

function logo() {
    var divName = document.createElement("div");
    divName.style.position = "absolute";
    divName.style.border = "1px dashed"
    divName.style.whiteSpace = "pre";
    divName.style.fontFamily = "monospace";
    divName.style.fontSize = "12px";
    divName.style.fontWeight = "bold";
    divName.textContent = nameProduct();
    document.body.appendChild(divName);
    divName.style.bottom = "0";
    divName.style.right = "0";
    divName.style.backgroundColor = LOGO_COLOR;
}

window.onload = function() {
    testConfig();
    init(DIV_LINK_ID, DIV_TASK_ID);

    apply(liens, "liens");
    apply(tasks, "tasks");
    stylize();
    console.log(welcome());
    console.log(nameProduct());
    if (LOGO === "ON" || LOGO === "on") logo();
}
