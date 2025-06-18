const openCage= require("opencage-api-client");

require("dotenv").config();

async function geocoding(zipcode){
    try{
        const response = await openCage.geocode({q: zipcode});

        return response;
        
    } catch(err){
        if(err.status.code === 402){
            console.log("Free Trial limit reached");
        }

        else{
            console.log("Error in converting to coordinates "+err);
        }
    }
}

module.exports = geocoding;