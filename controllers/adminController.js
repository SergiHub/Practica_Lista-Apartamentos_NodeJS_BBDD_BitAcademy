const Apartment = require('../models/apartments');
const mongoose = require('mongoose');

exports.getNewApartment  =  (req, res) => {
    res.render('add-new', {
        editMode: false
    });
}

exports.postNewApartment  =  (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const terms = req.body.terms;
    const typeBed = req.body.typeBed;
    const numberBeds = req.body.numberBeds;
    const additionalBeds = req.body.additionalBeds;
    const bathrooms = req.body.bathrooms;
    const mainPhoto = req.body.mainPhoto;
    const titleMainPhoto = req.body.titleMainPhoto;
    const photos = req.body.photos;
    const titlePhotos = req.body.titlePhotos;
    const price = req.body.price;
    const occupation = req.body.occupation;
    const squareMeters = req.body.squareMeters;
    const services = req.body.services;
    const allLocation = {
        province: req.body.province,
        city: req.body.city,
        gps: [req.body.gpsLat, req.body.gpsLong]
    }

    // Montar el array de objetos para guardar la información de las camas
    const arrayBeds = [];
    for (let i = 0; i < typeBed.length; i++) { 
        arrayBeds.push({
            type: typeBed[i], 
            num: numberBeds[i]
        });
    }

    // Montar el array de objetos para guardar la información de las fotos
    const arrayPhotos = [];
    if (mainPhoto != ''){
        arrayPhotos.push({
            titlePhoto: titleMainPhoto, 
            url: mainPhoto,
            mainPhoto: true
        });
    }

    for (let i = 0; i < photos.length; i++) { 
        arrayPhotos.push({
            titlePhoto: titlePhotos[i], 
            url: photos[i],
            mainPhoto: false
        });
    }

    const newApartment = new Apartment({
        title: title,
        description: description,
        terms: terms,
        beds: arrayBeds,
        additionalBeds: additionalBeds,
        bathrooms: bathrooms,
        photos: arrayPhotos,
        price: price,
        occupation: occupation,
        squareMeters: squareMeters,
        services: services,
        location: allLocation
    })
    
    // error = newApartment.validateSync(); // ...???  // Te comprueba si todo ha ido bien

    newApartment.save()
    .then( result => {
        res.send("Apartamento insertado con éxito!");
        console.log("Apartamento insertado:", result);
    })
    .catch ( err => {
        console.log("Error!!", err); 
        res.send("Ha ocurrido un error!!");     
    })
}

exports.postEditApartment  =  (req, res) => {
    const idEdit = req.body._id;
    const title = req.body.title;
    const description = req.body.description;
    const terms = req.body.terms;
    const typeBed = req.body.typeBed;
    const numberBeds = req.body.numberBeds;
    const additionalBeds = req.body.additionalBeds;
    const bathrooms = req.body.bathrooms;
    const mainPhoto = req.body.mainPhoto;
    const titleMainPhoto = req.body.titleMainPhoto;
    const photos = req.body.photos;
    const titlePhotos = req.body.titlePhotos;
    const price = req.body.price;
    const occupation = req.body.occupation;
    const squareMeters = req.body.squareMeters;
    const services = req.body.services;
    const allLocation = {
        province: req.body.province,
        city: req.body.city,
        gps: [req.body.gpsLat, req.body.gpsLong]
    }

    // Montar el array de objetos para guardar la información de las camas
    const arrayBeds = [];
    for (let i = 0; i < typeBed.length; i++) { 
        arrayBeds.push({
            type: typeBed[i], 
            num: numberBeds[i]
        });
    }

    // Montar el array de objetos para guardar la información de las fotos
    const arrayPhotos = [];
    if (mainPhoto != ''){
        arrayPhotos.push({
            titlePhoto: titleMainPhoto, 
            url: mainPhoto,
            mainPhoto: true
        });
    }

    for (let i = 0; i < photos.length; i++) { 
        arrayPhotos.push({
            titlePhoto: titlePhotos[i], 
            url: photos[i],
            mainPhoto: false
        });
    }

    Apartment.findById(idEdit)
    .then(apartment => {
        apartment.title = title;
        apartment.description = description;
        apartment.terms = terms;
        apartment.beds = arrayBeds;
        apartment.additionalBeds = additionalBeds;
        apartment.bathrooms = bathrooms;
        apartment.photos = arrayPhotos;
        apartment.price = price;
        apartment.occupation = occupation;
        apartment.squareMeters = squareMeters;
        apartment.services = services;
        apartment.location = allLocation;
        return apartment.save();
    })
    .then(result => {
        console.log("Apartamento Actualizado", result);
        res.redirect(`/admin/apartment/${idEdit}`);
    })
    .catch(err => console.log("Ha habido un error", err));
}


exports.getAllApartments = async (req, res) => {
    const apartments = await Apartment.find();
    //console.log("Apartamentos recuperados:" , apartments);
    res.render('index', {
        apartments : apartments,
        isAdmin: true // Se trata del administrador
    });
}

exports.getDetailedApartment = async (req, res) => {
    const idApartment = req.params.idApartment;
    //console.log("Identificador del apartamento: ", idApartment);
    const apartment = await Apartment.findById(idApartment);
    //console.log("Detalles del apartamento: ", apartment);
    res.render('details', {
        apartment: apartment,
        isAdmin: true
    });
}

exports.getEditApartment = async (req, res) => {
    // Recuperar el apartamento identificado en idApartment
    const idApartment = req.params.idApartment;
    // Renderizar el formulario pasandole los datos del apartamento
    const apartment = await Apartment.findById(idApartment);
    res.render('add-new', {
        apartment: apartment,
        editMode: true
    });
}

exports.getDeleteApartment = (req, res) => {
    // Borrar el apartamento con el idApartment
    // o bien
    // Establecer un nuevo campo en "Apartment", fecha baja, q indica que el apartamento ya no está disponible
            //OJO!! Tendréis q modificar todas las consultas en vuestros controladores
                //con un find de ese campo (en getAllApartments y en getDetailApartments)
}