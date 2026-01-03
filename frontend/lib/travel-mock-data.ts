/**
 * Mock data for Travel Planner Agent
 * Provides realistic flight, hotel, and activity information for demonstrations
 */

export interface Flight {
  flightNumber: string
  airline: string
  from: string
  to: string
  departure: string
  arrival: string
  duration: string
  price: number
  currency: string
  type: 'direct' | 'connecting'
  stopover?: string
  class: 'economy' | 'business' | 'first'
  availableSeats: number
}

export interface Hotel {
  name: string
  location: string
  rating: number
  pricePerNight: number
  currency: string
  amenities: string[]
  availableRooms: number
  images?: string[]
}

export interface Activity {
  name: string
  location: string
  duration: string
  price: number
  currency: string
  description: string
  rating: number
  category: string
}

export interface Destination {
  city: string
  country: string
  description: string
  bestTime: string
  popularAttractions: string[]
}

// Flight Database
export const FLIGHTS: Record<string, Flight[]> = {
  "chennai-dubai": [
    {
      flightNumber: "EK-544",
      airline: "Emirates",
      from: "Chennai (MAA)",
      to: "Dubai (DXB)",
      departure: "03:15 AM",
      arrival: "05:45 AM",
      duration: "4h 30m",
      price: 18500,
      currency: "INR",
      type: "direct",
      class: "economy",
      availableSeats: 45
    },
    {
      flightNumber: "AI-973",
      airline: "Air India Express",
      from: "Chennai (MAA)",
      to: "Dubai (DXB)",
      departure: "08:30 AM",
      arrival: "11:00 AM",
      duration: "4h 30m",
      price: 15200,
      currency: "INR",
      type: "direct",
      class: "economy",
      availableSeats: 28
    },
    {
      flightNumber: "6E-1406",
      airline: "IndiGo",
      from: "Chennai (MAA)",
      to: "Dubai (DXB)",
      departure: "02:50 PM",
      arrival: "05:20 PM",
      duration: "4h 30m",
      price: 14800,
      currency: "INR",
      type: "direct",
      class: "economy",
      availableSeats: 62
    },
    {
      flightNumber: "G8-351",
      airline: "Go First",
      from: "Chennai (MAA)",
      to: "Dubai (DXB)",
      departure: "11:45 PM",
      arrival: "02:15 AM+1",
      duration: "4h 30m",
      price: 13900,
      currency: "INR",
      type: "direct",
      class: "economy",
      availableSeats: 38
    },
    {
      flightNumber: "QR-528 + QR-1012",
      airline: "Qatar Airways",
      from: "Chennai (MAA)",
      to: "Dubai (DXB)",
      departure: "09:15 AM",
      arrival: "05:30 PM",
      duration: "8h 15m",
      price: 16500,
      currency: "INR",
      type: "connecting",
      stopover: "Doha (DOH)",
      class: "economy",
      availableSeats: 24
    },
    {
      flightNumber: "EY-217 + EY-392",
      airline: "Etihad Airways",
      from: "Chennai (MAA)",
      to: "Dubai (DXB)",
      departure: "01:00 PM",
      arrival: "09:45 PM",
      duration: "8h 45m",
      price: 17200,
      currency: "INR",
      type: "connecting",
      stopover: "Abu Dhabi (AUH)",
      class: "economy",
      availableSeats: 18
    },
    {
      flightNumber: "EK-544",
      airline: "Emirates",
      from: "Chennai (MAA)",
      to: "Dubai (DXB)",
      departure: "03:15 AM",
      arrival: "05:45 AM",
      duration: "4h 30m",
      price: 52000,
      currency: "INR",
      type: "direct",
      class: "business",
      availableSeats: 12
    }
  ],
  "mumbai-dubai": [
    {
      flightNumber: "EK-500",
      airline: "Emirates",
      from: "Mumbai (BOM)",
      to: "Dubai (DXB)",
      departure: "04:30 AM",
      arrival: "06:15 AM",
      duration: "3h 45m",
      price: 16800,
      currency: "INR",
      type: "direct",
      class: "economy",
      availableSeats: 52
    },
    {
      flightNumber: "6E-1302",
      airline: "IndiGo",
      from: "Mumbai (BOM)",
      to: "Dubai (DXB)",
      departure: "10:00 AM",
      arrival: "11:45 AM",
      duration: "3h 45m",
      price: 14200,
      currency: "INR",
      type: "direct",
      class: "economy",
      availableSeats: 48
    }
  ],
  "delhi-dubai": [
    {
      flightNumber: "EK-512",
      airline: "Emirates",
      from: "Delhi (DEL)",
      to: "Dubai (DXB)",
      departure: "02:50 AM",
      arrival: "05:10 AM",
      duration: "3h 50m",
      price: 17500,
      currency: "INR",
      type: "direct",
      class: "economy",
      availableSeats: 38
    },
    {
      flightNumber: "AI-915",
      airline: "Air India",
      from: "Delhi (DEL)",
      to: "Dubai (DXB)",
      departure: "08:15 AM",
      arrival: "10:35 AM",
      duration: "3h 50m",
      price: 15800,
      currency: "INR",
      type: "direct",
      class: "economy",
      availableSeats: 42
    }
  ]
}

// Hotels Database
export const HOTELS: Record<string, Hotel[]> = {
  "dubai": [
    {
      name: "Burj Al Arab Jumeirah",
      location: "Jumeirah Beach, Dubai",
      rating: 5,
      pricePerNight: 95000,
      currency: "INR",
      amenities: ["Private Beach", "Spa", "Fine Dining", "Butler Service", "Infinity Pool"],
      availableRooms: 3
    },
    {
      name: "Atlantis The Palm",
      location: "The Palm Jumeirah, Dubai",
      rating: 5,
      pricePerNight: 48000,
      currency: "INR",
      amenities: ["Aquaventure Waterpark", "Lost Chambers Aquarium", "Private Beach", "Multiple Restaurants"],
      availableRooms: 12
    },
    {
      name: "Jumeirah Emirates Towers",
      location: "Sheikh Zayed Road, Dubai",
      rating: 5,
      pricePerNight: 32000,
      currency: "INR",
      amenities: ["Business Center", "Rooftop Pool", "Gym", "Spa", "City Views"],
      availableRooms: 8
    },
    {
      name: "Rove Downtown Dubai",
      location: "Downtown Dubai",
      rating: 3.5,
      pricePerNight: 8500,
      currency: "INR",
      amenities: ["Rooftop Pool", "Gym", "Free WiFi", "Restaurant"],
      availableRooms: 25
    },
    {
      name: "ibis Dubai Mall of Emirates",
      location: "Al Barsha, Dubai",
      rating: 3,
      pricePerNight: 6200,
      currency: "INR",
      amenities: ["Free WiFi", "Restaurant", "24/7 Front Desk", "Near Metro"],
      availableRooms: 18
    }
  ]
}

// Activities Database
export const ACTIVITIES: Record<string, Activity[]> = {
  "dubai": [
    {
      name: "Burj Khalifa Observation Deck",
      location: "Downtown Dubai",
      duration: "2-3 hours",
      price: 3500,
      currency: "INR",
      description: "Visit the world's tallest building and enjoy breathtaking 360° views from Level 124 & 125",
      rating: 4.8,
      category: "Attractions"
    },
    {
      name: "Desert Safari with BBQ Dinner",
      location: "Dubai Desert",
      duration: "6 hours",
      price: 4200,
      currency: "INR",
      description: "Thrilling dune bashing, camel riding, sandboarding, and traditional BBQ dinner under the stars",
      rating: 4.9,
      category: "Adventure"
    },
    {
      name: "Dubai Mall & Fountain Show",
      location: "Downtown Dubai",
      duration: "3-4 hours",
      price: 0,
      currency: "INR",
      description: "Shop at one of the world's largest malls and watch the mesmerizing fountain shows",
      rating: 4.7,
      category: "Shopping & Entertainment"
    },
    {
      name: "Dubai Marina Dhow Cruise",
      location: "Dubai Marina",
      duration: "2 hours",
      price: 2800,
      currency: "INR",
      description: "Romantic dinner cruise along Dubai Marina with international buffet and live entertainment",
      rating: 4.6,
      category: "Dining & Cruise"
    },
    {
      name: "Dubai Frame",
      location: "Zabeel Park",
      duration: "1-2 hours",
      price: 1500,
      currency: "INR",
      description: "Iconic frame-shaped building offering panoramic views of old and new Dubai",
      rating: 4.5,
      category: "Attractions"
    },
    {
      name: "Ski Dubai",
      location: "Mall of Emirates",
      duration: "3-4 hours",
      price: 5500,
      currency: "INR",
      description: "Indoor ski resort with real snow, ski slopes, and penguin encounters",
      rating: 4.7,
      category: "Adventure"
    }
  ]
}

// Destinations Database
export const DESTINATIONS: Destination[] = [
  {
    city: "Dubai",
    country: "United Arab Emirates",
    description: "A global city known for luxury shopping, ultramodern architecture, and vibrant nightlife",
    bestTime: "November to March (cooler weather)",
    popularAttractions: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Dubai Marina", "Gold Souk", "Desert Safari"]
  },
  {
    city: "Abu Dhabi",
    country: "United Arab Emirates",
    description: "The capital of UAE, known for Sheikh Zayed Grand Mosque and cultural experiences",
    bestTime: "November to March",
    popularAttractions: ["Sheikh Zayed Grand Mosque", "Louvre Abu Dhabi", "Emirates Palace", "Yas Island"]
  },
  {
    city: "Paris",
    country: "France",
    description: "The City of Light, famous for art, fashion, gastronomy, and culture",
    bestTime: "April to June, September to October",
    popularAttractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Champs-Élysées", "Arc de Triomphe"]
  },
  {
    city: "London",
    country: "United Kingdom",
    description: "A diverse and historic city blending royal heritage with modern culture",
    bestTime: "May to September",
    popularAttractions: ["Big Ben", "Buckingham Palace", "London Eye", "Tower Bridge", "British Museum"]
  },
  {
    city: "Singapore",
    country: "Singapore",
    description: "A modern city-state known for cleanliness, efficiency, and multicultural harmony",
    bestTime: "February to April",
    popularAttractions: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Universal Studios", "Chinatown"]
  }
]

/**
 * Search flights based on origin and destination
 */
export function searchFlights(from: string, to: string): Flight[] {
  const routeKey = `${from.toLowerCase()}-${to.toLowerCase()}`
  return FLIGHTS[routeKey] || []
}

/**
 * Get flight by flight number
 */
export function getFlightByNumber(flightNumber: string): Flight | undefined {
  for (const flights of Object.values(FLIGHTS)) {
    const flight = flights.find(f => f.flightNumber === flightNumber)
    if (flight) return flight
  }
  return undefined
}

/**
 * Search hotels in a city
 */
export function searchHotels(city: string, maxPrice?: number): Hotel[] {
  const hotels = HOTELS[city.toLowerCase()] || []
  if (maxPrice) {
    return hotels.filter(h => h.pricePerNight <= maxPrice)
  }
  return hotels
}

/**
 * Search activities in a city
 */
export function searchActivities(city: string, category?: string): Activity[] {
  const activities = ACTIVITIES[city.toLowerCase()] || []
  if (category) {
    return activities.filter(a => a.category.toLowerCase().includes(category.toLowerCase()))
  }
  return activities
}

/**
 * Get destination information
 */
export function getDestinationInfo(city: string): Destination | undefined {
  return DESTINATIONS.find(d => d.city.toLowerCase() === city.toLowerCase())
}

/**
 * Format flight information for display
 */
export function formatFlightInfo(flight: Flight): string {
  const stopover = flight.type === 'connecting' ? ` (via ${flight.stopover})` : ''
  return `
✈️ **${flight.airline}** - ${flight.flightNumber}
📍 ${flight.from} → ${flight.to}${stopover}
🕐 Departure: ${flight.departure} | Arrival: ${flight.arrival}
⏱️ Duration: ${flight.duration}
💰 Price: ${flight.currency} ${flight.price.toLocaleString()}
💺 Available Seats: ${flight.availableSeats}
🎫 Class: ${flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}
  `.trim()
}

/**
 * Format hotel information for display
 */
export function formatHotelInfo(hotel: Hotel): string {
  return `
🏨 **${hotel.name}**
📍 ${hotel.location}
⭐ Rating: ${hotel.rating}/5
💰 ₹${hotel.pricePerNight.toLocaleString()} per night
🛏️ ${hotel.availableRooms} rooms available
✨ Amenities: ${hotel.amenities.slice(0, 3).join(', ')}
  `.trim()
}

/**
 * Format activity information for display
 */
export function formatActivityInfo(activity: Activity): string {
  return `
🎯 **${activity.name}**
📍 ${activity.location}
⏱️ Duration: ${activity.duration}
💰 Price: ${activity.currency} ${activity.price.toLocaleString()}${activity.price === 0 ? ' (Free!)' : ''}
⭐ Rating: ${activity.rating}/5
📝 ${activity.description}
  `.trim()
}

/**
 * Generate conversational response based on travel query
 * Provides guided step-by-step flow
 */
export function generateTravelResponse(query: string, context?: string): string {
  const queryLower = query.toLowerCase()
  
  // Detect destination
  let destination = ''
  DESTINATIONS.forEach(dest => {
    if (queryLower.includes(dest.city.toLowerCase())) {
      destination = dest.city.toLowerCase()
    }
  })
  
  // Detect origin city
  let origin = ''
  if (queryLower.includes('chennai')) origin = 'chennai'
  if (queryLower.includes('mumbai') || queryLower.includes('bombay')) origin = 'mumbai'
  if (queryLower.includes('delhi')) origin = 'delhi'
  if (queryLower.includes('bangalore') || queryLower.includes('bengaluru')) origin = 'bangalore'
  
  // Initial greeting - ask where they want to go
  if (queryLower.includes('hi') || queryLower.includes('hello') || queryLower.includes('hey')) {
    return `👋 Hello! I'm your Travel Planner assistant.\n\n**Where would you like to travel?**\n\nI can help you plan trips to:\n1️⃣ Dubai (UAE)\n2️⃣ Abu Dhabi (UAE)\n3️⃣ Paris (France)\n4️⃣ London (UK)\n5️⃣ Singapore\n\nJust tell me your destination and I'll show you all available flights!`
  }
  
  // Check if user is asking about a specific flight
  if (queryLower.includes('detail') || queryLower.includes('about') || queryLower.includes('tell me about') || queryLower.includes('flight 1') || queryLower.includes('flight 2') || queryLower.includes('flight 3') || queryLower.includes('flight 4') || queryLower.includes('flight 5')) {
    // Extract flight number or number
    let flightNumber = ''
    
    // Check for flight number patterns like "EK-544", "AI-973"
    const flightNumberMatch = queryLower.match(/([a-z]{2}[\- ]?\d{3,4}|flight (\d))/)
    if (flightNumberMatch) {
      if (flightNumberMatch[2]) {
        // User said "flight 1", "flight 2", etc. - need context to know which flights were shown
        const flightIdx = parseInt(flightNumberMatch[2]) - 1
        // For now, assume they mean Chennai-Dubai flights (most common)
        const flights = searchFlights('chennai', destination || 'dubai')
        if (flights[flightIdx]) {
          const flight = flights[flightIdx]
          return `✈️ **Flight Details: ${flight.flightNumber}**\n\n**${flight.airline}**\n📍 ${flight.from} → ${flight.to}\n🕐 Departure: ${flight.departure} | Arrival: ${flight.arrival}\n⏱️ Duration: ${flight.duration}\n💰 Price: ₹${flight.price.toLocaleString()}\n💺 Available Seats: ${flight.availableSeats}\n🎫 Class: ${flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}\n✈️ Type: ${flight.type === 'direct' ? 'Direct Flight' : `Connecting via ${flight.stopover}`}\n\n---\n\n💡 **Travel Tips & Insights:**\n\n${flight.airline === 'Emirates' ? '✨ **Emirates Excellence:**\n• Award-winning in-flight entertainment with 4,000+ channels\n• Complimentary gourmet meals and premium beverages\n• Generous baggage: 30kg economy, 40kg business\n• ICE entertainment system voted best 15 years in a row\n• Spacious seats with extra legroom' : ''}\n${flight.airline === 'Air India Express' ? '✨ **Air India Express:**\n• Budget-friendly option with reliable service\n• Pre-book meals 24 hours before for best selection\n• Web check-in opens 48 hours before departure\n• Baggage: 15kg included, add more during booking\n• Good connectivity across Indian cities' : ''}\n${flight.airline === 'IndiGo' ? '✨ **IndiGo Advantages:**\n• Known for excellent on-time performance (85%+)\n• Quick boarding and efficient service\n• Add baggage during booking for 50% discount vs airport\n• 6E Prime seats offer extra legroom\n• Free web check-in 48 hours prior' : ''}\n${flight.airline === 'Go First' ? '✨ **Go First Benefits:**\n• Affordable fares with frequent sales\n• Flexible booking options\n• Add-ons available: meals, seats, baggage\n• Young fleet with modern amenities' : ''}\n${flight.type === 'direct' ? '\n⚡ **Direct Flight Benefits:**\n• Save 3-4 hours compared to connecting flights\n• No risk of missing connections\n• Less stressful travel experience\n• Arrive fresh and ready to explore\n• Perfect for business travelers' : `\n🔄 **Connecting Flight Info:**\n• Layover at ${flight.stopover}\n• Use this time to stretch and walk around\n• Most airports have lounges (day pass ~₹2,000)\n• Check if you need transit visa\n• Total journey time: ${flight.duration}`}\n\n**✅ Booking Recommendations:**\n• **Best time to book:** 2-3 months in advance for lowest fares\n• **Cheapest days:** Tuesday & Wednesday departures\n• **Best timing:** Early morning flights are more punctual\n• **Travel insurance:** Recommended (₹500-1,000)\n• **Visa:** Indian passport holders get visa on arrival\n\n**📱 After Booking:**\n• Download airline app for easy check-in\n• Join frequent flyer program for benefits\n• Set fare alerts for price drops\n• Check COVID-19 requirements before travel\n\n**What would you like to do next?**\n• Book this flight\n• Compare with other flights\n• Find hotels in Dubai\n• See activities and attractions\n• Get complete trip budget`
        }
      } else {
        flightNumber = flightNumberMatch[1].toUpperCase().replace(' ', '-')
      }
    }
    
    // Check for airline names
    if (queryLower.includes('emirates')) {
      const flights = searchFlights('chennai', 'dubai')
      const emiratesFlight = flights.find(f => f.airline === 'Emirates')
      if (emiratesFlight) flightNumber = emiratesFlight.flightNumber
    }
    if (queryLower.includes('air india')) {
      const flights = searchFlights('chennai', 'dubai')
      const airIndiaFlight = flights.find(f => f.airline.includes('Air India'))
      if (airIndiaFlight) flightNumber = airIndiaFlight.flightNumber
    }
    if (queryLower.includes('indigo')) {
      const flights = searchFlights('chennai', 'dubai')
      const indigoFlight = flights.find(f => f.airline === 'IndiGo')
      if (indigoFlight) flightNumber = indigoFlight.flightNumber
    }
    
    // Search for the flight in database
    if (flightNumber) {
      for (const flights of Object.values(FLIGHTS)) {
        const flight = flights.find(f => f.flightNumber.replace('-', '').toLowerCase() === flightNumber.replace('-', '').toLowerCase())
        if (flight) {
          return `✈️ **Flight Details: ${flight.flightNumber}**\n\n**${flight.airline}**\n📍 ${flight.from} → ${flight.to}\n🕐 Departure: ${flight.departure} | Arrival: ${flight.arrival}\n⏱️ Duration: ${flight.duration}\n💰 Price: ₹${flight.price.toLocaleString()}\n💺 Available Seats: ${flight.availableSeats}\n🎫 Class: ${flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}\n✈️ Type: ${flight.type === 'direct' ? 'Direct Flight' : `Connecting via ${flight.stopover}`}\n\n---\n\n💡 **Travel Tips & Insights:**\n\n${flight.airline === 'Emirates' ? '✨ **Emirates Excellence:**\n• Award-winning in-flight entertainment with 4,000+ channels\n• Complimentary gourmet meals and premium beverages\n• Generous baggage: 30kg economy, 40kg business\n• ICE entertainment system voted best 15 years in a row\n• Spacious seats with extra legroom' : ''}\n${flight.airline === 'Air India Express' ? '✨ **Air India Express:**\n• Budget-friendly option with reliable service\n• Pre-book meals 24 hours before for best selection\n• Web check-in opens 48 hours before departure\n• Baggage: 15kg included, add more during booking\n• Good connectivity across Indian cities' : ''}\n${flight.airline === 'IndiGo' ? '✨ **IndiGo Advantages:**\n• Known for excellent on-time performance (85%+)\n• Quick boarding and efficient service\n• Add baggage during booking for 50% discount vs airport\n• 6E Prime seats offer extra legroom\n• Free web check-in 48 hours prior' : ''}\n${flight.airline === 'Go First' ? '✨ **Go First Benefits:**\n• Affordable fares with frequent sales\n• Flexible booking options\n• Add-ons available: meals, seats, baggage\n• Young fleet with modern amenities' : ''}\n${flight.type === 'direct' ? '\n⚡ **Direct Flight Benefits:**\n• Save 3-4 hours compared to connecting flights\n• No risk of missing connections\n• Less stressful travel experience\n• Arrive fresh and ready to explore\n• Perfect for business travelers' : `\n🔄 **Connecting Flight Info:**\n• Layover at ${flight.stopover}\n• Use this time to stretch and walk around\n• Most airports have lounges (day pass ~₹2,000)\n• Check if you need transit visa\n• Total journey time: ${flight.duration}`}\n\n**✅ Booking Recommendations:**\n• **Best time to book:** 2-3 months in advance for lowest fares\n• **Cheapest days:** Tuesday & Wednesday departures\n• **Best timing:** Early morning flights are more punctual\n• **Travel insurance:** Recommended (₹500-1,000)\n• **Visa:** Indian passport holders get visa on arrival\n\n**📱 After Booking:**\n• Download airline app for easy check-in\n• Join frequent flyer program for benefits\n• Set fare alerts for price drops\n• Check COVID-19 requirements before travel\n\n**What would you like to do next?**\n• Book this flight\n• Compare with other flights\n• Find hotels in Dubai\n• See activities and attractions\n• Get complete trip budget`
        }
      }
    }
  }
  
  // User mentions destination - show ALL available flights immediately
  if (destination && !queryLower.includes('hotel') && !queryLower.includes('activity') && !queryLower.includes('budget') && !queryLower.includes('itinerary')) {
    const destInfo = getDestinationInfo(destination)
    if (destInfo) {
      // Gather all flights to this destination from different cities
      const allFlights: {origin: string, flights: Flight[]}[] = []
      
      const chennaiFlights = searchFlights('chennai', destination)
      if (chennaiFlights.length > 0) allFlights.push({origin: 'Chennai', flights: chennaiFlights})
      
      const mumbaiFlights = searchFlights('mumbai', destination)
      if (mumbaiFlights.length > 0) allFlights.push({origin: 'Mumbai', flights: mumbaiFlights})
      
      const delhiFlights = searchFlights('delhi', destination)
      if (delhiFlights.length > 0) allFlights.push({origin: 'Delhi', flights: delhiFlights})
      
      if (allFlights.length > 0) {
        // Get first 3 flights from all available routes
        const combinedFlights: Flight[] = []
        allFlights.forEach(({flights}) => {
          combinedFlights.push(...flights)
        })
        
        const topFlights = combinedFlights.slice(0, 3)
        
        let flightInfo = `Available Flights to ${destInfo.city}\n\n`
        
        topFlights.forEach((f, idx) => {
          flightInfo += `Flight ${idx + 1}: ${f.airline} ${f.flightNumber}\n${f.from} to ${f.to}\n${f.departure} - ${f.arrival} (${f.duration})\nPrice: Rs ${f.price.toLocaleString()} | ${f.availableSeats} seats | ${f.type === 'direct' ? 'Direct' : f.stopover}\n\n`
        })
        
        flightInfo += `Want details? Ask: "Tell me about Flight 1"`
        
        return flightInfo
      }
    }
  }
  
  
  // Flight search - show available flights with origin and destination
  if ((queryLower.includes('flight') || queryLower.includes('fly')) && origin && destination) {
    const flights = searchFlights(origin, destination)
    if (flights.length > 0) {
      let flightList = `**📍 From ${origin.charAt(0).toUpperCase() + origin.slice(1)} to ${destination.charAt(0).toUpperCase() + destination.slice(1)}:**\n\n`
      flightList += flights.slice(0, 5).map((f, idx) => `• **Flight ${idx + 1}** - ${f.airline} ${f.flightNumber}\n  ⏰ ${f.departure} → ${f.arrival} (${f.duration})\n  💰 ₹${f.price.toLocaleString()} • 💺 ${f.availableSeats} seats • ${f.type === 'direct' ? '✈️ Direct' : `🔄 ${f.stopover}`}`).join('\n\n')
      
      return `✈️ **Available Flights**\n\n${flightList}\n\n💡 **Want details?**\n• "Tell me about Flight 1"\n• "Details about ${flights[0].flightNumber}"\n\n**Continue planning:**\n• Hotels in ${destination.charAt(0).toUpperCase() + destination.slice(1)}\n• Activities and attractions\n• Complete trip itinerary`
    }
  }
  
  // Show flights when user specifies origin and destination (remove duplicate logic)
  if (origin && destination && !queryLower.includes('hotel') && !queryLower.includes('activity') && !queryLower.includes('budget') && !queryLower.includes('itinerary') && !queryLower.includes('detail')) {
    const flights = searchFlights(origin, destination)
    if (flights.length > 0) {
      let flightList = `**📍 From ${origin.charAt(0).toUpperCase() + origin.slice(1)} to ${destination.charAt(0).toUpperCase() + destination.slice(1)}:**\n\n`
      flightList += flights.slice(0, 5).map((f, idx) => `• **Flight ${idx + 1}** - ${f.airline} ${f.flightNumber}\n  ⏰ ${f.departure} → ${f.arrival} (${f.duration})\n  💰 ₹${f.price.toLocaleString()} • 💺 ${f.availableSeats} seats • ${f.type === 'direct' ? '✈️ Direct' : `🔄 ${f.stopover}`}`).join('\n\n')
      
      return `✈️ **Available Flights**\n\n${flightList}\n\n💡 **Want details?**\n• "Tell me about Flight 1"\n• "Details about ${flights[0].flightNumber}"\n\n**Continue planning:**\n• Hotels in ${destination.charAt(0).toUpperCase() + destination.slice(1)}\n• Activities and attractions\n• Complete trip itinerary`
    }
  }
  
  // Hotel search queries
  if (queryLower.includes('hotel') || queryLower.includes('stay') || queryLower.includes('accommodation')) {
    if (!destination) destination = 'dubai'
    const hotels = searchHotels(destination)
    if (hotels.length > 0) {
      let hotelList = hotels.map((h, idx) => `• **${h.name}**\n  📍 ${h.location}\n  ⭐ ${h.rating}/5 stars • 💰 ₹${h.pricePerNight.toLocaleString()}/night • 🛏️ ${h.availableRooms} rooms\n  ✨ ${h.amenities.slice(0, 3).join(', ')}`).join('\n\n')
      
      return `🏨 **Hotels in ${destination.charAt(0).toUpperCase() + destination.slice(1)}**\n\n${hotelList}\n\n💡 **Booking Tips:**\n• Book directly for loyalty points\n• Check for package deals with flights\n• Downtown locations offer better connectivity\n\n**Continue planning:**\n• Compare prices for different dates\n• See activities nearby\n• Get complete trip budget`
    }
  }
  
  // Activity/attraction queries
  if (queryLower.includes('activity') || queryLower.includes('activities') || queryLower.includes('do') || queryLower.includes('attraction') || queryLower.includes('tour')) {
    if (!destination) destination = 'dubai'
    const activities = searchActivities(destination)
    if (activities.length > 0) {
      let activityList = activities.map((a, idx) => `• **${a.name}**\n  📍 ${a.location} • ⏱️ ${a.duration}\n  💰 ${a.price === 0 ? 'FREE' : `₹${a.price.toLocaleString()}`} • ⭐ ${a.rating}/5\n  ${a.description}`).join('\n\n')
      
      return `🎯 **Top Activities in ${destination.charAt(0).toUpperCase() + destination.slice(1)}**\n\n${activityList}\n\n💡 **Pro Tips:**\n• Book popular attractions in advance\n• Visit Burj Khalifa at sunset for best views\n• Desert Safari is best in cooler months\n• Combine nearby attractions in one day\n\n**Continue planning:**\n• Find hotels near these attractions\n• Check flight availability\n• Get complete itinerary`
    }
  }
  
  // Budget/cost queries
  if (queryLower.includes('budget') || queryLower.includes('cost') || queryLower.includes('price') || queryLower.includes('how much')) {
    if (!destination) destination = 'dubai'
    const cheapestFlight = searchFlights(origin || 'chennai', destination).sort((a, b) => a.price - b.price)[0]
    const budgetHotel = searchHotels(destination).sort((a, b) => a.pricePerNight - b.pricePerNight)[0]
    
    return `💰 **Trip Budget Estimate for ${destination.charAt(0).toUpperCase() + destination.slice(1)}**\n\n**Flights (Round Trip):**\n• Economy: ₹${cheapestFlight ? (cheapestFlight.price * 2).toLocaleString() : '25,000'} - ₹${cheapestFlight ? (cheapestFlight.price * 2.5).toLocaleString() : '45,000'}\n\n**Accommodation (per night):**\n• Budget: ₹6,000 - ₹10,000\n• Mid-range: ₹15,000 - ₹35,000\n• Luxury: ₹50,000+\n\n**Activities & Attractions:**\n• Free attractions: Dubai Mall, Beaches\n• Paid experiences: ₹1,500 - ₹6,000 each\n\n**Daily Expenses:**\n• Food: ₹2,000 - ₹5,000\n• Transport: ₹1,000 - ₹3,000\n\n**Total for 3-4 days:** ₹50,000 - ₹1,50,000 per person\n\n**Ready to book?**\n\n1️⃣ Show me flights\n2️⃣ Find hotels\n3️⃣ See activities\n4️⃣ Create custom itinerary`
  }
  
  // Destination info queries
  if (queryLower.includes('about') || queryLower.includes('tell me') || queryLower.includes('information')) {
    if (!destination) destination = 'dubai'
    const destInfo = getDestinationInfo(destination)
    if (destInfo) {
      return `📍 **${destInfo.city}, ${destInfo.country}**\n\n${destInfo.description}\n\n🌤️ **Best Time to Visit:** ${destInfo.bestTime}\n\n🎯 **Popular Attractions:**\n${destInfo.popularAttractions.map((a, idx) => `${idx + 1}️⃣ ${a}`).join('\n')}\n\n**What would you like to plan?**\n\n1️⃣ Search flights to ${destInfo.city}\n2️⃣ Find hotels\n3️⃣ Explore activities\n4️⃣ Get budget estimate`
    }
  }
  
  // Itinerary/plan queries
  if (queryLower.includes('itinerary') || queryLower.includes('plan') || queryLower.includes('schedule')) {
    if (!destination) destination = 'dubai'
    return `📅 **Sample 3-Day Itinerary for ${destination.charAt(0).toUpperCase() + destination.slice(1)}**\n\n**Day 1 - Arrival & City Tour**\n• Morning: Arrive and check-in to hotel\n• Afternoon: Visit Dubai Mall & Burj Khalifa\n• Evening: Dubai Fountain Show\n\n**Day 2 - Adventure Day**\n• Morning: Dubai Frame visit\n• Afternoon: Desert Safari with dune bashing\n• Evening: BBQ dinner under the stars\n\n**Day 3 - Leisure & Shopping**\n• Morning: Beach relaxation at JBR\n• Afternoon: Gold Souk & Spice Souk\n• Evening: Dubai Marina Dhow Cruise\n\n**Ready to customize your trip?**\n\n1️⃣ Show me flights\n2️⃣ Find hotels for these dates\n3️⃣ Book specific activities\n4️⃣ Modify the itinerary`
  }
  
  // Default travel planner response with guided questions
  return `✈️ **Welcome to Your Travel Planning Assistant!**\n\nI can help you plan the perfect trip. Let me guide you through the process:\n\n**Step 1: Choose Your Destination**\n1️⃣ Dubai (UAE)\n2️⃣ Abu Dhabi (UAE)\n3️⃣ Paris (France)\n4️⃣ London (UK)\n5️⃣ Singapore\n\n**Or tell me what you need:**\n\n🔹 "Show me flights to Dubai from Chennai"\n🔹 "Find hotels in Dubai"\n🔹 "What activities can I do?"\n🔹 "Give me a budget estimate"\n🔹 "Create an itinerary"\n\nJust type your destination or what you'd like to explore!`
}
