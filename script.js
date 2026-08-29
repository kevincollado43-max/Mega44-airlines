// Sample flight data
const flights = [
    {
        id: 1,
        from: "NYC",
        to: "LAX",
        departure: "08:00",
        arrival: "11:30",
        duration: "5h 30m",
        price: 299,
        airline: "Mega44 Airlines",
        stops: "Non-stop"
    },
    {
        id: 2,
        from: "NYC",
        to: "LAX",
        departure: "14:00",
        arrival: "17:45",
        duration: "5h 45m",
        price: 249,
        airline: "Mega44 Airlines",
        stops: "Non-stop"
    },
    {
        id: 3,
        from: "NYC",
        to: "LAX",
        departure: "20:30",
        arrival: "23:50",
        duration: "5h 20m",
        price: 199,
        airline: "Mega44 Airlines",
        stops: "Non-stop"
    },
    {
        id: 4,
        from: "LAX",
        to: "NYC",
        departure: "09:00",
        arrival: "17:30",
        duration: "5h 30m",
        price: 289,
        airline: "Mega44 Airlines",
        stops: "Non-stop"
    },
    {
        id: 5,
        from: "ORD",
        to: "MIA",
        departure: "10:00",
        arrival: "12:45",
        duration: "2h 45m",
        price: 149,
        airline: "Mega44 Airlines",
        stops: "Non-stop"
    },
    {
        id: 6,
        from: "DFW",
        to: "NYC",
        departure: "06:00",
        arrival: "13:00",
        duration: "3h 00m",
        price: 179,
        airline: "Mega44 Airlines",
        stops: "Non-stop"
    }
];

// Set today's date as minimum for date inputs
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departDate').setAttribute('min', today);
    document.getElementById('returnDate').setAttribute('min', today);

    // Handle booking form submission
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        searchFlights();
    });

    // Handle contact form submission
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitContactForm();
    });

    // Display sample flights on page load
    displayFlights(flights);
});

function searchFlights() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const departDate = document.getElementById('departDate').value;
    const passengers = document.getElementById('passengers').value;

    if (!from || !to || !departDate) {
        alert('Please fill in all required fields');
        return;
    }

    if (from === to) {
        alert('Departure and destination cities must be different');
        return;
    }

    // Filter flights based on search criteria
    const filtered = flights.filter(flight => 
        flight.from === from && flight.to === to
    );

    if (filtered.length === 0) {
        alert('No flights found for the selected route. Try another destination!');
        displayFlights(flights); // Show all flights
    } else {
        displayFlights(filtered, passengers);
    }

    // Scroll to results
    document.getElementById('flights').scrollIntoView({ behavior: 'smooth' });
}

function displayFlights(flightList, passengers = 1) {
    const resultsContainer = document.getElementById('flightResults');
    resultsContainer.innerHTML = '';

    if (flightList.length === 0) {
        resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No flights found</p>';
        return;
    }

    flightList.forEach(flight => {
        const flightCard = document.createElement('div');
        flightCard.className = 'flight-card';
        flightCard.innerHTML = `
            <div class="flight-info">
                <div>
                    <div class="flight-times">${flight.from} → ${flight.to}</div>
                    <div style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
                        ${flight.departure} - ${flight.arrival}
                    </div>
                </div>
            </div>
            <div class="flight-duration">Duration: ${flight.duration}</div>
            <div style="color: #666; font-size: 0.9rem; margin: 0.5rem 0;">
                ${flight.stops}
            </div>
            <div class="flight-price">$${flight.price}</div>
            <div style="font-size: 0.85rem; color: #999; margin-bottom: 1rem;">
                per person × ${passengers} passenger${passengers > 1 ? 's' : ''}
            </div>
            <button class="book-btn" onclick="bookFlight(${flight.id}, ${passengers}, ${flight.price})">
                Book Now - $${flight.price * passengers}
            </button>
        `;
        resultsContainer.appendChild(flightCard);
    });
}

function bookFlight(flightId, passengers, pricePerPerson) {
    const flight = flights.find(f => f.id === flightId);
    const totalPrice = pricePerPerson * passengers;
    
    alert(`
Booking Confirmation
━━━━━━━━━━━━━━━━━━━━━━
Route: ${flight.from} → ${flight.to}
Departure: ${flight.departure}
Arrival: ${flight.arrival}
Passengers: ${passengers}
Price per person: $${pricePerPerson}
Total Price: $${totalPrice}
━━━━━━━━━━━━━━━━━━━━━━

Thank you for choosing Mega44 Airlines!
Your booking confirmation will be sent to your email.
    `);
}

function scrollToBooking() {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

function submitContactForm() {
    const form = document.getElementById('contactForm');
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;

    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }

    // Simulate form submission
    alert(`Thank you, ${name}! \n\nYour message has been sent successfully.\nWe'll get back to you at ${email} shortly.`);
    
    // Reset form
    form.reset();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});