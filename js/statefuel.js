$(document).ready(function () {
	var averages = Promise.resolve(FuelAverages.GetStateAverages('truckmiles', '#Qp7D4jqCAW2Um2t'));
	
	averages.then((val) => {
		console.log(val);
		$('#current-day').html(FuelAverages.FormatDateMMddyyyy(new Date(val.CurrentDate)));
		$('#previous-day').html(FuelAverages.FormatDateMMddyyyy(new Date(val.PreviousDate)));

		var html = '';
		
		for (var i = 0; i < val.Averages.length; i++) {
			var avg = val.Averages[i];                
			html += `<tr><td>${avg.State}</td><td>${avg.CurrentAverage}</td><td>${avg.PreviousAverage}</td><td>${avg.Different.toFixed(2)}</td></tr>`;
		}
		
		$('#results').html(html);

	});

	

});

