const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// TEMP DATABASE (replace with MongoDB later)
let bookings = [];

// CREATE BOOKING API
app.post("/book", (req, res) => {
const data = req.body;

// basic validation
if(!data.from || !data.to || !data.date){
return res.status(400).json({error:"Missing required fields"});
}

// store booking
bookings.push({
id: Date.now(),
...data
});

// BUILD WHATSAPP MESSAGE (IMPORTANT PART)
let msg = `✈️ New Flight Booking Request\n`;
msg += `Trip Type: ${data.tripType}\n`;
msg += `From: ${data.from}\n`;
msg += `To: ${data.to}\n`;
msg += `Departure: ${data.date}\n`;

if(data.returnDate){
msg += `Return: ${data.returnDate}\n`;
}

if(data.multi){
msg += `Multi Route: ${data.multi.from2} → ${data.multi.to2}\n`;
msg += `Multi Date: ${data.multi.date2}\n`;
}

msg += `Passengers: ${data.passengers}\n`;
msg += `Class: ${data.classType}\n`;

// WhatsApp link (your number)
let waLink = "https://wa.me/9762219660?text=" + encodeURIComponent(msg);

// return response
res.json({
success:true,
whatsapp: waLink,
bookingId: bookings.length
});

});

// GET ALL BOOKINGS (ADMIN USE)
app.get("/bookings", (req,res)=>{
res.json(bookings);
});

// START SERVER
app.listen(3000, () => {
console.log("Server running on http://localhost:3000");
});