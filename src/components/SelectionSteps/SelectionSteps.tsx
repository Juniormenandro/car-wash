import { BookingType, ProductType } from "@/app/page";
import Selector from "@/components/Selector/Selector";
import useGetTime from "@/hooks/useGetTime/useGetTime";
import React from "react";

const availableTimeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

type SelectionStepsProps = {
  step: number;
  data?: ProductType[];
  dates: ReturnType<typeof useGetTime>;
  bookingData: BookingType;
  setBookingData: (newState: BookingType) => void;
  carType: ProductType[];
};

const SelectionSteps: React.FC<SelectionStepsProps> = ({
  step,
  data,
  dates,
  bookingData,
  setBookingData,
  carType,
}) => {

  const isMiniVallet = "price_1O8O0kASr8npcUssqcQKBZmK";

  const isHatch =
    bookingData.selectedProductNane.toLocaleLowerCase() === "hatch";

  switch (step) {
    case 0:
      return carType?.map((product) => (
        <Selector
          key={product.id}
          item={product.id}
          selectedItem={bookingData.selectedProductId}
          onClick={() =>
            setBookingData({
              ...bookingData,
              selectedProductId: product.id,
              selectedProductNane: product.name,
            })
          }
        >
          <strong>{product.name}</strong>
        </Selector>
      ));
    case 1:
      return dates.map((date) => (
        <Selector
          key={date.formattedDate}
          item={date.formattedDate}
          selectedItem={bookingData.formattedDate}
          onClick={() =>
            setBookingData({
              ...bookingData,
              ...date,
            })
          }
        />
      ));
    case 2:
      return availableTimeSlots.map((timeSlot) => (
        <Selector
          key={timeSlot}
          item={timeSlot}
          selectedItem={bookingData.selectedTime}
          onClick={() =>
            setBookingData({
              ...bookingData,
              selectedTime: timeSlot,
            })
          }
        />
      ));
    case 3:
      return data?.map((product) => (
        <Selector
          key={product.id}
          item={product.id}
          selectedItem={bookingData.selectedProductId}
          onClick={() =>
            setBookingData({
              ...bookingData,
              selectedProductId: product.id,
              selectedProductNane: product.name,
              selectedProdutPrice: product.price as string,
              selectedProductDefaultPrice:
                isMiniVallet && isHatch
                  ? "price_1O8Oj4ASr8npcUssQcpDjlUO"
                  : (product.default_price as string),
              rawPrice: product.raw_price as string,
            })
          }
        >
          <strong>{product.name}</strong>
          {bookingData.selectedProductId === product.id && (
            <p className="description">{product.description}</p>
          )}
        </Selector>
      ));

    default:
      return null;
  }
};

export default SelectionSteps;
