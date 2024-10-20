import { useState } from "react";
import Button from "../../ui/Button";
import CreateBookingForm from "./CreateBookingForm";
import styled from "styled-components";

const CreateBookingModal = styled.div`
  margin-top: 20px;
`;

function AddBooking() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsModalOpen((prev) => !prev)}>
        {isModalOpen ? "Close" : "Add new booking"}
      </Button>

      {isModalOpen && (
        <CreateBookingModal className="modal-overlay">
          <div className="modal-content">
            {/* <button className="close-button" onClick={closeModal}>
              &times;
            </button> */}
            <CreateBookingForm onCloseModal={() => setIsModalOpen(false)} />
          </div>
        </CreateBookingModal>
      )}
    </div>
  );
}

export default AddBooking;
