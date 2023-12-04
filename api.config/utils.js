export function checkForDigit(event){
    if(!((event.which >= 48 && event.which <= 57) || event.which == 8 || event.which == 9 || event.which == 46 || event.which == 37 || event.which == 39))
        event.preventDefault();
};

export function checkForDigitAllowDot(event){
    if(!((event.which >= 48 && event.which <= 57) || event.which == 8 || event.which == 9 || event.which == 46 || event.which == 37 || event.which == 39 || event.which == 190))
        event.preventDefault();
};