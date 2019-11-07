const mongo = require('./utils/mongo')
const constants = require('./constants')

const addLocation = async (query) => {
    const response = {
        status: true
    }

    const type = String(query.type);
    const coord = {
        type: 'Point',
        coordinates: [parseFloat(query.lat), parseFloat(query.lon)]
    }

    try {

        // validation

        const createdAt = new Date();
        const dbObj = { type, coord, createdAt };
        const result = await mongo.db().collection(constants.MONGO_COLLECTION.LOCATION).insertOne(dbObj);
        response.status = true;
        response.message = 'Added location successfully';
        return response;
    } catch (error) {
        response.status = false
        response.message = error.toString()
        return response
    }
}

const fetchLocations = async (query) => {
    const response = {}
    try {

        const searchQuery = {}
        const { type, createdAt, page = 1 } = query

        if (type) {
            searchQuery.type = type;
        }

        if (createdAt) {
            searchQuery.createdAt = new Date(createdAt);
        }

        const pageSize = 2;
        let offset;
        offset = (page - 1) * pageSize

        const mongoQuery = mongo.db().collection(constants.MONGO_COLLECTION.LOCATION)
            .find(searchQuery)

        const locations = await mongoQuery
            .limit(pageSize)
            .skip(offset)
            .toArray()

        const count = await mongoQuery
            .count()

        response.status = true;
        response.data = locations;
        response.meta = { count }
        return response;
    } catch (error) {
        response.status = false;
        response.message = error.toString();
        return response;
    }
}

const fetchGeoLocations = async (query) => {
    const response = {};
    try {
        const coord = [parseFloat(query.lat), parseFloat(query.lon)]
        let range = parseFloat(query.range);
        const type = query.type;

        if (!range) {
            range = 10;
        }

        const geoQuery = {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: coord,
                },
                distanceField: 'distance',
                maxDistance: range * 1000,
            }
        }

        if (type) {
            geoQuery.$geoNear.query = {
                type: type
            }
        }

        const aggregateQuery = [
            geoQuery
        ];
        const locations = await mongo.db().collection(constants.MONGO_COLLECTION.LOCATION)
            .aggregate(aggregateQuery)
            .toArray();
        response.status = true;
        response.data = locations;
    } catch (error) {
        response.status = false;
        response.message = error.toString()
    }
    return response;
}


module.exports = {
    addLocation,
    fetchLocations,
    fetchGeoLocations
}