const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bedsSchema = Schema({
    // Evitar que en el insert te cree un id para esta estructura de datos (pq por defecto en un array de objetos te crea un _id)
    _id: false,
    type: String,
    num: Number
})

const photoSchema = Schema({
    _id: false,
    titlePhoto: String,
    url: String,
    mainPhoto: Boolean
})

const locationSchema = Schema({
    province: String,
    city: String,
    gps: [String]
})

const bookingsSchema = Schema({
    _id: false,
    startDate: String,
    endDate: String
})

const apartmentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    terms: {
        type: String,
        required: false
    },
    beds: {
        type: [bedsSchema],
        required: true
    },
    additionalBeds: {
        type: Number,
        required: false
    },
    bathrooms: {
        type: Number,
        required: true
    },
    photos: {
        type: [photoSchema],    // Array de objetos
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    occupation: {
        type: Number,
        required: true
    },
    squareMeters: {
        type: Number,
        required: true
    },
    services: {
        type: [String],     // Forma de declarar un Array con Strings dentro
        required: true
    },
    location: {
        type: {locationSchema}, // Tipo Objeto
        required: true
    },
    bookings: {
        type: [bookingsSchema],
        required: true
    }
})

module.exports = mongoose.model('Apartment', apartmentSchema);
