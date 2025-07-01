const Event = require("../models/event");
const User = require("../models/user");
const Category = require("../models/category");
const uploadImage = require("../utils/uploadToCloudinary");
const geocoding = require("../utils/geocode");

//create event
exports.createEvent = async (req, res) =>{
    try{
        const user_id = req.decoded.userid;

        const {name, date, venue, price, description, categoryName} = req.body;
        const thumbnail = req.files?.image;

        //validation
        if(!user_id){
            return res.status(401).json({
                success: false,
                message:"No Organiser found in token"
            })
        }

        const user = await User.findById(user_id);

        if(!user){
            return res.status(401).json({
                success: false,
                message:"No user found"
            })         
        }

        if(user.blocked){
            return res.status(401).json({
                success: false,
                message:"Organiser is banned from creating new events"
            })
        }

        
        if(!name || !date || !venue || !price || !categoryName ||!thumbnail){
            return res.status(401).json({
                success: false,
                message:"Enter all the details"
            })
        }

        //convert ippercase first letter 
        const formattedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();


        //check if valid category is selected
        let category = await Category.findOne({category:formattedCategoryName});
        if(!category){
            category = await Category.create({
            category: formattedCategoryName,
            events: []
        });
        }


        //upload the thumbail and get secure url
        const imageUploaded = await uploadImage(thumbnail, "EventBookingWeb");

        //get longitude and latitude
        const data = await geocoding(venue);

        if(data.results.length === 0){
            return res.status(401).json({
                success: false,
                message:"ZIP code couldn't be converted to Coordinates"
            })
        }

        const {lat, lng} = data.results[0].geometry;

        //creating event
        const response = await Event.create({
            name: name,
            date: date,
            venue: venue,
            price: price,
            organiser:user_id,
            description: description,
            category: category._id,
            image: imageUploaded.secure_url,

            location:{
                type:'Point',
                coordinates: [lat, lng]
            }
        })

        await category.updateOne({$push :{events: response._id}});

        res.status(200).json({
            success: true,
            message:"Event created Successfully",
            response
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Some Internal error occured while creating event " + err
        })
    }
}


//get all events
exports.allEvents = async (req, res) =>{
    try{
        const response = await Event.find();

        res.status(200).json({
            success: true,
            message:"All events fetched ",
            response
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"There was some problem in fetching events"
        })
    }
}


//get nearby events
exports.nearbyEvents = async (req, res) => {
  try {
    const { userLat, userLng } = req.body;
    console.log(userLat,userLng)

    if (!userLat || !userLng) {
      return res.status(400).json({
        success: false,
        message: "User's coordinates not found",
      });
    }

    const events = await Event.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [userLng, userLat],
          },
          $maxDistance: 500 * 1000, // 100 km
        },
      },
    }).populate("category");
    console.log(events)

    if (!events.length) {
      return res.status(404).json({
        success: false,
        message: "No events nearby",
      });
    }

    res.status(200).json({
      success: true,
      message: "Events found",
      events,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal error occurred while finding nearby events",
    });
  }
};



// get events by category
exports.categoryEvents = async (req, res) =>{
    try{
        const {category} =req.body;
        console.log(category)

        if(!category){
            return res.status(401).json({
                success: false,
                message:"Choose a category"
            })
        }

        const category_id = await Category.findOne({category:category});
        const id = category_id._id;
        console.log(id)

        const response = await Event.find({category: id});
        console.log(response)
        res.status(200).json({
            success: true,
            message:"Events filtered by category",
            response
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error occured while filtering by category"
        })
    }
}


// top selling
exports.topSellingEvents = async (req, res) =>{
    try{
        const response = await Event.find().sort({attendeesCount:-1}).limit(5);

        res.status(200).json({
            success: true,
            message:"Top 5 selling events fetched",
            response
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error in fetching top selling events"
        })
    }
}


// upcoming events
async function upcomingEvents() {
    return await Event.find({date :{$gte: new Date()}}).sort({date:1});
}

exports.allUpcomingEvents = async (req, res) =>{
    try{
        const response = await upcomingEvents();

        res.status(200).json({
            success: true,
            message:"All upcoming events",
            response
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error occured while fetching upcoming events"
        })
    }
}


// Organiser's myevent dashboard
exports.organiserEventsDashboard = async (req, res) =>{
    try{
        const user_id = req.decoded.userid;

        if(!user_id){
            return res.status(401).json({
                success: false,
                message:"No userId found in the token"
            })
        }

        console.log("hi")
        const response = await Event.find({organiser: user_id}).sort({date:1}).populate('category');
        console.log("hi",response)
        res.status(200).json({
            success: true,
            message:"All Organiser's events",
            response
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error occured while fetching upcoming events"
        })
    }
}


// User's myevent dashboard
exports.userEventsDashboard = async (req, res) =>{
    try{
        const user_id = req.decoded.userid;

        if(!user_id){
            return res.status(401).json({
                success: false,
                message:"No userId found in the token"
            })
        }

        const user = await User.findById(user_id).populate("eventsEnrolled");

        if(!user){
            return res.status(401).json({
                success: false,
                message:"No user found"
            })
        }

        const response = user.eventsEnrolled;

        res.status(200).json({
            success: true,
            message:"All User's events",
            response
        })
    } catch(err){
        res.status(500).json({
            succeSS: false,
            message:"Internal error occured while fetching upcoming events"
        })
    }
}


exports.getEventById = async (req, res) =>{
    try{
        const {eventid} = req.body;

        if(!eventid){
            return res.status(401).json({
                success: false,
                message:"No evend id found in body"
            })
        }

        const response = await Event.findById(eventid).populate('category');

        if(!response){
            return res.status(401).json({
                success: false,
                message:"No event found with such id"
            })
        }

        res.status(200).json({
            success: true,
            message:"Event fetched",
            response
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Internal error in fetching event by id"
        })
    }
}