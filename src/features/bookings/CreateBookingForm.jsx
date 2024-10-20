import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiOutlineSearch } from "react-icons/hi";
import { useCreateBooking } from "./useCreateBooking";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { useCabins } from "../cabins/useCabins";
import { formatCurrency } from "../../utils/helpers";
import { useSettings } from "../settings/useSettings";
import { createBooking } from "../../services/apiBookings";
import styled from "styled-components";
import { countries } from "../../data/countries";

const RadioGroup = styled.div`
  display: flex;
  margin: 0.5rem auto;
  justify-content: center;
  align-items: center;
`;

const CountryFlag = styled.img`
  width: 40px;
  height: 25px;
  /* margin-left: 1rem; */
  vertical-align: middle;
  margin-right: 1rem;
`;

const HiddenRadio = styled.input`
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const RadioLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;

  & span {
    display: flex;
    background-color: #fff;
    padding: 0.375em 0.75em;
    position: relative;
    box-shadow: 0 0 0 0.0625em #b5bfd9;
    letter-spacing: 0.05em;
    color: #3e4963;
    text-align: center;
    transition: background-color 0.5s ease;

    &:focus {
      outline: 0;
      border-color: #2260ff;
      box-shadow: 0 0 0 4px #b5c9fc;
    }
  }

  ${HiddenRadio}:checked + span {
    box-shadow: 0 0 0 0.0625em #0043ed;
    background-color: #dee7ff;
    color: #0043ed;
  }
`;

const ButtonsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const Summary = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 400px;
  margin: 2rem 0;
`;

const SummaryChild = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 2rem;
  width: 100%;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const TextArea = styled.textarea`
  border-radius: 12px;
  width: 100%;
  height: 100px;
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  padding: 1rem;
  resize: none;
`;

const Select = styled.div`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  display: "flex";
  align-items: "center";
  gap: "1rem";
  cursor: pointer;
`;

function CreateBookingForm({ onCloseModal }) {
  const { isCreating } = useCreateBooking();
  const { isLoading, cabins } = useCabins();
  const { settings: { breakfastPrice } = {} } = useSettings();

  const { register, handleSubmit, reset, setValue, watch, formState } =
    useForm();
  const { errors } = formState;
  const [cabinPrice, setCabinPrice] = useState(0);
  const [numNights, setNumNights] = useState(0);
  const [breakfast, setBreakfast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [countryFlag, setCountryFlag] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedCabinId = watch("cabinId");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const numGuests = watch("numGuests");
  const status = watch("status");

  const dropdownRef = useRef(null);

  useEffect(() => {
    // Filter countries based on the search term
    setFilteredCountries(
      countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const handleCountrySelect = (country) => {
    setValue("nationality", country.name);
    setValue("countryFlag", country.flag);
    setCountryFlag(country.flag);
    setIsDropdownOpen(false);
    setSearchTerm(country.name);
  };

  useEffect(() => {
    if (Array.isArray(cabins) && cabins.length > 0 && selectedCabinId) {
      const selectedCabin = cabins.find(
        (cabin) => cabin.id === parseInt(selectedCabinId, 10)
      );
      if (selectedCabin) {
        setCabinPrice(selectedCabin.regularPrice);
      } else {
        setCabinPrice(0);
      }
    } else {
      setCabinPrice(0);
    }
  }, [cabins, selectedCabinId]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const differenceInTime = end - start;
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      setNumNights(differenceInDays > 0 ? differenceInDays : 0);
    } else {
      setNumNights(0);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const extrasPrice = breakfast ? numNights * breakfastPrice * numGuests : 0;

  const totalPrice = numNights * cabinPrice + extrasPrice;

  const calculateNumNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  };

  const onSubmit = async (data) => {
    const numNights = calculateNumNights(data.startDate, data.endDate);

    const bookingData = {
      guest: {
        fullName: data.guestName,
        email: data.guestEmail,
        nationality: data.nationality,
        nationalID: data.nationalID,
        countryFlag: data.countryFlag,
      },
      cabinId: data.cabinId,
      startDate: data.startDate,
      endDate: data.endDate,
      numNights,
      numGuests: Number(data.numGuests),
      cabinPrice,
      extrasPrice,
      totalPrice,
      status: status || "unconfirmed",
      hasBreakfast: breakfast,
      isPaid: data.isPaid || false,
      observations: data.observations || "",
    };

    try {
      const newBooking = await createBooking(bookingData);
      toast.success("Booking created successfully");

      handleReset();

      onCloseModal();
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  function handleReset() {
    reset();
    setCountryFlag("");
    setIsDropdownOpen(false);
    setBreakfast(false);
    setSearchTerm("");
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Guest Name" error={errors?.guestName?.message}>
        <Input
          type="text"
          id="guestName"
          {...register("guestName", { required: "This field is required" })}
        />
      </FormRow>
      {/* Country Selector with Flag */}
      <FormRow label="Guest Nationality" error={errors?.nationality?.message}>
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <Select onClick={() => setIsDropdownOpen((prev) => !prev)}>
            {countryFlag && (
              <CountryFlag src={countryFlag} alt="Country flag" />
            )}
            <span>{searchTerm || "Select a country"}</span>
          </Select>
          {isDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: "white",
                border: "1px solid #ccc",
                zIndex: 10,
                width: "100%",
                maxHeight: "400px",
                overflowY: "auto",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                style={{
                  position: "sticky",
                  top: "0",
                }}
              >
                <Input
                  autoFocus
                  type="text"
                  placeholder="Search for a country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: "0.5rem",
                    border: "none",
                    width: "100%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "10px",
                    scale: "1.3",
                    opacity: "0.7",
                    width: "10px",
                    zIndex: 10,
                  }}
                >
                  <HiOutlineSearch />
                </div>
              </div>
              {filteredCountries.length === 0 ? (
                <div style={{ padding: "0.5rem" }}>No countries found</div>
              ) : (
                <div>
                  {filteredCountries.map((country) => (
                    <div
                      key={country.code}
                      onClick={() => handleCountrySelect(country)} // Select country on click
                      style={{
                        padding: "0.5rem",
                        cursor: "pointer",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      {country.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </FormRow>
      <FormRow label="National ID" error={errors?.nationalID?.message}>
        <Input
          type="text"
          id="nationalID"
          {...register("nationalID", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Guest Email" error={errors?.guestEmail?.message}>
        <Input
          type="text"
          id="guestEmail"
          {...register("guestEmail", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Number of Guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          {...register("numGuests", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Start Date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          {...register("startDate", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="End Date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          {...register("endDate", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Cabin" error={errors?.cabinId?.message}>
        <select
          id="cabinId"
          {...register("cabinId", { required: "This field is required" })}
          onChange={(e) => {
            const selectedCabinId = e.target.value;
            setValue("cabinId", selectedCabinId);
            setCabinPrice(0);
          }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            border: "1px solid var(--color-grey-300)",
            backgroundColor: "var(--color-grey-0)",
            borderRadius: " var(--border-radius-sm)",
            padding: "0.8rem 1.2rem",
            boxShadow: "var(--shadow-sm)",
            gap: "1rem",
            cursor: "pointer",
          }}
        >
          <option value="">Select a cabin</option>
          {isLoading ? (
            <option value="">Loading cabins...</option>
          ) : (
            cabins.map((cabin) => (
              <option key={cabin.id} value={cabin.id}>
                <span>
                  {cabin.name} (Max Guests: {cabin.maxCapacity}){" "}
                </span>
                <span>{formatCurrency(cabin.regularPrice)}</span>
              </option>
            ))
          )}
        </select>
      </FormRow>

      {/* <FormRow label="Cabin Price" error={errors?.cabinPrice?.message}>
        <Input
          type="string"
          id="cabinPrice"
          value={formatCurrency(cabinPrice)}
          readOnly
        />
      </FormRow>

      <FormRow label="Extras Price">
        <Input
          type="string"
          id="extrasPrice"
          value={formatCurrency(extrasPrice)}
          readOnly
        />
      </FormRow>

      <FormRow label="Total Price" error={errors?.totalPrice?.message}>
        <Input
          type="string"
          id="totalPrice"
          value={formatCurrency(totalPrice)}
          readOnly
        />
      </FormRow> */}

      <FormRow label="Status" error={errors?.status?.message}>
        <RadioGroup>
          <RadioLabel>
            <HiddenRadio
              type="radio"
              value="unconfirmed"
              defaultChecked // Default checked option
              {...register("status")}
            />
            <span>Unconfirmed</span>
          </RadioLabel>
          <RadioLabel>
            <HiddenRadio
              type="radio"
              value="checked-in"
              {...register("status", { required: "This field is required" })}
            />
            <span>Checked In</span>
          </RadioLabel>
          <RadioLabel>
            <HiddenRadio
              type="radio"
              value="checked-out"
              {...register("status")}
            />
            <span>Checked Out</span>
          </RadioLabel>
        </RadioGroup>
      </FormRow>

      <FormRow label="Has Breakfast" error={errors?.hasBreakfast?.message}>
        <RadioGroup>
          <RadioLabel>
            <HiddenRadio
              type="radio"
              onChange={() => setBreakfast(false)} // Set as boolean false on change
              defaultChecked // Default checked option
              checked={!breakfast}
            />
            <span>No</span>
          </RadioLabel>
          <RadioLabel>
            <HiddenRadio
              type="radio"
              onChange={() => setBreakfast(true)} // Set as boolean true on change
              checked={breakfast}
            />
            <span>Yes</span>
          </RadioLabel>
        </RadioGroup>
      </FormRow>

      <FormRow label="Paid" error={errors?.isPaid?.message}>
        <RadioGroup>
          <RadioLabel>
            <HiddenRadio
              type="radio"
              value="false"
              {...register("isPaid", { required: "This field is required" })}
              defaultChecked
            />
            <span>No</span>
          </RadioLabel>
          <RadioLabel>
            <HiddenRadio
              type="radio"
              value="true"
              {...register("isPaid", { required: "This field is required" })}
            />
            <span>Yes</span>
          </RadioLabel>
        </RadioGroup>
      </FormRow>

      <FormRow label="Observations">
        <TextArea id="observations" {...register("observations")} />
      </FormRow>

      <Summary>
        <SummaryChild>
          <div>Cabin Price :</div> <div>{formatCurrency(cabinPrice)}</div>
        </SummaryChild>
        <SummaryChild>
          <div>Extras Price :</div> <div>{formatCurrency(extrasPrice)}</div>
        </SummaryChild>
        <SummaryChild>
          <div>Total Price :</div> <div>{formatCurrency(totalPrice)}</div>
        </SummaryChild>
      </Summary>

      <ButtonsGroup>
        <Button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Booking"}
        </Button>
        <Button
          type="reset"
          variation="danger"
          disabled={isCreating}
          onClick={() => handleReset()}
        >
          {isCreating ? "Creating..." : "Clear"}
        </Button>
        <Button
          variation="secondary"
          type="button"
          disabled={isCreating}
          onClick={onCloseModal}
        >
          {isCreating ? "Creating..." : "Cancel"}
        </Button>
      </ButtonsGroup>
    </Form>
  );
}

export default CreateBookingForm;
