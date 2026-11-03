import { useDispatch } from "react-redux";
import { setSupportTickets } from "../../Repo/Redux/Modules/SupportTicketSlice";
import axios from "axios";

export const useSupportTicket = () => {
    const dispatch = useDispatch();

    const getSupportTickets = async () => {
        try {
            const response = await axios.get("/api/support-tickets");
            dispatch(setSupportTickets(response.data));
        } catch (error) {
            console.error("Destek talepleri çekilemedi:", error);
            throw error;
        }
    };

    return { getSupportTickets };
};
