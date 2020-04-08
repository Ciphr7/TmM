
$(document).ready(function () {
});

mapboxgl.accessToken = 'pk.eyJ1IjoicHJvbWlsZXMiLCJhIjoiY2psZHYzeWxiMDFtcTNxc3o4cnZxa2JuOCJ9.IrZnTJWyWKt6x1CIzT0Ahw';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v10'
});

//var runTripBtn = document.getElementById("run-trip");
var runTripBtn = $("#run-trip");
var newTrip = $("#newTrip");
var geoBTN = $("#geoBTN");

function setOriginToCurrentLocation() {
    var b = $("#SetToCurrentLocation").is(":checked");

    if (!b) {
        $("#origin").val("");

    } else if (navigator.geolocation) {
        var options = {
            maximumAge: 0,
            timeout:30000,
            enableHighAccuracy: true};
        navigator.geolocation.getCurrentPosition(success, error, [options]);

    } else {
        alert("HTML5 Not supported");
    }
}
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
function success(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    $("#origin").val(lat + ':' + lon);

}


/* When document is loaded fully... 
****************************************/


$("#SetToCurrentLocation").on("change", function () {
    setOriginToCurrentLocation();
});



$(runTripBtn).click(function () {
    runFullTrip();
});
function runFullTrip() {
    var origin = null;
    var originText = $('#origin').val();
    if(originText.indexOf(':') > -1) {
        var arr = originText.split(':');
        var lat = Number(arr[0]);
        var lon = Number(arr[1]);
        origin = new PRIMEWebAPI.TripLeg({ latitude: lat, longitude: lon });
    }
    else {
        origin = new PRIMEWebAPI.TripLeg({ locationText: $('#origin').val() });
    }
  
    var stop1 = new PRIMEWebAPI.TripLeg({ locationText: $('#stop1').val() });
    //var stop2 = new PRIMEWebAPI.TripLeg({ locationText: $('#stop2').val() });
    //var stop3 = new PRIMEWebAPI.TripLeg({ locationText: $('#stop3').val() });
    //  var stop4 = new PRIMEWebAPI.TripLeg({ locationText: $('#stop4').val() });
    //var destination = new PRIMEWebAPI.TripLeg({ locationText: $('#destination').val() });
    //var useHeading = $("#UseHeading").prop("checked");
    //var heading = Number($("#Heading").val());

    var arr = [];
    arr.push(origin);

    // if (useHeading) {
    //     origin.useHeading = true;
    //     origin.heading = heading;
    // }
    if ($('#origin').val() != '') {
        arr.push(stop1)
    }
    if ($('#stop1').val() != '') {
        arr.push(stop1)
    }
    //if ($('#stop3').val() != '') {
      //  arr.push(stop3)
    //}
    // if ($('#stop4').val() != '') {
       // arr.push(stop4)
    //}
    var myRtMethod = $('#rtMethod').change(function () {
        var selectedOption = $('#rtMethod option:selected');
        $('#myRtMethod').html('RtMethod = ' + selectedOption.val());
    });

    var fo = new PRIMEWebAPI.FuelOptimizationOptions({
        unitMPG: $('#setMPG').val(),
        unitTankCapacity: $('#setTankCapacity').val(),
        startGallons: $('#setStartGallon').val(),
        desiredEndGallons: $('#setDesiredEndGallon').val(),
        distanceOOR: $('#setDistanceOOR').val(),
        minimumGallonsToPurchase: $('#setMinGallons').val(),
        minimumTankGallonsDesired: $('#setMinTankGallons').val()
    });

    var closeBorder = $("#CloseBorder").prop("checked");
    var isHazmat = $("#IsHazmat").prop("checked");
    var avoidToll = $("#AvoidToll").prop("checked");
    var trip = new PRIMEWebAPI.Trip(
        {
            tripLegs: arr,
            routingMethod: PRIMEWebAPI.RoutingMethods.PRACTICAL,
            borderOpen: !closeBorder,
            avoidTollRoads: avoidToll,
            vehicleType: PRIMEWebAPI.VehicleTypes.TRACTOR3AXLETRAILER2AXLE,
            getDrivingDirections: true,
            getMapPoints: true,
            getStateMileage: true,
            getTripSummary: true,
            getFuelOptimization: true,
            getTruckStopsOnRoute: true,
            fuelOptimizationParameters: fo,
            isHazmat: isHazmat,
            unitMPG: 5
        });



    var test = $('#rtMethod').val();
    //alert(test)

    if (test == 'SHORTEST') {
        trip.routingMethod = PRIMEWebAPI.RoutingMethods.SHORTEST
    } else if (test == "INTERSTATE") {
        trip.routingMethod = PRIMEWebAPI.RoutingMethods.INTERSTATE
    }

    PRIMEWebAPI.runTrip(trip, handleTrip);

}


//function runFullTripGPS()
function runFullTripDetails() {
    var olat = Number($("#OLat").val());
    var olon = Number($("#OLon").val());
    // var dlat = Number($("#DLat").val());
    // var dlon = Number($("#DLon").val());
    
    // var useHeading = $("#UseHeading").prop("checked");
    // var heading = Number($("#Heading").val());
    
    var origin = new PRIMEWebAPI.TripLeg({ latitude: olat, longitude: olon });
    // var destination = new PRIMEWebAPI.TripLeg({ latitude: dlat, longitude: dlon });
    var arr = [];
    arr.push(origin);
    arr.push(destination);
    
    // if (useHeading) {
        //     origin.useHeading = true;
        //     origin.heading = heading;
        // }
        
        var closeBorder = $("#CloseBorder").prop("checked");
        var isHazmat = $("#IsHazmat").prop("checked");
        var avoidToll = $("#AvoidToll").prop("checked");
        var mpg = ($("#setMPG").val());
        
        var fo = new PRIMEWebAPI.FuelOptimizationOptions({
            unitMPG: mpg,
            unitTankCapacity: 180,
            startGallons: 150,
            desiredEndGallons: 25,
            distanceOOR: 4,
            minimumGallonsToPurchase: 50,
            minimumTankGallonsDesired: 20
        });
        
        
        var trip = new PRIMEWebAPI.Trip(
            {
                tripLegs: arr,
                routingMethod: PRIMEWebAPI.RoutingMethods.SHORTEST,
                borderOpen: !closeBorder,
                avoidTollRoads: avoidToll,
                vehicleType: PRIMEWebAPI.VehicleTypes.TRACTOR3AXLETRAILER2AXLE,
                getDrivingDirections: true,
                getMapPoints: false,
                getStateMileage: false,
                getTripSummary: true,
                getFuelOptimization: false,
                getTruckStopsOnRoute: false,
                fuelOptimizationParameters: fo,
                isHazmat: isHazmat,
                unitMPG: mpg
            });
            
            PRIMEWebAPI.runTrip(trip, handleTrip);
        }
        
        //trip time in hours and seconds
        function getTimeString(n, isSeconds) {
        
            if (isSeconds) n = Math.ceil(n / 60); ;
        
            var hours = (n < 60) ? 0 : Math.floor(n / 60);
        
            var minutes = n % 60;
        
            hours = hours.toString();
        
            if (hours.length == 1) hours = "0" + hours;
        
            minutes = minutes.toString();
        
            if (minutes.length == 1) minutes = "0" + minutes;
        
         
        
            return hours + "h:" + minutes + "m";
        
        }

        function handleTrip(t) {
            var times = getTimeString(t.TripMinutes)
            var html = [];
            html.push("<h2>Trip Summary</h2>");
            html.push("<b>" + t.OriginLabel + "</b> to <b>" + t.DestinationLabel + "</b><br/>");
            html.push("<b>Trip Miles:</b> " + t.TripDistance + "<br/>");
            // html.push(times)
            // html.push("<b>Trip Hours:</b> " + (t.TripMinutes / 60).toFixed(2) + "<br/>");
            html.push("<b>Trip Time:</b> " + times + "<br/>");
            html.push("<b>Average Retail:</b> " + t.AverageRetailPricePerGallon + "<br/>");
            html.push("<br/><br/>");
            
            //TRIP SUMMARY
            // html.push("<h2>Trip Summary</h2>");
            // html.push("<table><thead><tr><th>Trip Leg</th><th>Leg Miles</th><th>Trip Time</th></tr></thead><tbody>")
            // for (var i = 1; i < t.TripSummary.length; i++) {
            //     var ts = t.TripSummary[i-1];
            //     // html.push("<tr><td>" + ts.LegLabel + "</td><td>" + ts.LegMiles + "</td><td>" + (ts.LegMinutes/60).toFixed(2) + "</td></tr>");
            //     html.push("<tr><td>" + ts.LegLabel + "</td><td>" + ts.LegMiles + "</td><td>" + times + "</td></tr>");
            //}
            html.push("</tbody></table>");

            
            
            //JURISDICTION MILES
            // html.push("<br/><br/><h2>Jurisdiction Mileage</h2>");
            // html.push("<table><thead><tr><th>State</th><th>Toll Miles</th><th>Non-Toll Miles</th><th>Total Miles</th></tr></thead><tbody>")
            // for (var i = 0; i < t.JurisdictionMileage.length; i++) {
                //     var jm = t.JurisdictionMileage[i];
    //     html.push("<tr><td>" + jm.State + "</td><td>" + jm.TollMiles + "</td><td>" + jm.NonTollMiles + "</td><td>" + jm.TotalMiles + "</td></tr>");
    // }
    // html.push("</tbody></table>");


    //DRIVING DIRECTIONS
    html.push("<br/><br/><h2>Driving Directions</h2>");
    html.push("<table><thead><tr><th>State</th><th>Maneuver</th><th>Leg Miles</th><th>Total Miles</th></tr></thead><tbody>")
    for (var i = 0; i < t.DrivingDirections.length; i++) {
        var dd = t.DrivingDirections[i];
        html.push("<tr><td>" + dd.State + "</td><td>" + dd.Maneuver + "</td><td>" + dd.LegMiles + "</td><td>" + dd.DistanceAtStart + "</td></tr>");
    }
    html.push("</tbody></table>");

    //TRUCK STOPS
    // html.push("<br/><br/><h2>Truck Stops</h2>");
    // html.push("<table><thead><tr><th>Name</th><th>Location</th><th>City</th><th>State</th><th>Zip</th><th>Retail</th><th>Dist from Org</th><th>Dist OOR</th></tr></thead><tbody>")
    // for (var i = 0; i < t.TruckStopsOnRoute.length; i++) {
    //     var ts = t.TruckStopsOnRoute[i];
    //     html.push("<tr><td>" + ts.Name + "</td><td>" + ts.Location + "</td><td>" + ts.City + "</td><td>" + ts.State + "</td><td>" + ts.Zip + "</td><td>" + ts.RetailPrice + "</td><td>" + ts.DistanceFromOrigin + "</td><td>" + ts.DistanceOOR + "</td></tr>");
    // }
    // html.push("</tbody></table>");

    //FUEL OPTIMIZATION
    // html.push("<h2>Fuel Optimization</h2>");
    // html.push("<b>Tank Capacity:</b> " + t.FuelOptimization.UnitTankCapacity);
    // html.push("<br/><b>Trip Start Fuel:</b> " + t.FuelOptimization.TripStartFuel);
    // html.push("<br/><b>Unit MPG:</b> " + t.FuelOptimization.UnitMPG);
    // html.push("<br/><b>Is Optimized?:</b> " + t.FuelOptimization.IsOptimized);
    // if (t.FuelOptimization.IsOptimized) {
    //     html.push("<br/><b>Estimated Trip Savings:</b> " + t.FuelOptimization.NetworkResult.EstimatedTripSavings);
    //     html.push("<br/><b>Estimated Savings Per Gallon:</b> " + t.FuelOptimization.NetworkResult.EstimatedSavingsPerGallon);
    //     html.push("<br/><b>All Stops Retail Avg.:</b> " + t.FuelOptimization.NetworkResult.AllAverageRetail);
    //     html.push("<br/><b>All Stops ExTax Avg.:</b>" + t.FuelOptimization.NetworkResult.AllAverageExTax);
    //     html.push("<br/><b>Selected Stops Retail Avg.:</b> " + t.FuelOptimization.NetworkResult.SelectedAverageRetail);
    //     html.push("<br/><b>Selected Stops ExTax Avg.:</b>" + t.FuelOptimization.NetworkResult.SelectedAverageExTax);
    //     html.push("<table><thead><tr><th>Name</th><th>Location</th><th>City</th><th>State</th><th>Retail Price</th><th>Retail Cost</th><th>Distance</th><th>DistanceOOR</th><th>Gallons to Buy</th></tr></thead><tbody>");
    //     html.push("<br/><br/><b>Selected Stops</b>");
    //     for (var i = 0; i < t.FuelOptimization.NetworkResult.SelectedFuelStops.length; i++) {
    //         var ts = t.FuelOptimization.NetworkResult.SelectedFuelStops[i];
    //         html.push("<tr><td>" + ts.TruckStopName + "</td><td>" + ts.Location + "</td><td>" + ts.City + "</td><td>" + ts.State + "</td><td>" + ts.RetailPrice + "</td><td>" + ts.RetailCost + "</td><td>" + ts.DistanceFromOrigin + "</td><td>" + ts.DistanceOffRoute + "</td><td>" + ts.GallonsToBuy + "</td></tr>");
    //     }
    //     html.push("</tbody></table>");
    // }
    // else {
    //     html.push("<br/><b>Is Message:</b> " + t.FuelOptimization.NetworkResult.Message);
    // }



    //MAP POINTS
    // html.push("<br/><br/><h2>Map Points</h2><br/>");
    // html.push("Count: " + t.MapPoints.length);


    $('#FullTripResults').html(html.join(''));
}








