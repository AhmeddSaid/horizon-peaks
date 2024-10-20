import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

export async function getBookings({ filter, sortBy, page }) {
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)",
      { count: "exact" }
    );

  // FILTER
  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  // SORT
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
// date : ISOString
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

// Create booking
// Create booking and add a new guest
// Create booking and add a new guest
// Create booking and add a new guest
export async function createBooking(bookingData) {
  // Check if bookingData is defined and has the required properties
  if (!bookingData || typeof bookingData !== "object") {
    throw new Error("Invalid booking data provided. Expected an object.");
  }

  const {
    guest,
    cabinId,
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice,
    status,
    hasBreakfast,
    isPaid,
    observations,
  } = bookingData;

  // Ensure required fields are present
  if (!guest || !cabinId || !startDate || !endDate) {
    throw new Error(
      "Missing required booking data. Please provide guest, cabinId, startDate, and endDate."
    );
  }

  // Log the data being sent to Supabase for debugging purposes

  try {
    // Insert the new guest into the guests table
    const { data: guestData, error: guestError } = await supabase
      .from("guests")
      .insert([guest]) // Insert the new guest
      .select()
      .single(); // Get the inserted guest data

    // Check for errors while inserting the guest
    if (guestError) {
      console.error("Error inserting guest:", guestError);
      throw new Error(`Guest could not be created: ${guestError.message}`);
    }

    // Now that we have the guest, we can use its ID to create the booking
    const guestId = guestData.id; // Assuming the guest table has an 'id' field

    // Insert the new booking into the database
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          guestId,
          cabinId,
          startDate,
          endDate,
          numNights,
          numGuests,
          cabinPrice,
          extrasPrice,
          totalPrice,
          status,
          hasBreakfast,
          isPaid,
          observations,
        },
      ]) // Use guestId for the booking
      .select()
      .single(); // Get the inserted data

    // Check for any errors during the insertion
    if (error) {
      console.error("Error inserting booking:", error); // Log the error for debugging
      throw new Error(`Booking could not be created: ${error.message}`);
    }

    // Return the created booking data
    return data;
  } catch (err) {
    // Catch any unexpected errors and log them with detailed information
    console.error(
      "Unexpected error while creating booking:",
      err.message || err
    );
    throw new Error(
      "An unexpected error occurred while creating the booking. " +
        (err.message || err)
    );
  }
}

// numNights, numGuests, cabinPrice, extrasPrice, totalPrice, status, hasBreakfast, isPaid, observations
