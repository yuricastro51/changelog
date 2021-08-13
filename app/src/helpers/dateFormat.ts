function dateFormat(date: string) {
	var myDate = new Date(date),
		day = myDate.getDate().toString(),
		dayF = day.length == 1 ? '0' + day : day,
		month = (myDate.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
		monthF = month.length == 1 ? '0' + month : month,
		yearF = myDate.getFullYear();
	return dayF + '/' + monthF + '/' + yearF;
}

export { dateFormat };
