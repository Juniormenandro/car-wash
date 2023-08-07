import { BookingType, ProductType } from "@/app/page";
import Selector from "@/components/Selector/Selector";
import useGetTime from "@/hooks/useGetTime/useGetTime";
import React from "react";

const availableTimeSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
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
  const isMiniVallet = "prod_OK1viin1mAvhZM";

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
                  ? "price_1Nc8OKASr8npcUssLnJBR1di"
                  : (product.default_price as string),
              rawPrice: product.raw_price as string,
            })
          }
        >
          <strong>{product.name}</strong>
        </Selector>
      ));

    default:
      return null;
  }
};

export default SelectionSteps;
