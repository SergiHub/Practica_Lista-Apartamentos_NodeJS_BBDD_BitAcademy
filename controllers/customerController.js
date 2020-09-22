
const Apartment = require('../models/apartments');

exports.getAllApartments = async (req, res) => {
    
    // Filtrar por Ocupación + Provincia + Ciudad
    const minOccupation = req.query.minOccupation;
    const searchProvince = req.query.searchProvince;
    const searchCity = req.query.searchCity;
    let searchCriteria;

    if (minOccupation) {
        if (searchProvince) {
            if (searchCity) {
                searchCriteria = {$and: [ {occupation: {$gte: minOccupation}}, {"location.province": searchProvince}, {"location.city": searchCity} ]};
            }
            else {
                searchCriteria = {$and: [ {occupation: {$gte: minOccupation}}, {"location.province": searchProvince} ]};
            }
        }
        else {
            searchCriteria = {occupation: {$gte: minOccupation}};
        }
    }

    if (searchProvince) {
        if (searchCity) {
            searchCriteria = {$and: [ {"location.province": searchProvince}, {"location.city": searchCity} ]};
        }
        else {
            searchCriteria = {$and: [ {"location.province": searchProvince} ]};
        }
    }

    if (searchCity) {
        if (minOccupation) {
            searchCriteria = {$and: [ {occupation: {$gte: minOccupation}}, {"location.city": searchCity} ]};
        }
        else {
            searchCriteria = {$and: [ {"location.city": searchCity} ]};
        }
    }
    var apartments = await Apartment.find(searchCriteria)

    // Filtro por fechas
    let arrayId = [];
    if (req.query.CheckIn) {
        var checkIn = Date.parse(req.query.CheckIn);
        var checkOut = Date.parse(req.query.CheckOut);
        if (apartments[0]) {
            for (var x = 0; x < apartments.length; x++) {
                var hayFecha = true;
                for (var i = 0; i < apartments[x].bookings.length; i++) {  // some!!!!!
                    var startDateParse = Date.parse(apartments[x].bookings[i].startDate);
                    var endDateParse = Date.parse(apartments[x].bookings[i].endDate);
                    if ((checkIn >= startDateParse && checkIn <= endDateParse) ||
                        (checkOut >= startDateParse && checkOut <= endDateParse)) {
                        hayFecha = false;
                    }
                }
                if (hayFecha) {
                    var keepApartment = await Apartment.findOne({_id: apartments[x]._id})
                    arrayId.push(keepApartment)
                }
            }
        }
        apartments = arrayId;
    }

    //console.log("Apartamentos recuperados:" , apartments);
    res.render('index', {
        apartments: apartments,
        isAdmin: false // Indicamos que no es el Administrador

    });
}

exports.getDetailedApartment = async (req, res) => {
    const idApartment = req.params.idApartment;
    let message;

    if (req.query.CheckIn) {
        var checkIn = Date.parse(req.query.CheckIn);
        var checkOut = Date.parse(req.query.CheckOut);
        var arrayDates = await Apartment.findOne({_id:idApartment},{bookings:1});
        console.log("BOOKINGS-FECHAS_dentro", arrayDates);
        if (arrayDates.bookings[0]) {
            var noHayFecha = false;
            for (var i = 0; i < arrayDates.bookings.length; i++) {
                var startDateParse = Date.parse(arrayDates.bookings[i].startDate);
                var endDateParse = Date.parse(arrayDates.bookings[i].endDate);
                if ((checkIn >= startDateParse && checkIn <= endDateParse) ||
                    (checkOut >= startDateParse && checkOut <= endDateParse)) {
                    noHayFecha = true;
                }
            }
            if (noHayFecha) {
                message = "Sorry the apartment is not available";
            }
            else {
                message = "The apartment is available";
                var x = await Apartment.updateOne({_id: idApartment}, {$push: {bookings: {startDate: req.query.CheckIn, endDate: req.query.CheckOut}}} )
                .catch(err => console.log("Ha habido un error", err));
                console.log("X", x);
            }
        }
    }
    
    //console.log("Identificador del apartamento: ", idApartment);
    const apartment = await Apartment.findById(idApartment);
    //console.log("Dealles del apartamento:", apartment);
    res.render('details', {
        apartment: apartment,
        isAdmin: false,
        message: message
    });
}