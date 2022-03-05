currentDate = new Date()

const setDate = document.getElementById('date-select')
const setTime = document.getElementById('time-select')
const timeZoneOptions = []
const setTimeZone = document.getElementById('timezone-select');
let timeZoneOffset = (currentDate.toString()).substring(25, 33)
const monthNames = ['Jan', 'Feb', 'Mar', "Apr", 'May', "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const monthNamesLong = ['January', 'February', 'March', 'April', 'May', 'June', "July", "August", 'September', 'October', "November", "December"]
const days = ['Sunday', 'Monday', "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
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
    const fromGMT = (setTimeZone.options[setTimeZone.selectedIndex].text).substring(1,10)
    let yearMonthDay = (setDate.value).split('-')
    let hoursMinutes = (setTime.value).split(':')
    const hourChange = Number(fromGMT.slice(4,6))
    const minChange = Number(fromGMT.slice(7,9))
    unix = Math.floor((new Date(Number(yearMonthDay[0]) , Number(yearMonthDay[1]) - 1, Number(yearMonthDay[2]), hoursMinutes[0], hoursMinutes[1])).getTime()/ 1000)
    if (fromGMT[3] === '-') {
        unix -= hourChange * 60 * 60
        unix -= minChange * 60
    } else {
        unix += hourChange * 60 * 60
        unix += minChange * 60
    }
    const adjustedForTimezone = new Date(unix *1000)
    let minutes = (adjustedForTimezone.getMinutes()).toString()
    let hours = (adjustedForTimezone.getHours()).toString()
    let day = (adjustedForTimezone.getDate()).toString()
    let month = (adjustedForTimezone.getMonth() + 1).toString()
    let year = (adjustedForTimezone.getFullYear()).toString()
    hoursMinutes[0] = hours.length === 1?'0' + hours:hours
    hoursMinutes[1] = minutes.length === 1?'0' + minutes:minutes
    yearMonthDay[0] = year
    yearMonthDay[1] = month.length === 1? '0'+month:month
    yearMonthDay[2] = day.length === 1? '0'+day:day
    const strButtons = document.getElementsByClassName('time-code')
    for(let i = 0; i < strButtons.length; i++) {
        txt = strButtons[i].id
        strButtons[i].id = (txt.slice(0,3) + unix.toString() + txt.slice(txt.length - 3, txt.length))
    }
    const timeCodes = document.getElementsByClassName('time-code')
    const shortTime = (Number(hoursMinutes[0]) > 12)? (Number(hoursMinutes[0]) - 12).toString() + ':' + hoursMinutes[1] + ' PM' : hoursMinutes[0] + ':' + hoursMinutes[1] + ' AM';
    const longTime = (Number(hoursMinutes[0]) > 12)? ((Number(hoursMinutes[0]) - 12).toString() + ':' + hoursMinutes[1] + ':00' + 'PM') : hoursMinutes[0] + ':' + hoursMinutes[1] + ':00 ' +' AM';
    const shortDate =  yearMonthDay[1] + '/' + yearMonthDay[2] + '/' + yearMonthDay[0]
    const longDate = yearMonthDay[2] + ' ' + monthNames[Number(yearMonthDay[1] - 1)] + ' ' + yearMonthDay[0]
    const shortDateTime = longDate + ' ' + shortTime
    const dayIndex  = new Date(unix * 1000).getDay()
    const longDateTime = days[dayIndex]  +', ' + monthNames[Number(yearMonthDay[1]-1)] + ', ' + yearMonthDay[2] + ', ' + yearMonthDay[0] + ', ' + shortTime
    const relativeTime = relativeString(currentDate, unix)
    // const longTime = 
    for(let i = 0; i < timeCodes.length; i++) {
        code = timeCodes[i].title
        switch (code) {
            case ':t':
                timeCodes[i].textContent = shortTime
                break;
            case ':T':
                timeCodes[i].textContent = longTime
                break;
            case ':d':
                timeCodes[i].textContent = shortDate
                break;
            case ':D':
                timeCodes[i].textContent = longDate
                break;
            case ':f':
                timeCodes[i].textContent = shortDateTime
                break;
            case ':F':
                timeCodes[i].textContent = longDateTime
                break;
            case ':R':
                timeCodes[i].textContent = relativeTime.toString()
                break;
        }
    }
}

const copyButtons = document.getElementsByClassName('time-code')
for (let i = 0; i < copyButtons.length; i++) {
    copyButtons[i].addEventListener('click', copyClipboard)
}

function copyClipboard(e) {
    const text = e.target.id
    navigator.clipboard.writeText(text);
}

function relativeString(curr, test) {
    currStamp = curr.getTime() / 1000
    let secondDifference = Math.round(currStamp - test)
    if (secondDifference > 5) {// PAST 
        if (secondDifference < 60) { // less than a minute
            return (secondDifference).toString() + ' Seconds Ago'
        } else if (secondDifference < 3600) { // less than an hour
            return (Math.round(secondDifference / 60).toString() + ' Minutes Ago')
        } else if (secondDifference < 86400) { // less than a day
            return (Math.round(secondDifference / 3600).toString() + ' Hours Ago')
        }else if (secondDifference < 604800) { // less than a week
            return (Math.round(secondDifference / 86400).toString() + ' Days Ago')
        } else if (secondDifference < 2628000) { // less than a month
            return (Math.round(secondDifference / 604800).toString() + ' Weeks Ago')
        } else if (secondDifference < 31536000) { // less than year
            return (Math.round(secondDifference / 2628000).toString() + ' Months Ago')
        } else {return (Math.round(secondDifference / 31536000).toString() + " Years Ago")}
    } else if (secondDifference < 5) {
        secondDifference = Math.abs(secondDifference)
        if (secondDifference < 60) { // less than a minute
            return 'In ' + (secondDifference).toString() + ' Seconds'
        } else if (secondDifference < 3600) { // less than an hour
            return 'In ' + (Math.round(secondDifference / 60).toString() + ' Minutes')
        } else if (secondDifference < 86400) { // less than a day
            return 'In ' + (Math.round(secondDifference / 3600).toString() + ' Hours')
        }else if (secondDifference < 604800) { // less than a week
            return 'In ' + (Math.round(secondDifference / 86400).toString() + ' Days')
        } else if (secondDifference < 2628000) { // less than a month
            return 'In ' + (Math.round(secondDifference / 604800).toString() + ' Weeks')
        } else if (secondDifference < 31536000) { // less than year
            return 'In ' + (Math.round(secondDifference / 2628000).toString() + ' Months')
        } else {return ('In ' + Math.round(secondDifference / 31536000).toString() + " Years")}
    } else {
        return "Now!"
    }
}