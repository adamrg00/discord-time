currentDate = new Date()

const setDate = document.getElementById('date-select')
const setTime = document.getElementById('time-select')
const timeZoneOptions = []
const setTimeZone = document.getElementById('timezone-select');
let timeZoneOffset = (currentDate.toString()).substring(25, 33)

setDate.valueAsDate = currentDate
setTime.value = currentDate.toISOString().substring(11,16)

timeZoneOffset = timeZoneOffset.slice(0, 6) + ':' + timeZoneOffset.slice(6,8)

for (let i  = 0; i < (setTimeZone.options).length; i++) {
    if (setTimeZone.options[i].text.substring(1,10) === timeZoneOffset) {
        setTimeZone.value = setTimeZone.options[i].value
    }
    timeZoneOptions.push(setTimeZone.options[i].text)
}
const inputFields = document.getElementsByClassName('input')
for (let i = 0; i < inputFields.length; i++) {
    inputFields[i].addEventListener('input', setUnix)
}

let unix = 0
setUnix()
function setUnix() {
    const date = setDate.value
    const time = setTime.value
    const fromGMT = (setTimeZone.options[setTimeZone.selectedIndex].text).substring(1,10)
    const ymd = date.split('-')
    const hhmm = time.split(':')
    const thisDate = new Date(Number(ymd[0]) , Number(ymd[1]) - 1, Number(ymd[2]), hhmm[0], hhmm[1])
    unix = Math.floor(thisDate.getTime()/ 1000)
    const op = fromGMT[3]
    const hourChange = Number(fromGMT.slice(4,6))
    const minChange = Number(fromGMT.slice(7,9))
    if (op === '-') {
        unix -= hourChange * 60 * 60
        unix -= minChange * 60
    } else {
        unix += hourChange * 60 * 60
        unix += minChange * 60
    }
    const strButtons = document.getElementsByClassName('time-format-button')
    for(let i = 0; i < strButtons.length; i++) {
        txt = strButtons[i].innerText
        strButtons[i].innerText = (txt.slice(0,3) + unix.toString() + txt.slice(txt.length - 3, txt.length))
    }
}

const copyButtons = document.getElementsByClassName('time-format-button')
for (let i = 0; i < copyButtons.length; i++) {
    copyButtons[i].addEventListener('click', copyClipboard)
}

function copyClipboard(e) {
    const text = e.target.innerText
    navigator.clipboard.writeText(text);
}