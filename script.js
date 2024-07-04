const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

class TrieNode {
    constructor() {
        this.isEndOfWord = false;
        this.children = new Map();
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.isEndOfWord = true;
    }

    containsSubstring(password) {
        for (let i = 0; i < password.length; i++) {
            let node = this.root;
            for (let j = i; j < password.length; j++) {
                if (!node.children.has(password[j])) {
                    break;
                }
                node = node.children.get(password[j]);
                if (node.isEndOfWord) {
                    return true;
                }
            }
        }
        return false;
    }
}

// Example usage
const trie = new Trie();
const disallowedWords = ["1", "password", "admin"
,"123", "abc", "qwe", "asd", "zxc", "111", "222", "333", "444", "555", "666", "777", "888", "999", "aaa", "bbb", "ccc", "ddd", "eee", "fff", "ggg", "hhh", "iii", "jjj", "kkk", "lll", "mmm", "nnn", "ooo", "ppp", "qqq", "rrr", "sss", "ttt", "uuu", "vvv", "www", "xxx", "yyy", "zzz", "q1w", "e2r", "t3y", "u4i", "o5p", "a1s", "d2f", "g3h", "j4k", "l5z", "x1c", "v2b", "n3m", "a1b", "c2d", "e3f", "g4h", "i5j", "k6l", "m7n", "o8p", "q9r", "s0t", "u1v", "w2x", "y3z", "p4q", "r5s", "t6u", "v7w", "x8y", "z9a", "b1c", "d2e", "f3g", "h4i", "j5k", "l6m", "n7o", "p8q", "r9s", "t0u", "v1w", "x2y", "z3a", "q2w", "e3r", "t4y", "u5i", "o6p", "a7s", "d8f", "g9h", "j0k", "1a!", "2b@", "3c#", "4d$", "5e%", "6f^", "7g&", "8h*", "9i(", "0j)", "q1!", "w2@", "e3#", "r4$", "t5%", "y6^", "u7&", "i8*", "o9(", "p0)", "a1!", "s2@", "d3#", "f4$", "g5%", "h6^", "j7&", "k8*", "l9(", "z0)", "x1!", "c2@", "v3#", "b4$", "n5%", "m6^", "q!1", "w@2", "e#3", "r$4", "t%5", "y^6", "u&7", "i8", "o(9", "p)0", "a!1", "s@2", "d#3", "f$4", "g%5", "h^6", "j&7", "k8", "l(9", "z)0", "x!1", "c@2", "v#3", "b$4", "n%5", "m^6", "1!a", "2@b", "3#c", "4$d", "5%e", "6^f", "7&g", "8*h", "9(i", "0)j", "!1q", "@2w", "#3e", "$4r", "%5t", "^6y", "&7u", "*8i", "(9o", ")0p", "!1a", "@2s", "#3d", "$4f", "%5g", "^6h", 
"&7j", "*8k", "(9l", ")0z", "!1x", "@2c", "#3v", "$4b", "%5n", "^6m"];
disallowedWords.forEach(word => trie.insert(word));


//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//ste strength circle color to grey
setIndicator("#ccc");


//set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //or kuch bhi karna chahiye ? - HW
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
if(checkCount>=2 && passwordLength>3){
    if (trie.containsSubstring(password)) {
        setIndicator("#0f0");
    } else {
        setIndicator("#f00");
    }
}
else{
    setIndicator("#0f0");
}
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";


    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});