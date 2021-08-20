exports.dayType= function (){
    const today = new Date();
    dayNumber = today.getDay()
    var options = {
        weekday: 'long',
    }

    return today.toLocaleDateString('en-US',options)
    
}

exports.dateType = function (){
    const today = new Date();
    dayNumber = today.getDay()
    var options = {
        day:'numeric',
        year : 'numeric',
        month: 'short'
    }

    return today.toLocaleDateString('en-US',options)
    
}