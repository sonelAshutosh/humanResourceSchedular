export function formatDateToString(inputDate,separator='-',skipMonth=false) {

        if(!inputDate) return undefined;
        
        if(!(inputDate instanceof Date)){
            inputDate = parseDate(inputDate);
        }
        
        if(!inputDate) return undefined;

        let date, month, year;
        
        date = inputDate.getDate();
        month = inputDate.getMonth() + 1;
        year = inputDate.getFullYear();

            date = date
                .toString()
                .padStart(2, '0');

            month = month
                .toString()
                .padStart(2, '0');
        
        if(skipMonth)
            return `${year.substring(year.length-2)}${separator}${date}`;
        return `${year}${separator}${month}${separator}${date}`;

}
 
export function parseDate(inputString){
    //console.log("###########",inputString);
    if(!inputString) return null;
    if(inputString instanceof Date) return inputString;
    let d = new Date();
    d.setTime(Date.parse(inputString));
    return d;
}

export function getRelativeDate(inputDate,dayGradient=0,monGradient=0,yearGradient=0){
    if(!inputDate) return undefined;
        
    if(!(inputDate instanceof Date)){
        inputDate = parseDate(inputDate);
    }
    
    if(!inputDate) return undefined;

    return new Date(inputDate.getFullYear() + yearGradient, inputDate.getMonth() + monGradient, inputDate.getDate() + dayGradient);
}