import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createBooking } from "../../services/apiBookings";


export function useCreateBooking() {
  const queryClient = useQueryClient();

  const { mutate: createNewBooking, isLoading: isCreating } = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast.success("New booking successfully created");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createNewBooking };
}
